import {
  CollectionEnum,
  DeviceDocument,
  SensorValueDocument,
} from '@nature-remo-graph/shared/firestore'
import { firestore } from 'firebase-admin'
import type { Timestamp } from 'firebase/firestore'

import type { Device, SensorKind } from './nature-api'

const makeDeviceDocument = (device: Device): DeviceDocument => ({
  firmware_version: device.firmware_version,
  id: device.id,
  name: device.name,
  serial_number: device.serial_number,
})

const makeSensorValueDocuments = (device: Device): SensorValueDocument[] =>
  Object.entries(device.newest_events).map(([kind, value]) => ({
    created_at: firestore.Timestamp.fromDate(
      new Date(value.created_at),
    ) as Timestamp,
    kind: kind as SensorKind,
    val: value.val,
  }))

const makeSensorValueDocumentPath = (document: SensorValueDocument): string =>
  `${document.created_at.toDate().toJSON()}__${document.kind}`

export const registerDevices = async ({
  devices,
  firestore,
}: {
  devices: readonly Device[]
  firestore: firestore.Firestore
}): Promise<firestore.WriteResult[]> => {
  const batch = firestore.batch()
  const deviceCollectionRef = firestore.collection(CollectionEnum.devices)

  devices.forEach((device) => {
    const deviceRef = deviceCollectionRef.doc(device.id)
    const deviceDocument = makeDeviceDocument(device)
    batch.set(deviceRef, deviceDocument, { merge: true })

    const svCollectionRef = deviceRef.collection(CollectionEnum.sensorValues)
    const svDocuments = makeSensorValueDocuments(device)
    svDocuments.forEach((svDocument) => {
      const svDocumentPath = makeSensorValueDocumentPath(svDocument)
      const svDocumentRef = svCollectionRef.doc(svDocumentPath)
      batch.set(svDocumentRef, svDocument, { merge: true })
    })
  })

  return batch.commit()
}
