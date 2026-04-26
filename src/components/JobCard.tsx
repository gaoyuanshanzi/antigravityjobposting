import { JobPosting } from '@/lib/data';
import { MapPin, Building2, Calendar } from 'lucide-react';

interface JobCardProps {
  job: JobPosting;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500/50 transition-colors shadow-lg group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
            {job.title}
          </h3>
          <div className="flex items-center text-gray-400 mt-2 space-x-4 text-sm">
            <div className="flex items-center">
              <Building2 size={16} className="mr-1" />
              {job.company}
            </div>
            <div className="flex items-center">
              <MapPin size={16} className="mr-1" />
              {job.location}
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              {job.date}
            </div>
          </div>
        </div>
        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-medium uppercase tracking-wider">
          {job.language}
        </span>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
        {job.description}
      </p>
    </div>
  );
}
