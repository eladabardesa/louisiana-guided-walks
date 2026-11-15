'use client';

import { FormEvent, useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import ImageField from '@/components/admin/ImageField';

type Venue = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  heroImage: string;
  images: { src: string; alt: string }[];
  sortOrder: number;
  isActive: boolean;
};

const emptyForm = {
  name: '',
  slug: '',
  shortName: '',
  tagline: '',
  description: '',
  heroImage: '',
  sortOrder: '0',
  isActive: true,
  galleryText: '',
};

export default function AdminVenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [editing, setEditing] = useState<Venue | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');

  const load = async () => {
    const res = await fetch('/api/admin/venues');
    if (res.ok) setVenues(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const startEdit = (venue: Venue) => {
    setEditing(venue);
    setForm({
      name: venue.name,
      slug: venue.slug,
      shortName: venue.shortName,
      tagline: venue.tagline,
      description: venue.description,
      heroImage: venue.heroImage,
      sortOrder: String(venue.sortOrder),
      isActive: venue.isActive,
      galleryText: (venue.images || [])
        .map((img) => `${img.src}|${img.alt || ''}`)
        .join('\n'),
    });
  };

  const parseGallery = () =>
    form.galleryText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [src, ...altParts] = line.split('|');
        return { src: src.trim(), alt: altParts.join('|').trim() };
      });

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      sortOrder: Number(form.sortOrder) || 0,
      images: parseGallery(),
    };
    const res = await fetch(editing ? `/api/admin/venues/${editing.id}` : '/api/admin/venues', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Save failed');
      return;
    }
    setMessage('Saved');
    await load();
    startEdit(data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this venue?')) return;
    await fetch(`/api/admin/venues/${id}`, { method: 'DELETE' });
    startCreate();
    load();
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-light text-gray-900">Venues</h2>
        <button
          onClick={startCreate}
          className="px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800"
        >
          New venue
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {venues.map((venue) => (
            <button
              key={venue.id}
              onClick={() => startEdit(venue)}
              className={`w-full text-left border p-4 ${
                editing?.id === venue.id
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <p className="text-sm text-gray-900">{venue.name}</p>
              <p className="text-xs text-gray-400 mt-1">/{venue.slug}</p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="lg:col-span-3 border border-gray-200 p-5 space-y-4">
          <h3 className="text-lg font-light">{editing ? 'Edit venue' : 'Create venue'}</h3>
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Short name"
              value={form.shortName}
              onChange={(e) => setForm({ ...form, shortName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 text-sm"
            />
            <input
              placeholder="Slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 text-sm"
            />
          </div>
          <input
            placeholder="Tagline"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 text-sm"
          />
          <textarea
            rows={5}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 text-sm"
          />
          <ImageField
            label="Hero image"
            value={form.heroImage}
            onChange={(heroImage) => setForm({ ...form, heroImage })}
          />
          <div>
            <label className="block text-sm mb-1">Gallery (one per line: path|alt text)</label>
            <textarea
              rows={4}
              value={form.galleryText}
              onChange={(e) => setForm({ ...form, galleryText: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 text-sm font-mono"
              placeholder="/venues/photo.jpg|Caption"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 text-sm"
              placeholder="Sort order"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Visible
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-5 py-2.5 bg-gray-900 text-white text-sm">
              Save venue
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => handleDelete(editing.id)}
                className="px-5 py-2.5 text-sm text-red-600"
              >
                Delete
              </button>
            )}
          </div>
          {message && <p className="text-sm text-gray-600">{message}</p>}
        </form>
      </div>
    </AdminShell>
  );
}
