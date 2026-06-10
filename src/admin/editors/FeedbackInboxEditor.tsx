import { useState, useEffect } from 'react';
import { Trash2, Mail, X } from 'lucide-react';
import { api } from '../../lib/api';

interface FeedbackItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Closed';
  response?: string;
  createdAt?: string;
}

const STATUSES = ['all', 'Pending', 'In Progress', 'Resolved', 'Closed'] as const;

export default function FeedbackInboxEditor() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUSES)[number]>('all');
  const [selected, setSelected] = useState<FeedbackItem | null>(null);
  const [response, setResponse] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const query = statusFilter === 'all' ? '' : `?status=${encodeURIComponent(statusFilter)}`;
      const data = await api.get(`/feedback${query}`);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const updateStatus = async (id: number, status: FeedbackItem['status']) => {
    await api.put(`/feedback/${id}/status`, { status });
    load();
    if (selected?.id === id) {
      setSelected((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const sendResponse = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await api.put(`/feedback/${selected.id}/respond`, { response });
      setResponse('');
      load();
      setSelected(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this feedback submission?')) return;
    await api.delete(`/feedback/${id}`);
    if (selected?.id === id) setSelected(null);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Feedback Inbox</h2>
          <p className="text-xs text-gray-400">View and respond to submissions from /feedback</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as (typeof STATUSES)[number])}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All statuses' : s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm animate-pulse">Loading submissions...</div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => { setSelected(item); setResponse(item.response ?? ''); }}
                className={`w-full text-start bg-white rounded-xl border p-3 transition-colors ${
                  selected?.id === item.id ? 'border-[#009900] ring-1 ring-[#009900]/20' : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{item.subject}</p>
                    <p className="text-xs text-gray-500">{item.name} · {item.email}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 shrink-0">{item.status}</span>
                </div>
              </button>
            ))}
            {items.length === 0 && <p className="text-sm text-gray-400 py-8 text-center">No submissions found.</p>}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 min-h-[280px]">
            {!selected ? (
              <p className="text-sm text-gray-400 text-center py-16">Select a submission to view details.</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-800">{selected.subject}</h3>
                    <p className="text-xs text-gray-500 mt-1">{selected.name} · {selected.email}</p>
                    {selected.phone && <p className="text-xs text-gray-500">{selected.phone}</p>}
                    <p className="text-xs text-gray-400 mt-1">{selected.category}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{selected.message}</p>
                <div className="flex flex-wrap gap-2">
                  {(['Pending', 'In Progress', 'Resolved', 'Closed'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`text-xs px-2.5 py-1 rounded-full border ${
                        selected.status === s ? 'bg-[#009900] text-white border-[#009900]' : 'border-gray-200 text-gray-600 hover:border-green-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                  <button onClick={() => remove(selected.id)} className="text-xs px-2.5 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Admin response</label>
                  <textarea
                    rows={4}
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="Write a response to record internally..."
                  />
                  <button
                    onClick={sendResponse}
                    disabled={saving || !response.trim()}
                    className="btn-primary mt-2 flex items-center gap-1.5 text-sm"
                  >
                    <Mail size={14} /> {saving ? 'Saving...' : 'Save Response'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
