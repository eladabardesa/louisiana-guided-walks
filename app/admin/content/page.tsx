'use client';

import { FormEvent, useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';

type ContentItem = {
  id: string;
  key: string;
  value: string;
  label: string | null;
};

export default function AdminContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [message, setMessage] = useState('');

  const load = async () => {
    const res = await fetch('/api/admin/content');
    if (res.ok) setItems(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    if (res.ok) {
      setMessage('Text saved');
      load();
    } else {
      setMessage('Save failed');
    }
  };

  return (
    <AdminShell>
      <h2 className="text-xl font-light text-gray-900 mb-2">Site text</h2>
      <p className="text-sm text-gray-500 mb-8 max-w-2xl">
        Edit homepage and about copy without touching code. Run seed once if this list is empty.
      </p>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        {items.map((item, index) => (
          <div key={item.key} className="border border-gray-200 p-4">
            <label className="block text-sm text-gray-900 mb-1">
              {item.label || item.key}
            </label>
            <p className="text-xs text-gray-400 mb-2 font-mono">{item.key}</p>
            <textarea
              rows={item.value.length > 120 ? 6 : 3}
              value={item.value}
              onChange={(e) => {
                const next = [...items];
                next[index] = { ...item, value: e.target.value };
                setItems(next);
              }}
              className="w-full px-3 py-2 border border-gray-300 text-sm"
            />
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-sm text-gray-500">
            No content keys yet. Run <code>npm run seed</code> after migrating the database.
          </p>
        )}

        <button type="submit" className="px-5 py-2.5 bg-gray-900 text-white text-sm">
          Save all text
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
    </AdminShell>
  );
}
