import React from 'react';
import { ChargingLog } from '../types';

interface LogHistoryProps {
  logs: ChargingLog[];
  onClear: () => void;
}

export const LogHistory: React.FC<LogHistoryProps> = ({ logs, onClear }) => {
  if (logs.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500 italic">
        No logs recorded yet.
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
      <div className="p-4 bg-slate-900/50 flex justify-between items-center border-b border-slate-700">
        <h3 className="font-semibold text-slate-200">Charging Logs</h3>
        <button 
          onClick={onClear}
          className="text-xs text-red-400 hover:text-red-300"
        >
          Clear History
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Initial %</th>
              <th className="px-4 py-3">Setting</th>
              <th className="px-4 py-3">Est. End Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {logs.slice().reverse().map((log) => (
              <tr key={log.id} className="bg-slate-800 hover:bg-slate-750">
                <td className="px-4 py-3 font-mono text-slate-400">
                  {new Date(log.timestamp).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 font-medium text-emerald-400">
                  {log.batteryPercentage}%
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {log.selectedProfileName}
                </td>
                <td className="px-4 py-3 text-slate-300 font-mono">
                  {new Date(log.calculatedEndTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
