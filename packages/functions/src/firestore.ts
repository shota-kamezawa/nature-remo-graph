import {firestore} from "firebase-admin";
import type {Device, SensorKind, SensorValue} from "./nature-api";

export const CollectionEnum = {
  device: "devices",
  sensorValue: "sensor_values",
} as const;

type DeviceDocument = {
  id: Device["id"];
  name: Device["name"];
  serial_number: Device["serial_number"];
  firmware_version: Device["firmware_version"];
};

type SensorValueDocument = {
  kind: SensorKind;
  val: SensorValue["val"];
  created_at: firestore.Timestamp;
};

const makeDeviceDocument = (
    device: Device,
): DeviceDocument => ({
  id: device.id,
  name: device.name,
  serial_number: device.serial_number,
  firmware_version: device.firmware_version,
});

const makeSensorValueDocuments = (
    device: Device,
): SensorValueDocument[] => (
  Object.entries(device.newest_events)
      .map(([kind, value]) => ({
        kind: kind as SensorKind,
        val: value.val,
        created_at: firestore.Timestamp.fromDate(new Date(value.created_at)),
      }))
);

const makeSensorValueDocumentPath = (
    document: SensorValueDocument,
): string => (
  `${document.created_at.toDate().toJSON()}__${document.kind}`
);

export const registerDevices = async ({
  firestore,
  devices,
}: {
  firestore: firestore.Firestore;
  devices: readonly Device[];
}): Promise<firestore.WriteResult[]> => {
  const batch = firestore.batch();
  const deviceCollectionRef = firestore.collection(CollectionEnum.device);

  devices.forEach((device) => {
    const deviceRef = deviceCollectionRef.doc(device.id);
    const deviceDocument = makeDeviceDocument(device);
    batch.set(deviceRef, deviceDocument, {merge: true});

    const svCollectionRef = deviceRef.collection(CollectionEnum.sensorValue);
    const svDocuments = makeSensorValueDocuments(device);
    svDocuments.forEach((svDocument) => {
      const svDocumentPath = makeSensorValueDocumentPath(svDocument);
      const svDocumentRef = svCollectionRef.doc(svDocumentPath);
      batch.set(svDocumentRef, svDocument, {merge: true});
    });
  });

  return batch.commit();
};
