import axios from "axios";

export type SensorValue = {
  val: number;
  created_at: string;
};

export type SensorKind =
  | "te"
  | "hu"
  | "il"
  | "mo";

export type Device = {
  id: string;
  name: string;
  temperature_offset: number;
  humidity_offset: number;
  created_at: string;
  updated_at: string;
  firmware_version: string;
  mac_address: string;
  serial_number: string;
  newest_events: Record<SensorKind, SensorValue>;
};

export type APIOptions = {
  accessToken: string;
};

export const fetchDevices = async (
    options: APIOptions
): Promise<Device[]> => {
  const response = await axios.get<Device[]>("https://api.nature.global/1/devices", {
    headers: {"authorization": `Bearer ${options.accessToken}`},
  });
  return response.data;
};
