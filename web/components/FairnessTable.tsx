import { FairnessMetric } from '@/api/fairness';
import { Card } from '@/components/ui/Card';

export const FairnessTable: React.FC<{ data: FairnessMetric[] }> = ({ data }) => {
  if (!data.length) return <p className="text-gray-500">No fairness data available.</p>;

  const deltaColor = (d: number) => {
    if (d > 0.05) return 'text-green-600';
    if (d < -0.05) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className="p-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="py-2">Subgroup</th>
            <th>Precision</th>
            <th>Recall</th>
            <th>F1 Score</th>
            <th>Δ vs Overall</th>
            <th>Window</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="py-2 font-medium text-gray-800">{row.subgroup}</td>
              <td>{row.precision.toFixed(2)}</td>
              <td>{row.recall.toFixed(2)}</td>
              <td>{row.f1_score.toFixed(2)}</td>
              <td className={deltaColor(row.delta)}>
                {row.delta > 0 ? '+' : ''}
                {row.delta.toFixed(2)}
              </td>
              <td>{row.window}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
