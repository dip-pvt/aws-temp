import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Globe, 
  HardDrive, 
  Info, 
  Network, 
  RefreshCw, 
  Server, 
  User 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SystemInfo {
  platform: string;
  release: string;
  arch: string;
  uptime: number;
  hostname: string;
  cpu: {
    model: string;
    cores: number;
    speed: number;
    loadAvg: number[];
  };
  memory: {
    total: number;
    free: number;
    used: number;
    usagePercent: string;
  };
  disk: {
    total: number;
    used: number;
    available: number;
  } | null;
  network: Array<{
    name: string;
    details: any[];
  }>;
  process: {
    uptime: number;
    memory: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
    };
    pid: number;
    version: string;
  };
  userInfo: {
    username: string;
    homedir: string;
    shell: string | null;
  };
}

export default function App() {
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchInfo = async () => {
    try {
      const response = await fetch('/api/system-info');
      if (!response.ok) throw new Error('Failed to fetch system info');
      const data = await response.json();
      setInfo(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
    const interval = setInterval(fetchInfo, 5000); // Refresh every 5 seconds for more "real-time" feel
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  const calculateCpuLoad = () => {
    if (!info) return '0.0';
    // Load avg is the number of processes in the queue. 
    // Dividing by cores gives a rough percentage.
    const load = (info.cpu.loadAvg[0] / info.cpu.cores) * 100;
    return Math.min(Math.max(load, 0), 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Server className="text-blue-500" />
              System Monitor
            </h1>
            <p className="text-slate-400 mt-1">Real-time infrastructure insights</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Last Updated</p>
              <p className="text-sm font-mono">{lastUpdated.toLocaleTimeString()}</p>
            </div>
            <button 
              onClick={fetchInfo}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3">
            <Info className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Quick Stats */}
          <StatCard 
            icon={<Cpu className="text-blue-400" />}
            label="CPU Load (1m)"
            value={info ? `${calculateCpuLoad()}%` : '...'}
            subValue={info ? `${info.cpu.cores} Cores @ ${info.cpu.speed}MHz` : ''}
            progress={info ? parseFloat(calculateCpuLoad()) : 0}
          />
          <StatCard 
            icon={<Database className="text-emerald-400" />}
            label="Memory Usage"
            value={info ? `${info.memory.usagePercent}%` : '...'}
            subValue={info ? `${formatBytes(info.memory.used)} / ${formatBytes(info.memory.total)}` : ''}
            progress={info ? parseFloat(info.memory.usagePercent) : 0}
          />
          <StatCard 
            icon={<HardDrive className="text-amber-400" />}
            label="Disk Usage"
            value={info?.disk ? `${((info.disk.used / info.disk.total) * 100).toFixed(1)}%` : 'N/A'}
            subValue={info?.disk ? `${formatBytes(info.disk.used)} / ${formatBytes(info.disk.total)}` : 'No disk info'}
            progress={info?.disk ? (info.disk.used / info.disk.total) * 100 : 0}
          />
          <StatCard 
            icon={<Activity className="text-purple-400" />}
            label="System Uptime"
            value={info ? formatUptime(info.uptime) : '...'}
            subValue={info ? `Host: ${info.hostname}` : ''}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Network Interfaces */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Network className="text-blue-500" />
                Network Interfaces
              </h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {info?.network.map((iface, idx) => (
                  <div key={idx} className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                    <h3 className="font-mono text-blue-400 mb-2 flex items-center justify-between">
                      {iface.name}
                      <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                        {iface.details.length} Address(es)
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {iface.details.map((detail, dIdx) => (
                        <div key={dIdx} className="text-sm bg-slate-900/40 p-2 rounded-lg border border-slate-700/30">
                          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter flex items-center justify-between">
                            <span>{detail.family}</span>
                            {detail.internal && <span className="text-amber-500/80">Internal</span>}
                          </p>
                          <p className="font-mono text-slate-300 break-all text-xs mt-1">{detail.address}</p>
                          <p className="text-slate-600 text-[9px] mt-1 font-mono">{detail.mac}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* System & Process Details */}
          <div className="space-y-6">
            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-emerald-400">
                <Activity className="w-5 h-5" />
                Process Details
              </h2>
              <div className="space-y-4">
                <DetailRow label="Process Uptime" value={info ? formatUptime(info.process.uptime) : ''} />
                <DetailRow label="Node Version" value={info?.process.version} />
                <DetailRow label="Process ID (PID)" value={info?.process.pid.toString()} />
                <div className="pt-2 border-t border-slate-800 mt-2">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Process Memory</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-800/40 p-2 rounded">
                      <p className="text-[10px] text-slate-500">RSS</p>
                      <p className="text-xs font-mono">{info ? formatBytes(info.process.memory.rss) : '...'}</p>
                    </div>
                    <div className="bg-slate-800/40 p-2 rounded">
                      <p className="text-[10px] text-slate-500">Heap Used</p>
                      <p className="text-xs font-mono">{info ? formatBytes(info.process.memory.heapUsed) : '...'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <User className="text-amber-500" />
                User Context
              </h2>
              <div className="space-y-4">
                <DetailRow label="Username" value={info?.userInfo.username} />
                <DetailRow label="Home Directory" value={info?.userInfo.homedir} />
                <DetailRow label="Default Shell" value={info?.userInfo.shell || 'N/A'} />
              </div>
            </section>

            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Globe className="text-purple-500" />
                Environment
              </h2>
              <div className="space-y-4">
                <DetailRow label="Platform" value={info?.platform} />
                <DetailRow label="Release" value={info?.release} />
                <DetailRow label="Architecture" value={info?.arch} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  subValue, 
  progress 
}: { 
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  subValue: string,
  progress?: number
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors relative overflow-hidden group"
    >
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="p-3 rounded-xl bg-slate-800/50 group-hover:bg-slate-800 transition-colors">
          {icon}
        </div>
        <span className="text-slate-400 text-sm font-medium">{label}</span>
      </div>
      <div className="space-y-1 relative z-10">
        <div className="text-2xl font-bold text-white font-mono">{value}</div>
        <div className="text-xs text-slate-500 truncate">{subValue}</div>
      </div>
      
      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full ${progress > 85 ? 'bg-red-500' : progress > 60 ? 'bg-amber-500' : 'bg-blue-500'}`}
          />
        </div>
      )}
    </motion.div>
  );
}

function DetailRow({ label, value }: { label: string, value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">{label}</span>
      <span className="text-sm text-slate-300 font-mono break-all">{value || '...'}</span>
    </div>
  );
}
