"use client";

import { useState } from "react";
import { Contact } from "@/lib/utils";
import { FaSave, FaTimes, FaTrash, FaDownload, FaUser } from "react-icons/fa";

interface ContactCaptureProps {
  contacts: Contact[];
  onSave: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export function ContactCapture({ contacts, onSave, onDelete }: ContactCaptureProps) {
  const [showForm, setShowForm] = useState(false);
  const [newContact, setNewContact] = useState<Omit<Contact, "id" | "createdAt">>({
    name: "",
    jobTitle: "",
    phone: "",
    email: "",
    company: "",
    category: "Business",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contact: Contact = {
      ...newContact,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    onSave(contact);
    setNewContact({
      name: "",
      jobTitle: "",
      phone: "",
      email: "",
      company: "",
      category: "Business",
      notes: "",
    });
    setShowForm(false);
  };

  const exportVCard = (contact: Contact) => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${contact.name}`,
      `TITLE:${contact.jobTitle}`,
      `TEL:${contact.phone}`,
      `EMAIL:${contact.email}`,
      `ORG:${contact.company}`,
      `NOTE:${contact.notes}`,
      "END:VCARD",
    ].join("\n");

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${contact.name.replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

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

      {/* Add Contact Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                required
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
              <input
                type="text"
                value={newContact.jobTitle}
                onChange={(e) => setNewContact({ ...newContact, jobTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                required
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                required
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
              <input
                type="text"
                value={newContact.company}
                onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={newContact.category}
                onChange={(e) => setNewContact({ ...newContact, category: e.target.value as "Business" | "Personal" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="Business">Business</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
            <textarea
              value={newContact.notes}
              onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
          >
            <FaSave /> Save Contact
          </button>
        </form>
      )}

      {/* Contacts List */}
      {contacts?.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No contacts captured yet. Add your first contact!</p>
      ) : (
        <div className="space-y-3">
          {contacts?.map((contact) => (
            <div key={contact.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-start hover:shadow-md transition-shadow">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">{contact.name}</h3>
                <p className="text-gray-600 text-sm">{contact.jobTitle}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm">
                  <span className="text-gray-600">📞 {contact.phone}</span>
                  <span className="text-gray-600">📧 {contact.email}</span>
                  {contact.company && <span className="text-gray-600">🏢 {contact.company}</span>}
                </div>
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
          ))}
        </div>
      )}
    </div>
  );
}

