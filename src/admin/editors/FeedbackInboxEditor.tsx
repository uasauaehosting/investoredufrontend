import { useState, useEffect } from 'react';
import { Trash2, Mail, X, Inbox, ChevronLeft, User, Clock } from 'lucide-react';
import { api } from '../../lib/api';
import SectionHeader from '../components/SectionHeader';
import EmptyState from '../components/EmptyState';

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

const STATUS_COLORS: Record<string, string> = {
  Pending:     'bg-amber-100 text-amber-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Resolved:    'bg-green-100 text-green-700',
  Closed:      'bg-gray-100 text-gray-500',
};

function formatDate(iso?: string) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return ''; }
}

export default function FeedbackInboxEditor() {
  const [items, setItems]           = useState<FeedbackItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setFilter]   = useState<(typeof STATUSES)[number]>('all');
  const [selected, setSelected]     = useState<FeedbackItem | null>(null);
  const [response, setResponse]     = useState('');
  const [saving, setSaving]         = useState(false);
  // on mobile: show list or detail
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  const load = async () => {
    setLoading(true);
    try {
      const q = statusFilter === 'all' ? '' : `?status=${encodeURIComponent(statusFilter)}`;
      setItems(Array.isArray(await api.get(`/feedback${q}`)) ? await api.get(`/feedback${q}`) : []);
    } catch (e) { console.error(e); setItems([]); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectItem = (item: FeedbackItem) => {
    setSelected(item);
    setResponse(item.response ?? '');
    setMobileView('detail');
  };

  const backToList = () => { setMobileView('list'); };

  const updateStatus = async (id: number, status: FeedbackItem['status']) => {
    await api.put(`/feedback/${id}/status`, { status });
    load();
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
  };

  const sendResponse = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await api.put(`/feedback/${selected.id}/respond`, { response });
      setResponse('');
      load();
      setSelected(null);
      setMobileView('list');
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Permanently delete this submission?')) return;
    await api.delete(`/feedback/${id}`);
    if (selected?.id === id) { setSelected(null); setMobileView('list'); }
    load();
  };

  return (
    <div>
      <SectionHeader
        title="Feedback Inbox"
        description="View and respond to submissions from the public feedback form."
        action={
          <select value={statusFilter} onChange={(e) => setFilter(e.target.value as typeof statusFilter)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20">
            {STATUSES.map((s) => <option key={s} value={s}>{s === 'all' ? 'All statuses' : s}</option>)}
          </select>
        }
      />

      {loading ? (
        <div className="animate-pulse text-gray-400 text-sm p-6">Loading submissions…</div>
      ) : items.length === 0 ? (
        <EmptyState icon={<Inbox size={40} strokeWidth={1.5} />}
          title="No submissions found"
          description={statusFilter === 'all' ? 'No feedback has been submitted yet.' : `No submissions with status "${statusFilter}".`} />
      ) : (
        <div className="grid lg:grid-cols-5 gap-4 min-h-[500px]">

          {/* ── List panel ── */}
          <div className={`lg:col-span-2 space-y-1.5 ${mobileView === 'detail' ? 'hidden lg:block' : 'block'}`}>
            {items.map((item) => (
              <button key={item.id} type="button" onClick={() => selectItem(item)}
                className={`w-full text-start rounded-xl border px-4 py-3 transition-colors ${
                  selected?.id === item.id
                    ? 'border-[#009900] bg-green-50 ring-1 ring-[#009900]/20'
                    : 'border-gray-200 bg-white hover:border-green-300'
                }`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.subject}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_COLORS[item.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{item.name} · {item.email}</p>
                {item.createdAt && (
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={10} /> {formatDate(item.createdAt)}
                  </p>
                )}
              </button>
            ))}
          </div>

          {/* ── Detail panel ── */}
          <div className={`lg:col-span-3 ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
            {!selected ? (
              <div className="h-full flex items-center justify-center bg-white rounded-2xl border border-dashed border-gray-200 min-h-[280px]">
                <div className="text-center">
                  <Mail size={28} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400">Select a submission to view details</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 flex flex-col h-full">
                {/* Detail header */}
                <div className="flex items-start gap-3 px-5 py-4 border-b border-gray-100">
                  {/* Mobile back button */}
                  <button onClick={backToList} className="lg:hidden p-1 text-gray-400 hover:text-gray-600 mt-0.5">
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-base truncate">{selected.subject}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <User size={11} /> {selected.name}
                      </span>
                      <a href={`mailto:${selected.email}`} className="text-xs text-[#009900] hover:underline">{selected.email}</a>
                      {selected.phone && <span className="text-xs text-gray-400">{selected.phone}</span>}
                    </div>
                    {selected.category && (
                      <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{selected.category}</span>
                    )}
                  </div>
                  <button onClick={() => { setSelected(null); setMobileView('list'); }} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 flex-shrink-0">
                    <X size={15} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  {/* Message */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Message</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                  </div>

                  {/* Status update */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {(['Pending', 'In Progress', 'Resolved', 'Closed'] as const).map((s) => (
                        <button key={s} onClick={() => updateStatus(selected.id, s)}
                          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                            selected.status === s
                              ? 'bg-[#009900] text-white border-[#009900]'
                              : 'border-gray-200 text-gray-600 hover:border-green-300 hover:text-[#009900]'
                          }`}>
                          {s}
                        </button>
                      ))}
                      <button onClick={() => remove(selected.id)}
                        className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1 transition-colors">
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Admin response */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Admin Response <span className="text-gray-400 font-normal">(internal note)</span></label>
                    <textarea rows={4} value={response} onChange={(e) => setResponse(e.target.value)}
                      placeholder="Write a response to record internally…"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900] resize-none" />
                    <button onClick={sendResponse} disabled={saving || !response.trim()}
                      className="btn-primary mt-2 flex items-center gap-1.5 text-sm">
                      <Mail size={13} /> {saving ? 'Saving…' : 'Save Response'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
