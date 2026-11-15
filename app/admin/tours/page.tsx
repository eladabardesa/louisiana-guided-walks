'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import ImageField from '@/components/admin/ImageField';
import { formatPriceDkk, formatTourDate } from '@/lib/format';

type Venue = { id: string; name: string; shortName: string };
type TourDate = {
  id: string;
  startsAt: string;
  label: string | null;
  language: string | null;
  capacity: number | null;
  isActive: boolean;
};
type Tour = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  tourType: string;
  price: number;
  capacity: number | null;
  isActive: boolean;
  isB2B: boolean;
  heroImage: string | null;
  images: { src: string; alt: string }[];
  venueId: string | null;
  venue: Venue | null;
  dates: TourDate[];
};

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  tourType: 'REGULAR',
  priceDkk: '0',
  capacity: '10',
  isActive: true,
  isB2B: false,
  heroImage: '',
  venueId: '',
};

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [editing, setEditing] = useState<Tour | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [dateForm, setDateForm] = useState({
    startsAt: '',
    language: 'English',
    capacity: '',
    label: '',
  });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [tRes, vRes] = await Promise.all([
      fetch('/api/admin/tours'),
      fetch('/api/admin/venues'),
    ]);
    if (tRes.ok) setTours(await tRes.json());
    if (vRes.ok) setVenues(await vRes.json());
  };

  useEffect(() => {
    load();
  }, []);

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setMessage('');
  };

  const startEdit = (tour: Tour) => {
    setEditing(tour);
    setForm({
      name: tour.name,
      slug: tour.slug,
      description: tour.description || '',
      tourType: tour.tourType,
      priceDkk: String(tour.price / 100),
      capacity: tour.capacity == null ? '' : String(tour.capacity),
      isActive: tour.isActive,
      isB2B: tour.isB2B,
      heroImage: tour.heroImage || '',
      venueId: tour.venueId || '',
    });
    setMessage('');
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const payload = {
      ...form,
      priceDkk: Number(form.priceDkk),
      capacity: form.capacity === '' ? null : Number(form.capacity),
      venueId: form.venueId || null,
      images: editing?.images || [],
    };

    const res = await fetch(editing ? `/api/admin/tours/${editing.id}` : '/api/admin/tours', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMessage(data.error || 'Save failed');
      return;
    }
    setMessage('Saved');
    await load();
    startEdit(data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tour and its dates?')) return;
    await fetch(`/api/admin/tours/${id}`, { method: 'DELETE' });
    startCreate();
    load();
  };

  const addDate = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const res = await fetch(`/api/admin/tours/${editing.id}/dates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startsAt: dateForm.startsAt,
        language: dateForm.language || null,
        capacity: dateForm.capacity === '' ? null : Number(dateForm.capacity),
        label: dateForm.label || null,
      }),
    });
    if (res.ok) {
      setDateForm({ startsAt: '', language: 'English', capacity: '', label: '' });
      const refreshed = await fetch(`/api/admin/tours/${editing.id}`);
      if (refreshed.ok) startEdit(await refreshed.json());
      load();
    }
  };

  const toggleDate = async (date: TourDate) => {
    await fetch(`/api/admin/dates/${date.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...date, isActive: !date.isActive }),
    });
    if (editing) {
      const refreshed = await fetch(`/api/admin/tours/${editing.id}`);
      if (refreshed.ok) startEdit(await refreshed.json());
    }
    load();
  };

  const deleteDate = async (id: string) => {
    if (!confirm('Delete this date?')) return;
    await fetch(`/api/admin/dates/${id}`, { method: 'DELETE' });
    if (editing) {
      const refreshed = await fetch(`/api/admin/tours/${editing.id}`);
      if (refreshed.ok) startEdit(await refreshed.json());
    }
    load();
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-light text-gray-900">Tours & dates</h2>
        <button
          onClick={startCreate}
          className="px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800"
        >
          New tour
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {tours.map((tour) => (
            <button
              key={tour.id}
              onClick={() => startEdit(tour)}
              className={`w-full text-left border p-4 transition-colors ${
                editing?.id === tour.id
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-900">{tour.name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {tour.venue?.shortName || 'No venue'} · {formatPriceDkk(tour.price)} ·{' '}
                    {tour.dates.filter((d) => d.isActive).length} dates
                  </p>
                </div>
                {!tour.isActive && (
                  <span className="text-[10px] uppercase tracking-wide text-gray-400">Hidden</span>
                )}
              </div>
            </button>
          ))}
          {tours.length === 0 && (
            <p className="text-sm text-gray-500">No tours yet. Create your first one.</p>
          )}
        </div>

        <div className="lg:col-span-3 border border-gray-200 p-5 sm:p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-lg font-light text-gray-900">
              {editing ? 'Edit tour' : 'Create tour'}
            </h3>

            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Type</label>
                <select
                  value={form.tourType}
                  onChange={(e) => setForm({ ...form, tourType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 text-sm"
                >
                  <option value="REGULAR">Regular</option>
                  <option value="FAMILIES_COUPLES">Families & Couples</option>
                  <option value="TEAMBUILDING">Teambuilding</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Venue</label>
                <select
                  value={form.venueId}
                  onChange={(e) => setForm({ ...form, venueId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 text-sm"
                >
                  <option value="">No venue</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Price (DKK)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.priceDkk}
                  onChange={(e) => setForm({ ...form, priceDkk: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">0 = free (no payment step)</p>
              </div>
              <div>
                <label className="block text-sm mb-1">Default capacity</label>
                <input
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 text-sm"
                  placeholder="Unlimited"
                />
              </div>
            </div>

            <ImageField
              label="Hero photo"
              value={form.heroImage}
              onChange={(heroImage) => setForm({ ...form, heroImage })}
            />

            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                Visible on website
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isB2B}
                  onChange={(e) => setForm({ ...form, isB2B: e.target.checked })}
                />
                Inquiry only (no online payment)
              </label>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-gray-900 text-white text-sm hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save tour'}
              </button>
              {editing && (
                <>
                  <Link
                    href={`/tours/${editing.slug}`}
                    className="px-5 py-2.5 border border-gray-300 text-sm hover:border-gray-900"
                  >
                    View public page
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(editing.id)}
                    className="px-5 py-2.5 text-sm text-red-600"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
            {message && <p className="text-sm text-gray-600">{message}</p>}
          </form>

          {editing && (
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h4 className="text-base font-light text-gray-900 mb-4">Tour dates</h4>
              <ul className="space-y-2 mb-6">
                {editing.dates.map((date) => (
                  <li
                    key={date.id}
                    className="flex flex-wrap items-center justify-between gap-2 border border-gray-100 px-3 py-2 text-sm"
                  >
                    <span className={!date.isActive ? 'text-gray-400 line-through' : ''}>
                      {date.label || formatTourDate(date.startsAt, date.language)}
                      {date.capacity != null ? ` · cap ${date.capacity}` : ''}
                    </span>
                    <span className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => toggleDate(date)}
                        className="text-xs text-gray-500 hover:text-gray-900"
                      >
                        {date.isActive ? 'Hide' : 'Show'}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteDate(date.id)}
                        className="text-xs text-red-600"
                      >
                        Delete
                      </button>
                    </span>
                  </li>
                ))}
                {editing.dates.length === 0 && (
                  <li className="text-sm text-gray-500">No dates yet.</li>
                )}
              </ul>

              <form onSubmit={addDate} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-sm mb-1">Date & time</label>
                  <input
                    required
                    type="datetime-local"
                    value={dateForm.startsAt}
                    onChange={(e) => setDateForm({ ...dateForm, startsAt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Language</label>
                  <input
                    value={dateForm.language}
                    onChange={(e) => setDateForm({ ...dateForm, language: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Capacity override</label>
                  <input
                    type="number"
                    min="1"
                    value={dateForm.capacity}
                    onChange={(e) => setDateForm({ ...dateForm, capacity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-sm"
                    placeholder="Use tour default"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="px-4 py-2 border border-gray-900 text-sm hover:bg-gray-900 hover:text-white"
                  >
                    Add date
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
