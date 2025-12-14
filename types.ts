export interface ChargingProfile {
  name: string;
  currentAmps: number | 'Max'; // Display label
  powerKW: number;
  fullChargeTimeHrs: number; // Time from 0% to 100%
}

export interface CalculatedOption extends ChargingProfile {
  durationHrs: number;
  endTime: Date;
}

export interface ChargingLog {
  id: string;
  timestamp: string; // ISO string
  batteryPercentage: number;
  selectedProfileName: string;
  calculatedEndTime: string;
}

export enum ViewState {
  CALCULATOR = 'CALCULATOR',
  LOGS = 'LOGS',
}
