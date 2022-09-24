import * as functions from "firebase-functions";
import axios from "axios";

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
        const res = await axios.get("https://api.nature.global/1/devices", {
          method: "GET",
          headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${process.env.NATURE_API_ACCESS_TOKEN}`,
          },
        });
        response.status(200).json(res.data);
      } catch (error) {
        functions.logger.info(
            error,
            {structuredData: true},
        );
        response.status(503).send("Error!");
      }
    });
