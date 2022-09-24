import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {fetchDevices} from "./nature-api";
import {
  CollectionEnum,
  makeDeviceDocument,
  makeSensorValueDocument,
  registerDeviceDocuments,
  registerSensorValueDocuments,
} from "./firestore";

admin.initializeApp();

const firestore = admin.firestore();

const logWriteResult = (options: {
  settledResult: PromiseSettledResult<unknown[]>,
  name: string,
}): void => {
  const {name, settledResult} = options;

  if (settledResult.status === "fulfilled") {
    functions.logger.info(
        `${name}: ${settledResult.value.length}`,
        {structuredData: true},
    );
  } else {
    functions.logger.error(
        `${name}:`,
        settledResult.reason,
        {structuredData: true},
    );
  }
};

export const getDevices = functions
    .runWith({secrets: ["NATURE_API_ACCESS_TOKEN"]})
    .pubsub
    .schedule("every 5 minutes")
    .onRun(async () => {
      try {
        const devices = await fetchDevices({
          accessToken: process.env.NATURE_API_ACCESS_TOKEN as string,
        });

        const deviceDocuments = devices.map(makeDeviceDocument);
        const sensorValueDocuments = devices
            .map(makeSensorValueDocument)
            .flat();

        const [
          deviceResult,
          sensorValueResult,
        ] = await Promise.allSettled([
          registerDeviceDocuments({
            firestore,
            documents: deviceDocuments,
          }),
          registerSensorValueDocuments({
            firestore,
            documents: sensorValueDocuments,
          }),
        ]);

        logWriteResult({
          name: CollectionEnum.device,
          settledResult: deviceResult,
        });

        logWriteResult({
          name: CollectionEnum.sensorValue,
          settledResult: sensorValueResult,
        });
      } catch (error) {
        functions.logger.error(error, {structuredData: true});
      }
    });
