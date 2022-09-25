import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

import config from './config'

export const firebaseApp = initializeApp(config)
export const auth = getAuth(firebaseApp)
