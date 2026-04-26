"use client";

import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { JobPosting } from '@/lib/data';

interface EmailModalProps {
  jobs: JobPosting[];
  onClose: () => void;
}

export function EmailModal({ jobs, onClose }: EmailModalProps) {
  const [emails, setEmails] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSend = async () => {
    if (!emails.trim()) return;
    
    setLoading(true);
    setStatus(null);

    const emailList = emails.split(',').map(e => e.trim()).filter(e => e);

    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: emailList, jobs }),
      });

      if (res.ok) {
        setStatus({ type: 'success', message: 'Emails sent successfully!' });
        setTimeout(() => onClose(), 2000);
      } else {
        const data = await res.json();
        setStatus({ type: 'error', message: data.error || 'Failed to send emails' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-lg border border-gray-700 shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Send Job Postings</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Recipients (comma-separated)
            </label>
            <textarea
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-24"
              placeholder="user1@example.com, user2@example.com"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 text-sm text-gray-400">
            You are about to send <strong className="text-indigo-400">{jobs.length}</strong> job postings.
          </div>

          {status && (
            <div className={`p-3 rounded-lg text-sm text-center ${
              status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {status.message}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading || !emails.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {loading ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </div>
    </div>
  );
}
