'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';

type Submission = {
  id: string;
  selectedDate: string;
  ticketQuantity: number;
  fullName: string;
  email: string;
  phone: string;
  note: string | null;
  newsletter: boolean;
  venue: string | null;
  tourType: string | null;
  createdAt: string;
};

export default function AdminInquiriesPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/submissions');
    if (res.ok) setSubmissions(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return;
    const res = await fetch(`/api/admin/submissions/${id}`, { method: 'DELETE' });
    if (res.ok) setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <AdminShell>
      <h2 className="text-xl font-light text-gray-900 mb-2">Contact inquiries</h2>
      <p className="text-sm text-gray-500 mb-6">
        Messages from the contact form (including B2B / teambuilding requests).
      </p>

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <div key={s.id} className="border border-gray-200 p-4">
              <div className="flex justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-900">{s.fullName}</p>
                  <p className="text-sm text-gray-500">
                    {s.email}
                    {s.phone ? ` · ${s.phone}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                {[s.venue, s.tourType, s.selectedDate !== 'N/A' ? s.selectedDate : null]
                  .filter(Boolean)
                  .join(' · ') || 'General inquiry'}
              </p>
              {s.note && <p className="text-sm text-gray-500 mt-2">{s.note}</p>}
              <p className="text-xs text-gray-400 mt-3">
                {new Date(s.createdAt).toLocaleString()}
                {s.newsletter ? ' · Newsletter yes' : ''}
              </p>
            </div>
          ))}
          {submissions.length === 0 && (
            <p className="text-sm text-gray-500">No inquiries yet.</p>
          )}
        </div>
      )}
    </AdminShell>
  );
}
