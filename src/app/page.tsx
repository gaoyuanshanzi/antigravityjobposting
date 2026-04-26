"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { JobCard } from '@/components/JobCard';
import { EmailModal } from '@/components/EmailModal';
import { JobPosting } from '@/lib/data';
import { LogOut, Mail, Loader2, Inbox } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const router = useRouter();

  const handleCityToggle = (city: string) => {
    setSelectedCities(prev => 
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  };

  const fetchJobs = async () => {
    if (selectedCities.length === 0 || !geminiApiKey) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cities: selectedCities, apiKey: geminiApiKey }),
      });
      const data = await res.json();
      if (res.ok) {
        setJobs(data.jobs || []);
      } else {
        console.error('Failed to fetch jobs:', data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to fetch jobs', error);
      alert('An unexpected error occurred while fetching jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      <Sidebar 
        selectedCities={selectedCities} 
        onCityToggle={handleCityToggle} 
        onStart={fetchJobs} 
        isReady={selectedCities.length > 0 && geminiApiKey.trim().length > 0}
      />

      <main className="flex-1 ml-72 flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md px-8 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold">Results</h2>
            <p className="text-sm text-gray-400 mt-1">
              {jobs.length > 0 ? `Found ${jobs.length} postings in selected cities` : 'No results yet'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <input 
              type="password" 
              placeholder="Enter Gemini API Key..." 
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 text-white"
            />
            <button
              onClick={() => setIsEmailModalOpen(true)}
              disabled={jobs.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors"
            >
              <Mail size={18} />
              Send via Email
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-gray-700 hover:bg-gray-800 text-gray-300 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Loader2 size={48} className="animate-spin mb-4 text-indigo-500" />
              <p>Searching for jobs...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {jobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-6">
                <Inbox size={48} className="text-gray-700" />
              </div>
              <p className="text-xl font-medium text-gray-400">Ready to explore</p>
              <p className="mt-2 text-center max-w-md">
                Select your preferred cities from the sidebar and click Start Search to discover opportunities.
              </p>
            </div>
          )}
        </div>
      </main>

      {isEmailModalOpen && (
        <EmailModal jobs={jobs} onClose={() => setIsEmailModalOpen(false)} />
      )}
    </div>
  );
}
