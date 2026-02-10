"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaPlus, FaTrash, FaEdit, FaUpload, FaCheck, FaTimes } from "react-icons/fa";
import Image from "next/image";

type FrameCategory = "ADDRESS" | "BANK" | "BUSINESS";

interface Frame {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export default function AdminFramesPage() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<FrameCategory>("ADDRESS");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<FrameCategory>("ADDRESS");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formSortOrder, setFormSortOrder] = useState(0);
  const [formFile, setFormFile] = useState<File | null>(null);

  useEffect(() => {
    loadFrames();
  }, []);

  async function loadFrames() {
    setLoading(true);
    try {
      const res = await fetch("/api/nb-card/frames");
      if (!res.ok) throw new Error("Failed to fetch frames");
      const data = await res.json();
      setFrames(data.frames || []);
    } catch (error) {
      console.error("Failed to load frames:", error);
      toast.error("Failed to load frames");
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/nb-card/frames/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Upload failed");
    }

    const data = await res.json();
    return data.imageUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formImageUrl;

      // Upload file if provided
      if (formFile) {
        imageUrl = await handleFileUpload(formFile);
      }

      if (!imageUrl) {
        toast.error("Please provide an image URL or upload a file");
        setUploading(false);
        return;
      }

      if (editingId) {
        // Update existing frame
        const res = await fetch(`/api/nb-card/frames/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            category: formCategory,
            imageUrl,
            sortOrder: formSortOrder,
          }),
        });

        if (!res.ok) throw new Error("Failed to update frame");
        toast.success("Frame updated successfully");
      } else {
        // Create new frame
        const res = await fetch("/api/nb-card/frames", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            category: formCategory,
            imageUrl,
            sortOrder: formSortOrder,
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Failed to create frame");
        }
        toast.success("Frame created successfully");
      }

      // Reset form
      setFormName("");
      setFormCategory("ADDRESS");
      setFormImageUrl("");
      setFormSortOrder(0);
      setFormFile(null);
      setShowCreateForm(false);
      setEditingId(null);
      loadFrames();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error instanceof Error ? error.message : "Operation failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleToggleActive(frame: Frame) {
    try {
      const res = await fetch(`/api/nb-card/frames/${frame.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !frame.isActive }),
      });

      if (!res.ok) throw new Error("Failed to update frame");
      toast.success(frame.isActive ? "Frame deactivated" : "Frame activated");
      loadFrames();
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error("Failed to update frame");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this frame?")) return;

    try {
      const res = await fetch(`/api/nb-card/frames/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete frame");
      toast.success("Frame deleted successfully");
      loadFrames();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete frame");
    }
  }

  function handleEdit(frame: Frame) {
    setFormName(frame.name);
    setFormCategory(frame.category as FrameCategory);
    setFormImageUrl(frame.imageUrl);
    setFormSortOrder(frame.sortOrder);
    setEditingId(frame.id);
    setShowCreateForm(true);
  }

  const categorizedFrames = frames.filter((f) => f.category === selectedCategory);
  const activeCount = frames.filter((f) => f.isActive).length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Frame Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Active frames: {activeCount} / 50
              </p>
            </div>
            <button
              onClick={() => {
                setShowCreateForm(!showCreateForm);
                setEditingId(null);
                setFormName("");
                setFormCategory("ADDRESS");
                setFormImageUrl("");
                setFormSortOrder(0);
                setFormFile(null);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FaPlus /> {showCreateForm ? "Cancel" : "Add Frame"}
            </button>
          </div>

          {showCreateForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                {editingId ? "Edit Frame" : "Create New Frame"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="frame-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    id="frame-name"
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="frame-category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="frame-category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as FrameCategory)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="ADDRESS">Address Details</option>
                    <option value="BANK">Bank Details</option>
                    <option value="BUSINESS">Business Profile</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="frame-image-url" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL (or upload below)
                  </label>
                  <input
                    id="frame-image-url"
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="frame-sort-order" className="block text-sm font-medium text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    id="frame-sort-order"
                    type="number"
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="frame-file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                  Or Upload Image (PNG, JPEG, WebP - max 3MB)
                </label>
                <input
                  id="frame-file-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(e) => setFormFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {formFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {formFile.name} ({(formFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={uploading || (!formImageUrl && !formFile) || !formName}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <FaUpload /> {uploading ? "Uploading..." : editingId ? "Update Frame" : "Create Frame"}
              </button>
            </form>
          )}

          <div className="flex gap-2 mb-4">
            {(["ADDRESS", "BANK", "BUSINESS"] as FrameCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedCategory === cat
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cat === "ADDRESS"
                  ? "Address Details"
                  : cat === "BANK"
                  ? "Bank Details"
                  : "Business Profile"}
                ({frames.filter((f) => f.category === cat).length})
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading frames...</p>
          </div>
        ) : categorizedFrames.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No frames in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorizedFrames.map((frame) => (
              <div
                key={frame.id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                  !frame.isActive ? "opacity-60" : ""
                }`}
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={frame.imageUrl}
                    alt={frame.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {!frame.isActive && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">INACTIVE</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{frame.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Sort Order: {frame.sortOrder}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(frame)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(frame)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        frame.isActive
                          ? "bg-yellow-600 text-white hover:bg-yellow-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {frame.isActive ? (
                        <>
                          <FaTimes /> Deactivate
                        </>
                      ) : (
                        <>
                          <FaCheck /> Activate
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(frame.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      aria-label="Delete frame"
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
    </div>
  );
}
