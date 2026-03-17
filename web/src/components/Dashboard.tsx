import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Line
} from 'recharts';
import {
    Thermometer, Gauge, Activity, Database, Cpu,
    LayoutDashboard, History, Settings, ArrowLeft,
    Download, AlertTriangle
} from 'lucide-react';

/**
 * Interface and Translations for Internationalization (i18n)
 */
const translations = {
    pt: {
        title: "Industrial Sync",
        version: "v2.0",
        region: "Hub Região Oceania • Implantação: au-east",
        mainDash: "Painel Principal",
        histLogs: "Logs Históricos",
        settings: "Configurações",
        activeNodes: "Nós Ativos",
        avgTemp: "Média Temp",
        peakPress: "Pico Pressão",
        liveSensor: "Sensor ao Vivo",
        tempAnalysis: "Análise de Temperatura",
        hydLine: "Linha Hidráulica",
        pressMetrics: "Métricas de Pressão",
        realTimeStream: "Fluxo de Telemetria Real-Time",
        eventStream: "Fluxo de Eventos",
        auditTitle: "Audit",
        auditLogs: "Logs",
        auditSub: "Histórico completo de telemetria armazenado no Azure SQL",
        export: "Exportar CSV",
        timestamp: "Data/Hora",
        equipment: "Equipamento",
        status: "Status",
        critical: "CRÍTICO",
        stable: "ESTÁVEL",
        noData: "Aguardando sincronização com a nuvem...",
        tempLabel: "Temperatura",
        pressLabel: "Pressão"
    },
    en: {
        title: "Industrial Sync",
        version: "v2.0",
        region: "Oceania Region Hub • Deployment: au-east",
        mainDash: "Main Dashboard",
        histLogs: "Historical Logs",
        settings: "Settings",
        activeNodes: "Active Nodes",
        avgTemp: "Avg Temp",
        peakPress: "Peak Press",
        liveSensor: "Live Sensor",
        tempAnalysis: "Temperature Analysis",
        hydLine: "Hydraulic Line",
        pressMetrics: "Pressure Metrics",
        realTimeStream: "Real-Time Telemetry Stream",
        eventStream: "Event Stream",
        auditTitle: "Audit",
        auditLogs: "Logs",
        auditSub: "Full telemetry history stored on Azure SQL",
        export: "Export CSV",
        timestamp: "Timestamp",
        equipment: "Equipment",
        status: "Status",
        critical: "CRITICAL",
        stable: "STABLE",
        noData: "Waiting for cloud synchronization...",
        tempLabel: "Temperature",
        pressLabel: "Pressure"
    }
};

/**
 * HistoricalLogsTable Component
 * Renders a data table with visual alerts for anomalous telemetry values.
 */
const HistoricalLogsTable = ({ data, onBack, t }: { data: any[], onBack: () => void, t: any }) => {

    /**
     * Generates and downloads a CSV file from the telemetry data.
     */
    const handleExportCSV = () => {
        if (!data || data.length === 0) {
            alert("No data available for export.");
            return;
        }

        try {
            const headers = `${t.timestamp},${t.equipment},${t.tempLabel},${t.pressLabel},${t.status}\n`;
            const csvRows = data.map(log => {
                const temp = Number(log.temperature || log.Temperature || 0);
                const press = Number(log.pressure || log.Pressure || 0);
                const status = (temp > 80 || press > 45) ? t.critical : t.stable;
                const formattedDate = new Date(log.timestamp || log.Timestamp || "").toLocaleString();
                const equipment = log.equipmentCode || log.EquipmentCode || "N/A";

                return `"${formattedDate}","${equipment}",${temp.toFixed(2)},${press.toFixed(2)},${status}`;
            }).join("\n");

            const blob = new Blob(["\uFEFF" + headers + csvRows], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `industrial_audit_${new Date().getTime()}.csv`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export error:", error);
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-[#050505] animate-in fade-in duration-500">
            <header className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-900 rounded-full text-slate-400 transition-all border border-transparent hover:border-slate-800"
                        aria-label="Back to dashboard"
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
                            <th className="p-5 text-center">{t.tempLabel}</th>
                            <th className="p-5 text-center">{t.pressLabel}</th>
                            <th className="p-5 text-right">{t.status}</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-mono text-slate-300">
                        {data.slice().reverse().map((log, i) => {
                            const temp = Number(log.temperature || log.Temperature || 0);
                            const press = Number(log.pressure || log.Pressure || 0);
                            const isAnomaly = temp > 80 || press > 45;

                            return (
                                <tr key={i} className={`transition-colors border-b border-slate-900/50 ${isAnomaly ? 'bg-red-500/10 hover:bg-red-500/20' : 'hover:bg-slate-900/30'}`}>
                                    <td className="p-5 text-slate-500">{new Date(log.timestamp || log.Timestamp).toLocaleString()}</td>
                                    <td className="p-5 font-bold text-white flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${isAnomaly ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-blue-500'}`}></div>
                                        {log.equipmentCode || log.EquipmentCode}
                                    </td>
                                    <td className={`p-5 text-center font-bold ${temp > 80 ? 'text-red-500' : 'text-emerald-500'}`}>
                                        <div className="flex items-center justify-center gap-1">
                                            {temp.toFixed(2)} °C
                                            {temp > 80 && <AlertTriangle size={12} className="animate-bounce" />}
                                        </div>
                                    </td>
                                    <td className={`p-5 text-center font-bold ${press > 45 ? 'text-red-500' : 'text-blue-500'}`}>
                                        <div className="flex items-center justify-center gap-1">
                                            {press.toFixed(2)} bar
                                            {press > 45 && <AlertTriangle size={12} className="animate-bounce" />}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <span className={`px-3 py-1 rounded text-[10px] font-black border ${isAnomaly ? 'bg-red-500/20 text-red-500 border-red-500/40' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                            {isAnomaly ? t.critical : t.stable}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {data.length === 0 && (
                    <div className="p-20 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">
                        {t.noData}
                    </div>
                )}
            </div>
        </div>
    );
};