import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please complete all required fields');
      return;
    }
    setSubmitted(true);
    toast.success('Thank you! Your message has been routed to ApexQuant Support.');
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-12">
      <div className="text-center space-y-4">
        <span className="px-3.5 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono rounded-full">
          24/7 Institutional Support
        </span>
        <h1 className="text-4xl font-extrabold font-heading text-white">Contact ApexQuant</h1>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Have questions regarding platform features, API connectivity, or admin accounts? Send us a direct inquiry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6 md:col-span-1">
          <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 text-slate-300 text-xs">
              <Mail className="text-cyan-400 shrink-0" size={18} />
              <span>support@apexquant.io</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-xs">
              <Phone className="text-emerald-400 shrink-0" size={18} />
              <span>+1 (800) 555-APEX</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-xs">
              <MapPin className="text-blue-400 shrink-0" size={18} />
              <span>Wall Street Financial Tower, NY</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 p-8 bg-[#0B1120] border border-slate-800 rounded-3xl">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <MessageSquare size={40} className="text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold font-heading text-white">Inquiry Received</h3>
              <p className="text-slate-400 text-xs">Our quant support team will review your message shortly.</p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', email: '', subject: '', message: '' });
                }}
                className="px-6 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                  placeholder="Platform question..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Message</label>
                <textarea
                  rows="4"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs resize-none"
                  placeholder="Type your message..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-heading font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                Submit Inquiry <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
