import type { Timestamp } from 'firebase/firestore'

export type SensorKind = 'te' | 'hu' | 'il' | 'mo'

export const CollectionEnum = {
  device: 'devices',
  sensorValue: 'sensor_values',
} as const

export type DeviceDocument = {
  id: string
  name: string
  serial_number: string
  firmware_version: string
}

export type SensorValueDocument = {
  created_at: Timestamp
  kind: SensorKind
  val: number
}
