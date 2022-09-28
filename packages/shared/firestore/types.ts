import type { SensorKind } from '../nature-api'

import type { Timestamp } from 'firebase/firestore'

export type { SensorKind }

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
