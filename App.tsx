import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { ClockHeader } from './components/ClockHeader';
import { BatteryInput } from './components/BatteryInput';
import { ChargingOptions } from './components/ChargingOptions';
import { LogHistory } from './components/LogHistory';
import { BYD_CHARGING_PROFILES } from './constants';
import { getSingaporeTime, calculateDurationHours, addHoursToDate } from './utils';
import { CalculatedOption, ChargingLog, ViewState } from './types';
import { getChargingAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [batteryLevel, setBatteryLevel] = useState<number>(30);
  const [currentTime, setCurrentTime] = useState<Date>(getSingaporeTime());
  const [logs, setLogs] = useState<ChargingLog[]>([]);
  const [view, setView] = useState<ViewState>(ViewState.CALCULATOR);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Update time every minute to keep calculations fresh
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getSingaporeTime());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Load logs from localStorage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('byd_charging_logs');
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    }
  }, []);

  // Save logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('byd_charging_logs', JSON.stringify(logs));
  }, [logs]);

  const handleLogCharge = (option: CalculatedOption) => {
    const newLog: ChargingLog = {
      id: crypto.randomUUID(),
      timestamp: currentTime.toISOString(),
      batteryPercentage: batteryLevel,
      selectedProfileName: option.currentAmps === 'Max' ? 'Max (6.8kW)' : `${option.currentAmps}A`,
      calculatedEndTime: option.endTime.toISOString(),
    };
    setLogs(prev => [...prev, newLog]);
    alert(`Logged: Charging at ${newLog.selectedProfileName} will end at ${option.endTime.toLocaleTimeString()}`);
  };

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear your charging history?')) {
      setLogs([]);
    }
  };

  const fetchAdvice = useCallback(async () => {
    setLoadingAdvice(true);
    // Pre-calculate options to send to AI
    const options: CalculatedOption[] = BYD_CHARGING_PROFILES.map(profile => {
      const duration = calculateDurationHours(profile.fullChargeTimeHrs, batteryLevel);
      const endTime = addHoursToDate(currentTime, duration);
      return { ...profile, durationHrs: duration, endTime };
    });

    const aiAdvice = await getChargingAdvice(batteryLevel, options);
    setAdvice(aiAdvice);
    setLoadingAdvice(false);
  }, [batteryLevel, currentTime]);

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <ClockHeader />
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setView(ViewState.CALCULATOR)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              view === ViewState.CALCULATOR 
                ? 'bg-emerald-500 text-slate-900' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Calculator
          </button>
          <button
            onClick={() => setView(ViewState.LOGS)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              view === ViewState.LOGS 
                ? 'bg-emerald-500 text-slate-900' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            History ({logs.length})
          </button>
        </div>

        {view === ViewState.CALCULATOR && (
          <div className="space-y-6">
            
            {/* Input Section */}
            <BatteryInput value={batteryLevel} onChange={setBatteryLevel} />

            {/* AI Advisor */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-indigo-500/30">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-indigo-400 font-semibold text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                  Gemini Smart Insight
                </h3>
                <button 
                  onClick={fetchAdvice}
                  disabled={loadingAdvice}
                  className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
                >
                  {loadingAdvice ? 'Thinking...' : 'Get Advice'}
                </button>
              </div>
              <p className="text-sm text-slate-300 min-h-[3rem] italic">
                {advice || "Click 'Get Advice' to let AI analyze the best charging slot for you based on current time."}
              </p>
            </div>

            {/* Results Grid */}
            <div className="pt-2">
              <h2 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">
                Select Current to Log
              </h2>
              <ChargingOptions 
                profiles={BYD_CHARGING_PROFILES}
                currentBattery={batteryLevel}
                baseTime={currentTime}
                onSelect={handleLogCharge}
              />
            </div>
            
            <p className="text-center text-xs text-slate-600 mt-8">
              Based on observed charging curves for BYD EV. Actual times may vary based on temperature and grid voltage.
            </p>
          </div>
        )}

        {view === ViewState.LOGS && (
          <LogHistory logs={logs} onClear={handleClearLogs} />
        )}

      </div>
    </div>
  );
};

export default App;
