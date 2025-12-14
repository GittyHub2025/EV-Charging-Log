import { ChargingProfile } from './types';

export const BATTERY_CAPACITY_KWH = 56.64;

// Profiles recalculated based on 56.64 kWh capacity
// Formula: 56.64 kWh / Power (kW) = Hours
export const BYD_CHARGING_PROFILES: ChargingProfile[] = [
  {
    name: 'Slow Trickle',
    currentAmps: 6.00,
    powerKW: 1.10,
    fullChargeTimeHrs: 51.49, // 56.64 / 1.10
  },
  {
    name: 'Low Current',
    currentAmps: 8.00,
    powerKW: 1.65,
    fullChargeTimeHrs: 34.33, // 56.64 / 1.65
  },
  {
    name: 'Medium Current',
    currentAmps: 10.00,
    powerKW: 1.90,
    fullChargeTimeHrs: 29.81, // 56.64 / 1.90
  },
  {
    name: 'High Current',
    currentAmps: 16.00,
    powerKW: 3.30,
    fullChargeTimeHrs: 17.16, // 56.64 / 3.30
  },
  {
    name: 'Maximum',
    currentAmps: 'Max',
    powerKW: 6.80,
    fullChargeTimeHrs: 8.33, // 56.64 / 6.80
  },
];

export const SINGAPORE_TIMEZONE = 'Asia/Singapore';
