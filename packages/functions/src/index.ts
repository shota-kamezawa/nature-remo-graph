import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

import { registerDevices } from './firestore'
import { fetchDevices } from './nature-api'

admin.initializeApp()

const firestore = admin.firestore()

export const getDevices = functions
  .runWith({ secrets: ['NATURE_API_ACCESS_TOKEN'] })
  .pubsub.schedule('every 5 minutes')
  .onRun(async () => {
    try {
      const devices = await fetchDevices({
        accessToken: process.env.NATURE_API_ACCESS_TOKEN as string,
      })

      const results = await registerDevices({
        devices,
        firestore,
      })

      functions.logger.info(`getDevices: registered ${results.length} items`, {
        structuredData: true,
      })
    } catch (error) {
      functions.logger.error(error, { structuredData: true })
    }
  })
