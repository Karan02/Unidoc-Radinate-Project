'use client';

import { JSX, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import {
  Loader2,
  RefreshCcw,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await apiFetch('/jobs/runs');
        setJobs(data.jobs || data || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading job history...
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="text-blue-500" /> Job History
        </h1>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      {/* Empty state */}
      {jobs.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-lg">No jobs have been executed yet.</p>
          <p className="text-sm">Run a comparison, drift, or fairness job to populate data.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="py-3 px-4 text-left">Job ID</th>
                <th className="py-3 px-4 text-left">Model</th>
                <th className="py-3 px-4 text-left">Version</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Started</th>
                <th className="py-3 px-4 text-left">Completed</th>
                <th className="py-3 px-4 text-left">Duration</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-mono text-xs text-gray-700">
                    {job.job_id}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {job.model_name}
                  </td>
                  <td className="py-3 px-4">{job.model_version}</td>
                  <td className="py-3 px-4 capitalize">{job.run_type}</td>
                  <td className="py-3 px-4 text-gray-500">
                    {formatDate(job.started_at)}
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {job.completed_at ? formatDate(job.completed_at) : '--'}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {getDuration(job.started_at, job.completed_at)}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={job.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// 🧩 Status badge component
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    success: 'bg-green-100 text-green-700 border border-green-300',
    running: 'bg-blue-100 text-blue-700 border border-blue-300',
    failed: 'bg-red-100 text-red-700 border border-red-300',
    pending: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
  };

  const icons: Record<string, JSX.Element> = {
    success: <CheckCircle size={14} />,
    running: <Loader2 size={14} className="animate-spin" />,
    failed: <XCircle size={14} />,
    pending: <AlertTriangle size={14} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
        styles[status] || styles.pending
      }`}
    >
      {icons[status] || icons.pending}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// 🧩 Helpers
function formatDate(dateString?: string) {
  return dateString
    ? new Date(dateString).toLocaleString(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : '--';
}

function getDuration(start?: string, end?: string) {
  if (!start || !end) return '--';
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
