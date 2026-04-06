import { useState, useEffect, useCallback } from "react";
import { 
  Server, 
  Globe, 
  Cpu, 
  Activity, 
  Shield, 
  MapPin, 
  RefreshCw, 
  Database,
  Terminal,
  Clock,
  HardDrive
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

interface Metadata {
  aws: {
    instanceId: string;
    availabilityZone: string;
    publicIp: string;
    privateIp: string;
    publicDns: string;
    region: string;
  } | null;
  system: {
    hostname: string;
    platform: string;
    uptime: number;
    load: number[];
    memory: {
      total: number;
      free: number;
    };
    network: Record<string, any[]>;
  };
  timestamp: string;
}

export default function App() {
  const [data, setData] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadHistory, setLoadHistory] = useState<{ time: string; load: number }[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMetadata = useCallback(async (isAuto = false) => {
    if (!isAuto) setIsRefreshing(true);
    try {
      const response = await fetch("/api/metadata");
      if (!response.ok) throw new Error("Failed to fetch metadata");
      const result: Metadata = await response.json();
      setData(result);
      
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLoadHistory(prev => {
        const newHistory = [...prev, { time: now, load: result.system.load[0] }];
        return newHistory.slice(-20); // Keep last 20 points
      });
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMetadata();
    const interval = setInterval(() => fetchMetadata(true), 5000);
    return () => clearInterval(interval);
  }, [fetchMetadata]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <RefreshCw className="w-12 h-12 text-orange-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <Server className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">EC2 Node Dashboard</h1>
            </div>
            <p className="text-slate-400 text-sm">
              Real-time instance verification & health monitoring
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Last Updated</p>
              <p className="text-sm font-mono text-orange-400">{new Date(data?.timestamp || "").toLocaleTimeString()}</p>
            </div>
            <button 
              onClick={() => fetchMetadata()}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-all border border-slate-700 active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-3">
            <Activity className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-start gap-4"
          >
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Globe className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Public Endpoint</p>
              <p className="text-lg font-mono text-white truncate max-w-[200px]">
                {data?.aws?.publicIp || data?.system.network['eth0']?.[0]?.address || "Localhost"}
              </p>
              <p className="text-xs text-slate-400 mt-1 truncate max-w-[200px]">{data?.aws?.publicDns || "No Public DNS"}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-start gap-4"
          >
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <MapPin className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Region & Zone</p>
              <p className="text-lg font-mono text-white">
                {data?.aws?.availabilityZone || "Development Env"}
              </p>
              <p className="text-xs text-slate-400 mt-1">{data?.aws?.region || "Local"}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-start gap-4"
          >
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Instance ID</p>
              <p className="text-lg font-mono text-white truncate max-w-[200px]">
                {data?.aws?.instanceId || "i-dev-local-001"}
              </p>
              <p className="text-xs text-slate-400 mt-1">Private: {data?.aws?.privateIp || "127.0.0.1"}</p>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: System Load Chart */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-semibold">System Load (1m Avg)</h2>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Load</span>
                </div>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={loadHistory}>
                    <defs>
                      <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      stroke="#64748b" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      domain={[0, 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                      itemStyle={{ color: '#f97316' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="load" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorLoad)" 
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* System Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="w-5 h-5 text-slate-400" />
                  <h3 className="font-semibold">OS Environment</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Hostname</span>
                    <span className="text-slate-200 font-mono">{data?.system.hostname}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Platform</span>
                    <span className="text-slate-200 capitalize">{data?.system.platform}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Uptime</span>
                    <span className="text-slate-200">{formatUptime(data?.system.uptime || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <HardDrive className="w-5 h-5 text-slate-400" />
                  <h3 className="font-semibold">Memory Usage</h3>
                </div>
                <div className="space-y-4">
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-blue-500 h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((data?.system.memory.total! - data?.system.memory.free!) / data?.system.memory.total!) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Used / Total</span>
                    <span className="text-slate-200">
                      {formatBytes(data?.system.memory.total! - data?.system.memory.free!)} / {formatBytes(data?.system.memory.total!)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Network & Load Balancer Info */}
          <div className="space-y-8">
            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold">Load Balancer Test</h2>
              </div>
              <p className="text-sm text-slate-400 mb-6">
                If you are using an AWS Application Load Balancer, refresh this page to see if the request hits a different instance.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Current Node</p>
                  <p className="text-lg font-mono text-orange-400 truncate">
                    {data?.system.hostname}
                  </p>
                </div>
                
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Node IP</p>
                  <p className="text-lg font-mono text-blue-400">
                    {data?.aws?.privateIp || "127.0.0.1"}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mt-4">
                  <Clock className="w-3 h-3" />
                  <span>Auto-refreshing every 5s</span>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold">Network Interfaces</h3>
              </div>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {(Object.entries(data?.system.network || {}) as [string, any[]][]).map(([name, interfaces]) => (
                  <div key={name} className="space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{name}</p>
                    {interfaces.map((iface, idx) => (
                      <div key={idx} className="text-xs bg-slate-800/30 p-2 rounded border border-slate-700/50">
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-400">Address</span>
                          <span className="text-slate-200 font-mono">{iface.address}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Family</span>
                          <span className="text-slate-200">{iface.family}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-slate-800">
          <p className="text-slate-500 text-xs">
            AWS EC2 Deployment Verification Dashboard &bull; {new Date().getFullYear()}
          </p>
        </footer>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
}
