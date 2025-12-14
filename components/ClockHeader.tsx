import React, { useEffect, useState } from 'react';
import { getSingaporeTime, formatTime, formatDate } from '../utils';

export const ClockHeader: React.FC = () => {
  const [time, setTime] = useState<Date>(getSingaporeTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getSingaporeTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-6 text-slate-100">
      <div className="text-sm font-medium text-emerald-400 uppercase tracking-widest mb-1">
        Singapore Time
      </div>
      <div className="text-5xl font-bold tracking-tight font-mono">
        {formatTime(time)}
      </div>
      <div className="text-slate-400 mt-1">
        {formatDate(time)}
      </div>
    </div>
  );
};
