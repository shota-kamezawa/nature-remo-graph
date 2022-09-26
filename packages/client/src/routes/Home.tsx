import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { useState } from 'react'

const Home = () => {
  const db = getFirestore()

  const [loading, setLoading] = useState(false)
  const [devices, setDevices] = useState<Record<string, string>[]>([])

  const onClickGetDevices = async () => {
    setLoading(true)

    try {
      const q = query(collection(db, 'devices'))
      const querySnapshot = await getDocs(q)
      setDevices(querySnapshot.docs.map((doc) => doc.data()) as never)
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  const onClickGetSensorValues = async () => {
    setLoading(true)

    try {
      const endDate = new Date()
      const startDate = new Date(endDate)
      startDate.setHours(startDate.getHours() - 2)

      const q = query(
        collection(db, 'devices', devices[0].id, 'sensor_values'),
        where('created_at', '>=', startDate),
        where('created_at', '<=', endDate),
        where('kind', '==', 'te'),
        orderBy('created_at', 'desc'),
        limit(10),
      )
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data())
      })
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  return (
    <>
      {!devices.length ? (
        <button onClick={onClickGetDevices} disabled={loading}>
          get devices
        </button>
      ) : (
        <button onClick={onClickGetSensorValues} disabled={loading}>
          get sensor_values
        </button>
      )}
    </>
  )
}

export default Home
