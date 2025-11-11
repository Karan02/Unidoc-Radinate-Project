import { DriftSignal } from '@/api/drift';
import { Card } from '@/components/ui/Card';
import { AlertTriangle, CheckCircle, Activity } from 'lucide-react';

export const DriftTable: React.FC<{ data: DriftSignal[] }> = ({ data }) => {
  if (!data.length) return <p className="text-gray-500">No drift data available.</p>;

  const statusIcon = (s: string) =>
    s === 'drifted' ? (
      <AlertTriangle className="text-red-500" />
    ) : s === 'warning' ? (
      <Activity className="text-yellow-500" />
    ) : (
      <CheckCircle className="text-green-500" />
    );

  return (
    <Card className="p-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="py-2">Feature</th>
            <th>Method</th>
            <th>P-Value</th>
            <th>Diff</th>
            <th>Status</th>
            <th>Window</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="py-2 font-medium text-gray-800">{d.feature}</td>
              <td>{d.method}</td>
              <td>{d.p_value.toFixed(3)}</td>
              <td>{d.diff.toFixed(3)}</td>
              <td className="flex items-center gap-1">{statusIcon(d.status)} {d.status}</td>
              <td>{d.window}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
