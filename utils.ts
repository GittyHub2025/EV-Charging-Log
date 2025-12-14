import { SINGAPORE_TIMEZONE } from './constants';

export const getSingaporeTime = (): Date => {
  const now = new Date();
  // Create a date object that represents the time in Singapore
  // We use the string manipulation method to ensure we get the correct offset regardless of user's local system time
  const sgString = now.toLocaleString("en-US", { timeZone: SINGAPORE_TIMEZONE });
  return new Date(sgString);
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const calculateDurationHours = (
  fullChargeTimeHrs: number,
  currentBatteryPct: number
): number => {
  const remainingPct = 100 - currentBatteryPct;
  // If battery is 100, duration is 0.
  // Formula: FullTime * (Remaining / 100)
  return fullChargeTimeHrs * (remainingPct / 100);
};

export const addHoursToDate = (date: Date, hours: number): Date => {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + Math.ceil(hours * 60));
  return newDate;
};
