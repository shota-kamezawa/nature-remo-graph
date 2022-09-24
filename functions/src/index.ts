import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {fetchDevices} from "./nature-api";
import {
  makeDeviceDocument,
  makeSensorValueDocument,
  registerDeviceDocuments,
  registerSensorValueDocuments,
} from "./firestore";

admin.initializeApp();

const firestore = admin.firestore();

export const getDevices = functions
    .runWith({secrets: ["NATURE_API_ACCESS_TOKEN"]})
    .pubsub
    .schedule("every 10 minutes")
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
          deviceResults,
          sensorValueResults,
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

        functions.logger.info(deviceResults, {structuredData: true});
        functions.logger.info(sensorValueResults, {structuredData: true});
      } catch (error) {
        functions.logger.error(error, {structuredData: true});
      }
    });
