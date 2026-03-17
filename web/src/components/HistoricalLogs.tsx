import { ArrowLeft, Download, AlertTriangle, Database } from 'lucide-react';

/**
 * HistoricalLogsTable Component
 * Displays a detailed telemetry history with threshold-based conditional styling.
 * * @param {Object[]} data - Array of telemetry records.
 * @param {Function} onBack - Navigation callback to return to dashboard.
 * @param {Object} t - Translation dictionary.
 */
const HistoricalLogsTable = ({ data, onBack, t }: { data: any[], onBack: () => void, t: any }) => {

    /**
     * threshold constants for telemetry safety limits
     */
    const LIMITS = {
        TEMPERATURE: 80,
        PRESSURE: 45
    };

    /**
     * Logic to handle CSV generation and trigger browser download
     */
    const handleExportCSV = () => {
        if (!data?.length) return;

        const headers = `${t.timestamp},${t.equipment},Temperature (C),Pressure (bar),${t.status}\n`;

        const csvRows = data.map(log => {
            const temp = Number(log.temperature || log.Temperature || 0);
            const press = Number(log.pressure || log.Pressure || 0);
            const statusLabel = (temp > LIMITS.TEMPERATURE || press > LIMITS.PRESSURE) ? t.critical : t.stable;
            const timestamp = new Date(log.timestamp || log.Timestamp || "").toLocaleString();
            const equipment = log.equipmentCode || log.EquipmentCode || "N/A";

            return `"${timestamp}","${equipment}",${temp.toFixed(2)},${press.toFixed(2)},${statusLabel}`;
        }).join("\n");

        const blob = new Blob(["\uFEFF" + headers + csvRows], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `industrial_audit_${new Date().getTime()}.csv`;
        document.body.appendChild(link);
        link.click();

        // Cleanup resources
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-[#050505] animate-in fade-in duration-500">
            <header className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-900 rounded-full text-slate-400 transition-all border border-transparent hover:border-slate-800"
                        aria-label={t.mainDash}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">
                            {t.auditTitle} <span className="text-blue-500">{t.auditLogs}</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">{t.auditSub}</p>
                    </div>
                </div>

                <button
                    onClick={handleExportCSV}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                >
                    <Download size={18} /> {t.export}
                </button>
            </header>

            <div className="bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-900/50 text-slate-500 text-[10px] uppercase tracking-widest font-black border-b border-slate-900">
                        <tr>
                            <th className="p-5">{t.timestamp}</th>
                            <th className="p-5">{t.equipment}</th>
                            <th className="p-5 text-center">Temperature</th>
                            <th className="p-5 text-center">Pressure</th>
                            <th className="p-5 text-right">{t.status}</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-mono text-slate-300">
                        {data.slice().reverse().map((log, i) => {
                            const temp = Number(log.temperature || log.Temperature || 0);
                            const press = Number(log.pressure || log.Pressure || 0);

                            const isTempCritical = temp > LIMITS.TEMPERATURE;
                            const isPressCritical = press > LIMITS.PRESSURE;
                            const isAnomaly = isTempCritical || isPressCritical;

                            return (
                                <tr key={i} className={`transition-colors border-b border-slate-900/50 ${isAnomaly ? 'bg-red-500/10 hover:bg-red-500/20' : 'hover:bg-slate-900/30'}`}>
                                    <td className="p-5 text-slate-500">
                                        {new Date(log.timestamp || log.Timestamp).toLocaleString()}
                                    </td>
                                    <td className="p-5 font-bold text-white flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${isAnomaly ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-blue-500'}`}></div>
                                        {log.equipmentCode || log.EquipmentCode}
                                    </td>
                                    <td className={`p-5 text-center font-bold ${isTempCritical ? 'text-red-500' : 'text-emerald-500'}`}>
                                        <div className="flex items-center justify-center gap-1">
                                            {temp.toFixed(2)} °C
                                            {isTempCritical && <AlertTriangle size={12} className="animate-bounce" />}
                                        </div>
                                    </td>
                                    <td className={`p-5 text-center font-bold ${isPressCritical ? 'text-red-500' : 'text-blue-500'}`}>
                                        <div className="flex items-center justify-center gap-1">
                                            {press.toFixed(2)} bar
                                            {isPressCritical && <AlertTriangle size={12} className="animate-bounce" />}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <span className={`px-3 py-1 rounded text-[10px] font-black border ${isAnomaly ? 'bg-red-500/20 text-red-500 border-red-500/40 inline-flex items-center gap-1' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                            {isAnomaly && <AlertTriangle size={10} />}
                                            {isAnomaly ? t.critical : t.stable}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {!data.length && (
                    <div className="p-20 text-center text-slate-600 font-bold uppercase tracking-widest text-xs flex flex-col items-center gap-3">
                        <Database size={32} className="opacity-20" />
                        {t.noData}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoricalLogsTable;