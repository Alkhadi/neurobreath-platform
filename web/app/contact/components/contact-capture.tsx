"use client";

import * as React from "react";

import type { Contact } from "@/lib/utils";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { downloadBlob, generateContactVCard, parseVCardToContact } from "../lib/nbcard-share";
import { importContactsFromCSV, validateCSVFile, generateCSVTemplate } from "@/lib/nb-card/csv-importer";

import { Download, FileUp, Pencil, Plus, Trash2 } from "lucide-react";

type ContactCaptureProps = {
  contacts: Contact[];
  onUpsert: (contact: Contact) => void;
  onDelete: (id: string) => void;
};

type SortKey = "newest" | "name";
type ContactDraft = Omit<Contact, "id" | "createdAt">;

const emptyDraft: ContactDraft = {
  name: "",
  jobTitle: "",
  phone: "",
  email: "",
  company: "",
  category: "Business",
  notes: "",
  socialMedia: {
    instagram: "",
    facebook: "",
    tiktok: "",
    linkedin: "",
    twitter: "",
    website: "",
  },
};

function safeId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}

function contactsToCsv(contacts: Contact[]): string {
  const header = ["name", "jobTitle", "phone", "email", "company", "category", "notes", "createdAt"].join(",");
  const rows = contacts.map((c) =>
    [c.name, c.jobTitle, c.phone, c.email, c.company, c.category, c.notes, c.createdAt]
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header, ...rows].join("\n");
}

export function ContactCapture({ contacts, onUpsert, onDelete }: ContactCaptureProps) {
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("newest");
  const [open, setOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<ContactDraft>(emptyDraft);
  const importInputRef = React.useRef<HTMLInputElement>(null);
  const csvImportInputRef = React.useRef<HTMLInputElement>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? contacts.filter((c) => {
          const haystack = `${c.name} ${c.email} ${c.phone} ${c.company} ${c.jobTitle} ${c.notes}`.toLowerCase();
          return haystack.includes(q);
        })
      : contacts;

    const sorted = [...base].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted;
  }, [contacts, query, sort]);

  function openAdd(initial?: Partial<ContactDraft>) {
    setEditingId(null);
    setDraft({
      ...emptyDraft,
      ...initial,
      socialMedia: { ...emptyDraft.socialMedia, ...(initial?.socialMedia || {}) },
    });
    setOpen(true);
  }

  function openEdit(c: Contact) {
    setEditingId(c.id);
    setDraft({
      name: c.name,
      jobTitle: c.jobTitle,
      phone: c.phone,
      email: c.email,
      company: c.company,
      category: c.category,
      notes: c.notes,
      socialMedia: {
        instagram: c.socialMedia?.instagram ?? "",
        facebook: c.socialMedia?.facebook ?? "",
        tiktok: c.socialMedia?.tiktok ?? "",
        linkedin: c.socialMedia?.linkedin ?? "",
        twitter: c.socialMedia?.twitter ?? "",
        website: c.socialMedia?.website ?? "",
      },
    });
    setOpen(true);
  }

  function save() {
    if (!draft.name.trim()) {
      toast.error("Name is required");
      return;
    }

    const existing = editingId ? contacts.find((c) => c.id === editingId) : undefined;
    const next: Contact = {
      id: existing?.id ?? safeId(),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      name: draft.name.trim(),
      jobTitle: draft.jobTitle ?? "",
      phone: draft.phone ?? "",
      email: draft.email ?? "",
      company: draft.company ?? "",
      category: draft.category ?? "Business",
      notes: draft.notes ?? "",
      socialMedia: {
        instagram: draft.socialMedia?.instagram ?? "",
        facebook: draft.socialMedia?.facebook ?? "",
        tiktok: draft.socialMedia?.tiktok ?? "",
        linkedin: draft.socialMedia?.linkedin ?? "",
        twitter: draft.socialMedia?.twitter ?? "",
        website: draft.socialMedia?.website ?? "",
      },
    };

    onUpsert(next);
    toast.success(existing ? "Contact updated" : "Contact added");
    setOpen(false);
  }

  function exportContactVcard(c: Contact) {
    const vcf = generateContactVCard(c);
    downloadBlob(new Blob([vcf], { type: "text/vcard" }), `${c.name.replace(/\s+/g, "_") || "contact"}.vcf`);
    toast.success("vCard downloaded");
  }

  function exportContactsCsv() {
    const csv = contactsToCsv(contacts);
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), "nbcard_captured_contacts.csv");
    toast.success("Contacts CSV downloaded");
  }

  async function importVcardFile(file: File) {
    try {
      const text = await file.text();
      const parsed = parseVCardToContact(text);
      openAdd({
        name: parsed.name ?? "",
        jobTitle: parsed.jobTitle ?? "",
        phone: parsed.phone ?? "",
        email: parsed.email ?? "",
        company: parsed.company ?? "",
        notes: parsed.notes ?? "",
        category: (parsed.category as ContactDraft["category"]) ?? "Business",
        socialMedia: parsed.socialMedia ?? {},
      });
      toast.success("vCard imported", { description: "Review and save." });
    } catch {
      toast.error("Failed to import vCard");
    } finally {
      if (importInputRef.current) importInputRef.current.value = "";
    }
  }

  async function importCSVFile(file: File) {
    try {
      // Validate file
      const validation = validateCSVFile(file);
      if (!validation.valid) {
        toast.error("Invalid CSV file", { description: validation.error });
        return;
      }

      // Read and parse CSV
      const text = await file.text();
      const { contacts: imported, errors } = importContactsFromCSV(text);

      // Add all imported contacts
      if (imported.length > 0) {
        imported.forEach(contact => onUpsert(contact));
        
        toast.success(`Imported ${imported.length} contact${imported.length === 1 ? '' : 's'}`, {
          description: errors.length > 0 ? `${errors.length} row(s) skipped due to errors` : 'All contacts imported successfully',
        });

        // Show error details if any
        if (errors.length > 0 && errors.length <= 5) {
          setTimeout(() => {
            toast.message("Import warnings", {
              description: errors.join('; '),
            });
          }, 1000);
        }
      } else {
        toast.error("No contacts imported", {
          description: errors.length > 0 ? errors[0] : 'CSV file contains no valid contacts',
        });
      }
    } catch (error) {
      console.error('CSV import error:', error);
      toast.error("Failed to import CSV", {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      if (csvImportInputRef.current) csvImportInputRef.current.value = "";
    }
  }

  function downloadCSVTemplate() {
    const template = generateCSVTemplate();
    downloadBlob(new Blob([template], { type: "text/csv;charset=utf-8" }), "nbcard_import_template.csv");
    toast.success("CSV template downloaded", { description: "Fill in your contacts and import." });
  }

  function deleteContact(id: string) {
    const c = contacts.find((x) => x.id === id);
    if (!c) return;
    if (!confirm(`Delete ${c.name}?`)) return;
    onDelete(id);
    toast.success("Contact deleted");
  }

  return (
    <div className="rounded-2xl border bg-card p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Captured Contacts</h2>
          <p className="text-sm text-muted-foreground">Stored locally on this device. Export any time.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportContactsCsv} disabled={contacts.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>

          <label className="inline-flex">
            <input
              ref={importInputRef}
              type="file"
              accept=".vcf,text/vcard"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void importVcardFile(f);
              }}
            />
            <Button asChild variant="outline">
              <span>
                <FileUp className="mr-2 h-4 w-4" />
                Import vCard
              </span>
            </Button>
          </label>

          <label className="inline-flex">
            <input
              ref={csvImportInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void importCSVFile(f);
              }}
            />
            <Button asChild variant="outline">
              <span>
                <FileUp className="mr-2 h-4 w-4" />
                Import CSV
              </span>
            </Button>
          </label>

          <Button variant="outline" onClick={downloadCSVTemplate}>
            <Download className="mr-2 h-4 w-4" />
            CSV Template
          </Button>

          <Button onClick={() => openAdd()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row">
        <div className="flex-1">
          <Label htmlFor="contact-search">Search</Label>
          <Input
            id="contact-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, phone, company, notes"
          />
        </div>
        <div className="w-full md:w-56">
          <Label>Sort</Label>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="name">Name (A–Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
            No contacts captured yet. Add your first contact!
          </div>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="rounded-xl border p-3">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-sm text-muted-foreground">{[c.jobTitle, c.company].filter(Boolean).join(" · ")}</div>
                  <div className="text-sm text-muted-foreground">{[c.email, c.phone].filter(Boolean).join(" · ")}</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => exportContactVcard(c)}>
                    <Download className="mr-2 h-4 w-4" />
                    vCard
                  </Button>
                  <Button variant="outline" onClick={() => openEdit(c)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => deleteContact(c.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit contact" : "Add contact"}</DialogTitle>
            <DialogDescription>All data is stored locally unless you enable sync later.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Name *</Label>
              <Input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label>Job Title</Label>
              <Input value={draft.jobTitle} onChange={(e) => setDraft((d) => ({ ...d, jobTitle: e.target.value }))} />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input value={draft.email} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input value={draft.phone} onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Company</Label>
              <Input value={draft.company} onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={draft.category} onValueChange={(v) => setDraft((d) => ({ ...d, category: v as Contact["category"] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Notes</Label>
              <Textarea value={draft.notes} onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={save}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/*
 * Legacy/corrupted implementation below (disabled).

import * as React from "react";
import { Contact } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { generateContactVCard, parseVCardToContact, downloadBlob } from "../lib/nbcard-share";
import { importContactsFromCSV, validateCSVFile, generateCSVTemplate } from "@/lib/nb-card/csv-importer";
import { FaDownload, FaTrash, FaUser } from "react-icons/fa";

interface ContactCaptureProps {
  contacts: Contact[];
  onUpsert: (contact: Contact) => void;
  onDelete: (id: string) => void;
}


type ContactDraft = Omit<Contact, "id" | "createdAt">;

const emptyDraft: ContactDraft = {
  name: "",
  jobTitle: "",
  phone: "",
  email: "",
  company: "",
  category: "Business",
  notes: "",
  socialMedia: {
    instagram: "",
    facebook: "",
    tiktok: "",
    linkedin: "",
    twitter: "",
    website: "",
  },
};

type SortKey = "newest" | "name";

export function ContactCapture({ contacts, onUpsert, onDelete }: ContactCaptureProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [draft, setDraft] = useState<ContactDraft>(emptyDraft);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? contacts.filter((c) => {
          const haystack = `${c.name} ${c.email} ${c.phone} ${c.company}`.toLowerCase();
          return haystack.includes(q);
        })
      : contacts;

    const sorted = [...base].sort((a, b) => {
  export function ContactCapture({ contacts, onUpsert, onDelete }: ContactCaptureProps) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted;
  }, [contacts, query, sort]);

  function openAdd() {
    setEditing(null);
    setDraft(emptyDraft);
      const q = query.trim().toLowerCase();
      let list = contacts;
      if (q) {
        list = list.filter((c) => {
          const hay = `${c.name} ${c.email} ${c.phone} ${c.company} ${c.jobTitle} ${c.notes}`.toLowerCase();
          return hay.includes(q);
        });
      }
      list = [...list].sort((a, b) => {
        if (sort === "name") return (a.name || "").localeCompare(b.name || "");
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      return list;
      notes: contact.notes,
      socialMedia: {
        instagram: contact.socialMedia?.instagram || "",
        facebook: contact.socialMedia?.facebook || "",
        tiktok: contact.socialMedia?.tiktok || "",
        linkedin: contact.socialMedia?.linkedin || "",
        twitter: contact.socialMedia?.twitter || "",
        website: contact.socialMedia?.website || "",
      },
    });
    setDialogOpen(true);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const now = new Date().toISOString();
    const contact: Contact = {
      ...(editing ? { id: editing.id, createdAt: editing.createdAt } : { id: Date.now().toString(), createdAt: now }),
      ...draft,
    };
    onUpsert(contact);
    setDialogOpen(false);
    toast.success(editing ? "Contact updated" : "Contact added");
  }

  function exportContactVCard(contact: Contact) {
    const vcard = generateContactVCard(contact);
    const blob = new Blob([vcard], { type: "text/vcard" });
    downloadBlob(blob, `${contact.name.replace(/\s+/g, "_")}.vcf`);
    toast.success("vCard downloaded");
  }

  function exportContactsCsv() {
    const header = [
      "name",
      "jobTitle",
      "phone",
      "email",
      "company",
      "category",
      "notes",
      "website",
      "instagram",
      "facebook",
      "tiktok",
      "linkedin",
      "twitter",
      "createdAt",
    ];

    const rows = contacts.map((c) => [
      c.name,
      c.jobTitle,
      c.phone,
      c.email,
      c.company,
      c.category,
      c.notes,
      c.socialMedia?.website || "",
      c.socialMedia?.instagram || "",
      c.socialMedia?.facebook || "",
      c.socialMedia?.tiktok || "",
      c.socialMedia?.linkedin || "",
      c.socialMedia?.twitter || "",
      c.createdAt,
    ]);

    const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [header.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");

    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), "nbcard_captured_contacts.csv");
    toast.success("Contacts CSV downloaded");
  }

  async function importVcardFile(file: File) {
    try {
      const text = await file.text();
      const parsed = parseVCardToContact(text);
      if (!parsed.name && !parsed.email && !parsed.phone) {
        toast.error("Could not read contact details from that file");
        return;
      }

      const now = new Date().toISOString();
      const contact: Contact = {
        id: Date.now().toString(),
        createdAt: now,
        name: parsed.name || "",
        jobTitle: parsed.jobTitle || "",
        phone: parsed.phone || "",
        email: parsed.email || "",
        company: parsed.company || "",
        category: "Business",
        notes: parsed.notes || "",
        socialMedia: parsed.socialMedia || {},
      };
      onUpsert(contact);
      toast.success("Contact imported");
    } catch {
      toast.error("Failed to import contact");
    }
  }

  useEffect(() => {
    if (!dialogOpen) return;
    /* Legacy content (corrupted) below is intentionally commented out. * /
    // Reset file input each time dialog opens.
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [dialogOpen]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaUser className="text-purple-600" />
          Captured Contacts ({contacts?.length ?? 0})
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center gap-2"
        >
          {showForm ? <FaTimes /> : <FaSave />}
          {showForm ? "Cancel" : "Add Contact"}
        </button>
      </div>

      {/* Add Contact Form * /}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                required
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={exportContactsCsv} disabled={contacts.length === 0}>
                    <FaDownload className="mr-2" />
                    Export captured contacts (CSV)
                  </Button>
                  <Button onClick={openAdd}>Add Contact</Button>
                </div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>

              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <div className="flex-1">
                  <Label htmlFor="contact-search">Search</Label>
                  <Input
                    id="contact-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, email, phone, or company"
                  />
                </div>
                <div className="w-full md:w-56">
                  <Label>Sort</Label>
                  <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="name">Name (A–Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="my-4" />

              {filtered.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <p>No contacts captured yet. Add your first contact!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((contact) => (
                    <div key={contact.id} className="rounded-lg border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{contact.name}</div>
                        <div className="text-sm text-gray-600 truncate">
                          {contact.company ? `${contact.company} • ` : ""}
                          {contact.email}
                          {contact.phone ? ` • ${contact.phone}` : ""}
                        </div>
                        <div className="text-xs text-gray-500">{new Date(contact.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={() => openEdit(contact)}>
                          Edit
                        </Button>
                        <Button variant="secondary" onClick={() => exportContactVCard(contact)}>
                          <FaDownload className="mr-2" />
                          vCard
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this contact?")) {
                              onDelete(contact.id);
                              toast.success("Contact deleted");
                            }
                          }}
                        >
                          <FaTrash className="mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editing ? "Edit Contact" : "Add Contact"}</DialogTitle>
                    <DialogDescription>
                      Add contact details manually, or import from a vCard file.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="c-name">Name *</Label>
                        <Input
                          id="c-name"
                          required
                          value={draft.name}
                          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="c-job">Job Title</Label>
                        <Input
                          id="c-job"
                          value={draft.jobTitle}
                          onChange={(e) => setDraft({ ...draft, jobTitle: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="c-phone">Phone *</Label>
                        <Input
                          id="c-phone"
                          required
                          value={draft.phone}
                          onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="c-email">Email *</Label>
                        <Input
                          id="c-email"
                          type="email"
                          required
                          value={draft.email}
                          onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="c-company">Company</Label>
                        <Input
                          id="c-company"
                          value={draft.company}
                          onChange={(e) => setDraft({ ...draft, company: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Select
                          value={draft.category}
                          onValueChange={(v) => setDraft({ ...draft, category: v as "Business" | "Personal" })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Personal">Personal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="c-notes">Notes</Label>
                      <Textarea
                        id="c-notes"
                        value={draft.notes}
  /* Legacy content (corrupted) below is intentionally commented out. * /
                        onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                        placeholder="Where did you meet? Any important details..."
                      />
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="c-website">Website</Label>
                        <Input
                          id="c-website"
                          value={draft.socialMedia?.website || ""}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              socialMedia: { ...(draft.socialMedia || {}), website: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="c-linkedin">LinkedIn</Label>
                        <Input
                          id="c-linkedin"
                          value={draft.socialMedia?.linkedin || ""}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              socialMedia: { ...(draft.socialMedia || {}), linkedin: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="c-twitter">Twitter</Label>
                        <Input
                          id="c-twitter"
                          value={draft.socialMedia?.twitter || ""}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              socialMedia: { ...(draft.socialMedia || {}), twitter: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="c-instagram">Instagram</Label>
                        <Input
                          id="c-instagram"
                          value={draft.socialMedia?.instagram || ""}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              socialMedia: { ...(draft.socialMedia || {}), instagram: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="c-facebook">Facebook</Label>
                        <Input
                          id="c-facebook"
                          value={draft.socialMedia?.facebook || ""}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              socialMedia: { ...(draft.socialMedia || {}), facebook: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="c-tiktok">TikTok</Label>
                        <Input
                          id="c-tiktok"
                          value={draft.socialMedia?.tiktok || ""}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              socialMedia: { ...(draft.socialMedia || {}), tiktok: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="rounded-md border p-4">
                      <div className="text-sm font-semibold mb-2">Import (vCard)</div>
                      <div className="flex flex-col md:flex-row gap-2 md:items-center">
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept=".vcf,text/vcard"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void importVcardFile(file);
                          }}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            toast.message("QR scan", {
                              description: "QR scanning is available in the next iteration (camera permissions + QR decoding).",
                            });
                          }}
                        >
                          Scan QR to add contact
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        If scanning or importing isn’t supported on this device, add the contact manually.
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save Contact</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {contact.socialMedia.website && (
                        <a href={contact.socialMedia.website} target="_blank" rel="noopener noreferrer" 
                           className="text-purple-600 hover:text-purple-700">
                          <FaGlobe className="inline" /> Website
                        </a>
                      )}
                      {contact.socialMedia.instagram && (
                        <a href={contact.socialMedia.instagram} target="_blank" rel="noopener noreferrer"
                           className="text-pink-600 hover:text-pink-700">
                          <FaInstagram className="inline" /> Instagram
                        </a>
                      )}
                      {contact.socialMedia.facebook && (
                        <a href={contact.socialMedia.facebook} target="_blank" rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-700">
                          <FaFacebook className="inline" /> Facebook
                        </a>
                      )}
                      {contact.socialMedia.linkedin && (
                        <a href={contact.socialMedia.linkedin} target="_blank" rel="noopener noreferrer"
                           className="text-blue-700 hover:text-blue-800">
                          <FaLinkedin className="inline" /> LinkedIn
                        </a>
                      )}
                      {contact.socialMedia.twitter && (
                        <a href={contact.socialMedia.twitter} target="_blank" rel="noopener noreferrer"
                           className="text-blue-400 hover:text-blue-500">
                          <FaTwitter className="inline" /> Twitter
                        </a>
                      )}
                      {contact.socialMedia.tiktok && (
                        <a href={contact.socialMedia.tiktok} target="_blank" rel="noopener noreferrer"
                           className="text-black hover:text-gray-800">
                          <FaTiktok className="inline" /> TikTok
                        </a>
                      )}
                    </div>
                  )}

                  <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${
                    contact.category === "Business" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                  }`}>
                    {contact.category}
                  </span>
                  {contact.notes && <p className="text-gray-500 text-sm mt-2">📝 {contact.notes}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => exportVCard(contact)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Export vCard"
                    aria-label="Export vCard"
                  >
                    <FaDownload />
                  </button>
                  <button
                    onClick={() => onDelete(contact.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete contact"
                    aria-label="Delete contact"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

*/
