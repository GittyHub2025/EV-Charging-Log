import React from 'react';
import { CalculatedOption, ChargingProfile } from '../types';
import { calculateDurationHours, addHoursToDate, formatTime, formatDate } from '../utils';

interface ChargingOptionsProps {
  profiles: ChargingProfile[];
  currentBattery: number;
  baseTime: Date;
  onSelect: (option: CalculatedOption) => void;
}

export const ChargingOptions: React.FC<ChargingOptionsProps> = ({ 
  profiles, 
  currentBattery, 
  baseTime,
  onSelect
}) => {
  
  const options: CalculatedOption[] = profiles.map(profile => {
    const duration = calculateDurationHours(profile.fullChargeTimeHrs, currentBattery);
    const endTime = addHoursToDate(baseTime, duration);
    return { ...profile, durationHrs: duration, endTime };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {options.map((option, idx) => {
        // Highlight logic: If end time is between 6am and 9am next day, it's a "Golden Slot"
        const hour = option.endTime.getHours();
        const isMorning = hour >= 6 && hour <= 9;
        
        return (
          <div 
            key={idx}
            onClick={() => onSelect(option)}
            className={`
              relative overflow-hidden rounded-xl p-5 cursor-pointer transition-all duration-300 border
              hover:scale-[1.02] hover:shadow-xl
              ${isMorning ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}
            `}
          >
            {isMorning && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-slate-900 text-xs font-bold px-2 py-1 rounded-bl-lg">
                OPTIMAL
              </div>
            )}

            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  {option.currentAmps === 'Max' ? 'Max Power' : `${option.currentAmps} A`}
                </h3>
                <p className="text-sm text-slate-400 font-mono">{option.powerKW} kW</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 uppercase">Duration</div>
                <div className="text-xl font-bold text-slate-200">
                  {Math.floor(option.durationHrs)}<span className="text-sm text-slate-400">h</span> {Math.round((option.durationHrs % 1) * 60)}<span className="text-sm text-slate-400">m</span>
                </div>
              </div>
            </div>

            <div className="mt-2 pt-3 border-t border-slate-700/50">
               <div className="flex justify-between items-center">
                 <span className="text-xs text-slate-400">Finishes at</span>
                 <div className="text-right">
                    <div className="text-emerald-400 font-bold text-lg">
                      {formatTime(option.endTime)}
                    </div>
                    <div className="text-xs text-slate-500">
                       {formatDate(option.endTime)}
                    </div>
                 </div>
               </div>
            </div>
            
            <button className="w-full mt-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors">
              Log this Charge
            </button>
          </div>
        );
      })}
    </div>
  );
};
