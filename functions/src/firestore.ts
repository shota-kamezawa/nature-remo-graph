import {firestore} from "firebase-admin";
import type {Device, SensorKind, SensorValue} from "./nature-api";

export const CollectionEnum = {
  device: "devices",
  sensorValue: "sensor_values",
} as const;

export type DeviceDocument = {
  id: Device["id"];
  name: Device["name"];
  serial_number: Device["serial_number"];
  firmware_version: Device["firmware_version"];
};

export type SensorValueDocument = {
  device_id: Device["id"];
  kind: SensorKind;
  val: SensorValue["val"];
  created_at: firestore.Timestamp;
};

export type RegistrationOptions<T> = {
  firestore: firestore.Firestore;
  documents: T[];
};

export const makeDeviceDocument = (
    device: Device,
): DeviceDocument => ({
  id: device.id,
  name: device.name,
  serial_number: device.serial_number,
  firmware_version: device.firmware_version,
});

export const makeSensorValueDocument = (
    device: Device,
): SensorValueDocument[] => (
  Object.entries(device.newest_events)
      .map(([kind, value]) => ({
        device_id: device.id,
        kind: kind as SensorKind,
        val: value.val,
        created_at: firestore.Timestamp.fromDate(new Date(value.created_at)),
      }))
);

export const registerDeviceDocuments = async (
    {firestore, documents}: RegistrationOptions<DeviceDocument>,
): Promise<firestore.WriteResult[]> => {
  const collectionRef = firestore.collection(CollectionEnum.device);
  const batch = firestore.batch();

  documents.forEach((document) => {
    const docRef = collectionRef.doc(document.id);
    batch.set(docRef, document, {merge: true});
  });

  return batch.commit();
};

export const registerSensorValueDocuments = async (
    {firestore, documents}: RegistrationOptions<SensorValueDocument>,
): Promise<firestore.WriteResult[]> => {
  const collectionRef = firestore.collection(CollectionEnum.sensorValue);
  const batch = firestore.batch();

  documents.forEach((document) => {
    const docRef = collectionRef.doc(document.created_at.toDate().toJSON());
    batch.set(docRef, document, {merge: true});
  });

  return batch.commit();
};