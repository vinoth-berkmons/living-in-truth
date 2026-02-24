import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { getDB, setDB, initDB, DB_KEY } from '@/lib/db';

const AdminSettings = () => {
  const [message, setMessage] = useState('');

  const handleExport = () => {
    const db = getDB();
    if (!db) return;
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `livingintruth-db-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Database exported.');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          setDB(data);
          setMessage('Database imported. Refresh to see changes.');
        } catch {
          setMessage('Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (confirm('This will reset all data to defaults. Export first? Click OK to proceed.')) {
      localStorage.removeItem(DB_KEY);
      initDB();
      setMessage('Database reset to defaults.');
      window.location.reload();
    }
  };

  return (
    <AdminLayout requiredPermission="manage_settings">
      <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>

      <div className="mt-6 space-y-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Data Management</h2>
          <p className="mt-1 text-sm text-muted-foreground">Export, import, or reset the local database.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={handleExport} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Export DB</button>
            <button onClick={handleImport} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">Import DB</button>
            <button onClick={handleReset} className="rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">Reset to Defaults</button>
          </div>
          {message && <p className="mt-3 text-sm text-primary">{message}</p>}
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Phase 0 Notice</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All data is stored in localStorage (single browser/device). Changes made here are only visible in this browser. Phase 1 will introduce API-backed persistence.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
