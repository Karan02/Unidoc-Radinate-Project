'use client';

import { JSX, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '../page';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await apiFetch('/alerts');
        setAlerts(data.alerts || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, []);

  // if (loading)
  //   return (
  //     <div className="flex items-center justify-center min-h-screen text-gray-500">
  //       Loading alerts...
  //     </div>
  //   );

  if (error)
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
      <ProtectedRoute allowedRoles={['CMIO', 'Chief Risk Officer','Radiology Lead']}>
        
          {loading ? (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading alerts...
      </div>
    ) : null}
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Bell className="text-blue-500" /> System Alerts
        </h1>

        <button
          onClick={async () => {
            try {
              await apiFetch('/alerts/test', { method: 'POST' });
              alert('✅ Test alert triggered!');
              location.reload();
            } catch {
              alert('❌ Failed to send test alert');
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Send Test Alert
        </button>
      </div>

      {/* Empty State */}
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-20">
          <Info size={40} className="mb-3 text-gray-400" />
          <p className="text-lg">No alerts at the moment 🎉</p>
          <p className="text-sm">All systems are healthy.</p>
        </div>
      ) : (
        // Alert Table
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Message</th>
                <th className="py-3 px-4 text-left">Severity</th>
                <th className="py-3 px-4 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {alert.type}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{alert.message}</td>
                  <td className="py-3 px-4">
                    <SeverityBadge severity={alert.severity} />
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {new Date(alert.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
     </ProtectedRoute>
  );
}

// 🧩 SeverityBadge Component
function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    info: 'bg-blue-100 text-blue-700 border border-blue-300',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    critical: 'bg-red-100 text-red-700 border border-red-300',
    success: 'bg-green-100 text-green-700 border border-green-300',
  };

  const icons: Record<string, JSX.Element> = {
    info: <Info size={14} />,
    warning: <AlertTriangle size={14} />,
    critical: <AlertTriangle size={14} />,
    success: <CheckCircle size={14} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${styles[severity] || styles.info}`}
    >
      {icons[severity] || icons.info}
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}
