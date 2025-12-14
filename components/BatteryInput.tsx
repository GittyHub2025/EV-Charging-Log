import React from 'react';
import { BATTERY_CAPACITY_KWH } from '../constants';

interface BatteryInputProps {
  value: number;
  onChange: (val: number) => void;
}

export const BatteryInput: React.FC<BatteryInputProps> = ({ value, onChange }) => {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700">
      <div className="flex justify-between items-end mb-4">
        <div>
          <label className="text-lg font-medium text-slate-200 block">Current Battery</label>
          <span className="text-xs text-slate-500 font-mono">Capacity: {BATTERY_CAPACITY_KWH} kWh</span>
        </div>
        <div className="text-4xl font-bold text-emerald-400">{value}%</div>
      </div>
      
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-4 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all"
      />
      <div className="flex justify-between mt-2 text-xs text-slate-500 font-mono">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
};
