'use client';

import { useEffect, useState } from 'react';
// import { apiFetch } from '@/lib/api';
import {  fetchFairnessMetrics,FairnessMetric } from '@/api/fairness';
import { Scale, TrendingUp, TrendingDown, Info } from 'lucide-react';
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from 'recharts';
import { Card } from '@/components/ui/Card';
import { FairnessTable } from '@/components/FairnessTable';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '../page';
import { apiFetch } from '@/lib/api';

type FairnessData = {
  model_name: string;
  avg_bias: number;
  subgroups: FairnessMetric[];
};

interface FairnessPageProps {
  loading: boolean;
  metrics: FairnessData | null;
}


export default function FairnessPage() {
    const [metrics, setMetrics] = useState<FairnessData | null>(null);
    const [loading, setLoading] = useState(true);
    
    const biasColor = (bias: number) => {
    if (bias > 0.05) return 'text-green-600';
    if (bias < -0.05) return 'text-red-600';
    return 'text-gray-700';
  };
  
    useEffect(() => {
      (async () => {
        try {
          // const data = await fetchFairnessMetrics('AIModel-X');
          const data = await apiFetch('/fairness/AIModel-X');
          
          setMetrics(data);
        } catch (e) {
          console.error('Failed to fetch fairness metrics', e);
        } finally {
          setLoading(false);
        }
      })();
    }, []);

  // if (loading)
  //   return (
  //     <div className="flex items-center justify-center min-h-screen text-gray-500">
  //       Loading fairness data...
  //     </div>
  //   );

  // if (error)
  //   return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
          <ProtectedRoute allowedRoles={["CFO", "Chief Risk Officer", "CMIO", "Radiology Lead"]}>
      <DashboardLayout>
        {loading ? (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading fairness metrics...
      </div>
    ) : null}
     <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Fairness Monitor</h1>
      
      {loading ? (
        <p className="text-gray-500">Loading fairness metrics...</p>
      ) : metrics ? (
        <>
          {/* Summary Card */}
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Model: <span className="text-blue-600">{metrics.model_name}</span>
                </h2>
                <p className="text-sm text-gray-600">
                  Displays subgroup fairness metrics (Precision, Recall, F1 Score, and Δ vs overall).  
                  Positive delta indicates better subgroup performance.
                </p>
              </div>
              <div className="mt-3 sm:mt-0">
                <p className="text-sm text-gray-600 font-medium">Average Bias</p>
                <p className={`text-xl font-bold ${biasColor(metrics.avg_bias)}`}>
                  {metrics.avg_bias > 0 ? '+' : ''}
                  {metrics.avg_bias.toFixed(3)}
                </p>
              </div>
            </div>
          </Card>

          {/* Subgroup Table */}
          <FairnessTable data={metrics.subgroups} />
        </>
      ) : (
        <p className="text-gray-500">No fairness data available.</p>
      )}
    </div>  </DashboardLayout></ProtectedRoute>
  );
}

// 🧩 Delta-based badge
function StatusBadge({ delta }: { delta: number }) {
  if (delta > 0.05)
    return (
      <span className="flex items-center gap-1 bg-green-100 text-green-700 border border-green-300 px-2 py-1 rounded-full text-xs font-medium">
        <TrendingUp size={14} /> Improved
      </span>
    );

  if (delta < -0.05)
    return (
      <span className="flex items-center gap-1 bg-red-100 text-red-700 border border-red-300 px-2 py-1 rounded-full text-xs font-medium">
        <TrendingDown size={14} /> Biased
      </span>
    );

  return (
    <span className="flex items-center gap-1 bg-gray-100 text-gray-600 border border-gray-300 px-2 py-1 rounded-full text-xs font-medium">
      Stable
    </span>
  );
}
