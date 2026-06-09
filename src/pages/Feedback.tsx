import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { MessageSquare, Send, Mail, User, Phone, Globe } from 'lucide-react';

export default function Feedback() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/feedback', form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-[#009900] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">Feedback & Inquiries</h1>
          <p className="text-green-200 text-lg max-w-2xl mx-auto">
            Your voice matters. Help us improve the portal or reach out with your questions.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#009900] mb-8 flex items-center gap-3">
                <MessageSquare className="text-amber-500" />
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        required
                        type="text" 
                        className="w-full ps-12 pe-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#009900]/20"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        required
                        type="email" 
                        className="w-full ps-12 pe-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#009900]/20"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#009900]/20"
                    placeholder="General Inquiry"
                    value={form.subject}
                    onChange={e => setForm({...form, subject: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea 
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#009900]/20 resize-none"
                    placeholder="How can we help you today?"
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                  />
                </div>

                <button 
                  disabled={sending}
                  className="w-full bg-[#009900] hover:bg-[#006600] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {sending ? 'Sending...' : (
                    <>
                      <Send size={18} />
                      Submit Feedback
                    </>
                  )}
                </button>

                {status === 'success' && (
                  <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center font-medium">
                    Thank you! Your message has been sent successfully.
                  </div>
                )}
                {status === 'error' && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center font-medium">
                    Sorry, something went wrong. Please try again later.
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-[#009900] mb-6">Contact Info</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Email Us</p>
                    <p className="text-gray-700 font-medium">info@uasa.ae</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Website</p>
                    <p className="text-gray-700 font-medium">www.uasa.ae</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
