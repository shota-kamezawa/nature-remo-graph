import * as functions from "firebase-functions";
import {fetchDevices} from "./nature-api";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const getDevices = functions
    .runWith({secrets: ["NATURE_API_ACCESS_TOKEN"]})
    .https
    .onRequest(async (request, response) => {
      try {
        const devices = await fetchDevices({
          accessToken: process.env.NATURE_API_ACCESS_TOKEN as string,
        });
        response.status(200).json(devices);
      } catch (error) {
        functions.logger.info(error, {structuredData: true});
        response.status(503).send("Error!");
      }
    });
