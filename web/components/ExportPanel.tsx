import { useState } from 'react';
import { generateMonthlyPack } from '@/api/exports';
import { Card } from '@/components/ui/Card';
import { apiFetch } from '@/lib/api';

export const ExportPanel = () => {
  const [downloading, setDownloading] = useState(false);

  const handleExport = async () => {
    setDownloading(true);
    try {
      const blob = await generateMonthlyPack();
      apiFetch('/exports/monthly-pack', {method:'GET'});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `radinate_monthly_pack_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Export failed', err);
      alert('Export failed, please check server logs.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card className="p-6 flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Monthly Export Pack</h3>
      <p className="text-sm text-gray-600">
        Generate and download monthly ZIP reports containing metrics, drift, and fairness CSVs.
      </p>
      <button
        onClick={handleExport}
        disabled={downloading}
        className="self-start bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
      >
        {downloading ? 'Preparing...' : 'Download Monthly Pack'}
      </button>
    </Card>
  );
};
