'use client';

import { useState, useEffect } from 'react';

type Submission = {
  id: string;
  selectedDate: string;
  ticketQuantity: number;
  fullName: string;
  email: string;
  phone: string;
  note: string | null;
  newsletter: boolean;
  createdAt: string;
};

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');

  // Simple password protection - CHANGE THIS PASSWORD!
  const ADMIN_PASSWORD = 'louisiana2024'; // Change this to something secure!

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      fetchSubmissions();
    } else {
      setError('Incorrect password');
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from local state
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert('Failed to delete submission');
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('Error deleting submission');
    }
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-light mb-6 text-gray-900">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-300 bg-transparent px-0 py-2 text-base text-gray-900 focus:border-gray-900 focus:outline-none"
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              className="w-full border border-gray-900 bg-gray-900 px-6 py-3 text-base font-medium text-white hover:bg-gray-800 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading submissions...</p>
      </main>
    );
  }

  // Calculate tickets per tour
  const walk1Tickets = submissions
    .filter((s) => s.selectedDate.includes('Pilot walk #1'))
    .reduce((sum, s) => sum + s.ticketQuantity, 0);
  
  const walk2Tickets = submissions
    .filter((s) => s.selectedDate.includes('Pilot walk #2'))
    .reduce((sum, s) => sum + s.ticketQuantity, 0);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-light mb-2 text-gray-900">Submissions Management</h1>
          <div className="flex gap-6 text-sm text-gray-600">
            <div>
              <strong>Walk #1:</strong> {walk1Tickets}/10 tickets
            </div>
            <div>
              <strong>Walk #2:</strong> {walk2Tickets}/10 tickets
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {submissions.length === 0 ? (
            <p className="text-gray-600">No submissions yet.</p>
          ) : (
            submissions.map((submission) => (
              <div
                key={submission.id}
                className="border border-gray-200 rounded-sm p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium text-gray-900">{submission.fullName}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(submission.createdAt).toLocaleDateString()} {new Date(submission.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Email:</strong> {submission.email}</p>
                      <p><strong>Phone:</strong> {submission.phone}</p>
                      <p><strong>Tour:</strong> {submission.selectedDate}</p>
                      <p><strong>Tickets:</strong> {submission.ticketQuantity}</p>
                      {submission.note && (
                        <p><strong>Note:</strong> {submission.note}</p>
                      )}
                      <p><strong>Newsletter:</strong> {submission.newsletter ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(submission.id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-sm hover:bg-red-50 transition-colors self-start"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
