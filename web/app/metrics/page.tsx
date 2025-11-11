'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '../page';

export default function MetricsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await apiFetch('/jobs/history');
        setJobs(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  // if (loading)
  //   return (
  //     <div className="flex items-center justify-center min-h-screen text-gray-500">
  //       Loading metrics...
  //     </div>
  //   );

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <ProtectedRoute allowedRoles={['CMIO', 'Chief Risk Officer', 'Radiology Lead']}>
    <DashboardLayout>
      {loading ? (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading metrics...
      </div>
    ) : null}
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Model Performance Metrics</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No metrics found yet. Try running /jobs/compare.</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-blue-50 text-gray-700 text-sm uppercase">
            <tr>
              <th className="py-3 px-4 text-left">Study UID</th>
              <th className="py-3 px-4 text-left">Model</th>
              <th className="py-3 px-4 text-left">Version</th>
              <th className="py-3 px-4 text-left">Precision</th>
              <th className="py-3 px-4 text-left">Recall</th>
              <th className="py-3 px-4 text-left">F1 Score</th>
              <th className="py-3 px-4 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b hover:bg-blue-50">
                <td className="py-2 px-4">{job.study_uid}</td>
                <td className="py-2 px-4">{job.model_name}</td>
                <td className="py-2 px-4">{job.model_version}</td>
                <td className="py-2 px-4">{job.precision?.toFixed(3)}</td>
                <td className="py-2 px-4">{job.recall?.toFixed(3)}</td>
                <td className="py-2 px-4">{job.f1_score?.toFixed(3)}</td>
                <td className="py-2 px-4 text-gray-500">
                  {new Date(job.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </DashboardLayout></ProtectedRoute>
  );
}
