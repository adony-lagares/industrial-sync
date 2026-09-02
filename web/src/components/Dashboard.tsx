import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import {
    Thermometer, Gauge, Activity, Cpu,
    LayoutDashboard, History, Settings, Languages
} from 'lucide-react';
import { translations, type Language } from '../i18n/translations';
import { TEMP_LIMIT, PRESSURE_LIMIT, API_BASE_URL } from '../lib/constants';
import HistoricalLogsTable from './HistoricalLogs';

type TelemetryRecord = {
    equipmentCode?: string;
    EquipmentCode?: string;
    temperature?: number;
    Temperature?: number;
    pressure?: number;
    Pressure?: number;
    timestamp?: string;
    Timestamp?: string;
};

type View = 'main' | 'history';

const POLL_INTERVAL_MS = 5000;

const Dashboard = () => {
    const [lang, setLang] = useState<Language>('en');
    const [view, setView] = useState<View>('main');
    const [data, setData] = useState<TelemetryRecord[]>([]);

    const t = translations[lang];

    useEffect(() => {
        let cancelled = false;

        const fetchTelemetry = async () => {
            try {
                const response = await axios.get<TelemetryRecord[]>(`${API_BASE_URL}/api/Telemetry`);
                if (!cancelled) setData(response.data ?? []);
            } catch {
                if (!cancelled) setData([]);
            }
        };

        fetchTelemetry();
        const interval = setInterval(fetchTelemetry, POLL_INTERVAL_MS);
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    const chartData = data
        .map(log => ({
            timestamp: log.timestamp || log.Timestamp || '',
            temperature: Number(log.temperature ?? log.Temperature ?? 0),
            pressure: Number(log.pressure ?? log.Pressure ?? 0),
        }))
        .slice()
        .reverse();

    const activeNodes = new Set(data.map(log => log.equipmentCode || log.EquipmentCode)).size;
    const avgTemp = chartData.length
        ? chartData.reduce((sum, d) => sum + d.temperature, 0) / chartData.length
        : 0;
    const peakPressure = chartData.length
        ? Math.max(...chartData.map(d => d.pressure))
        : 0;

    if (view === 'history') {
        return (
            <HistoricalLogsTable
                data={data}
                onBack={() => setView('main')}
                t={t}
            />
        );
    }

    return (
        <div className="flex min-h-screen bg-[#050505] text-slate-200">
            <aside className="w-64 border-r border-slate-900 p-6 flex flex-col gap-8">
                <div>
                    <h1 className="text-xl font-black text-white uppercase italic tracking-tight">
                        {t.title} <span className="text-blue-500">{t.version}</span>
                    </h1>
                    <p className="text-slate-500 text-xs font-medium mt-1">{t.region}</p>
                </div>

                <nav className="flex flex-col gap-2">
                    <button
                        onClick={() => setView('main')}
                        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm"
                    >
                        <LayoutDashboard size={18} /> {t.mainDash}
                    </button>
                    <button
                        onClick={() => setView('history')}
                        className="flex items-center gap-3 px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-900 font-bold text-sm transition-all"
                    >
                        <History size={18} /> {t.histLogs}
                    </button>
                    <button
                        className="flex items-center gap-3 px-4 py-2 rounded-xl text-slate-600 font-bold text-sm cursor-not-allowed"
                        disabled
                    >
                        <Settings size={18} /> {t.settings}
                    </button>
                </nav>

                <button
                    onClick={() => setLang(lang === 'en' ? 'pt' : 'en')}
                    className="mt-auto flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 text-sm font-bold transition-all"
                >
                    <Languages size={16} /> {lang === 'en' ? '🇳🇿 EN' : '🇧🇷 PT'}
                </button>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 flex items-center gap-4">
                        <Cpu className="text-blue-500" size={32} />
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-black tracking-widest">{t.activeNodes}</p>
                            <p className="text-2xl font-black text-white">{activeNodes}</p>
                        </div>
                    </div>
                    <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 flex items-center gap-4">
                        <Thermometer className={avgTemp > TEMP_LIMIT ? 'text-red-500' : 'text-emerald-500'} size={32} />
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-black tracking-widest">{t.avgTemp}</p>
                            <p className="text-2xl font-black text-white">{avgTemp.toFixed(1)} °C</p>
                        </div>
                    </div>
                    <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 flex items-center gap-4">
                        <Gauge className={peakPressure > PRESSURE_LIMIT ? 'text-red-500' : 'text-blue-500'} size={32} />
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-black tracking-widest">{t.peakPress}</p>
                            <p className="text-2xl font-black text-white">{peakPressure.toFixed(1)} bar</p>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6">
                        <h2 className="text-slate-300 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Activity size={16} className="text-blue-500" /> {t.tempAnalysis}
                        </h2>
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="timestamp" hide />
                                <YAxis stroke="#475569" fontSize={12} />
                                <Tooltip contentStyle={{ background: '#020617', border: '1px solid #1e293b' }} />
                                <Area type="monotone" dataKey="temperature" stroke="#3b82f6" fill="#1d4ed8" fillOpacity={0.3} name={t.tempLabel} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6">
                        <h2 className="text-slate-300 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Gauge size={16} className="text-blue-500" /> {t.pressMetrics}
                        </h2>
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="timestamp" hide />
                                <YAxis stroke="#475569" fontSize={12} />
                                <Tooltip contentStyle={{ background: '#020617', border: '1px solid #1e293b' }} />
                                <Line type="monotone" dataKey="pressure" stroke="#10b981" strokeWidth={2} dot={false} name={t.pressLabel} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {chartData.length === 0 && (
                    <p className="text-center text-slate-600 font-bold uppercase tracking-widest text-xs mt-10">
                        {t.noData}
                    </p>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
