import {
  CollectionEnum,
  DeviceDocument,
  SensorKindEnum,
  SensorValueDocument,
} from '@nature-remo-graph/shared/firestore'
import type { ChartData, ChartOptions } from 'chart.js'
import * as dateFns from 'date-fns'
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { useState } from 'react'

import { NatureRemoGraph } from '../components/NatureRemoGraph'
import {
  convertSensorValueItemToChartDataItem,
  DataKindEnum,
  DatasetDefaults,
  DataUnits,
  makeHumidityScaleOptions,
  makeIlluminationScaleOptions,
  makeTemperatureScaleOptions,
  makeTooltipLabelFormatter,
} from '../utils/charts'

const Home = () => {
  const db = getFirestore()

  const [loading, setLoading] = useState(false)
  const [devices, setDevices] = useState<DeviceDocument[]>([])
  const [sensorValues, setSensorValues] = useState<SensorValueDocument[]>([])
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(),
    new Date(),
  ])

  const onClickGetDevices = async () => {
    setLoading(true)

    try {
      const q = query(collection(db, CollectionEnum.devices))
      const querySnapshot = await getDocs(q)
      console.log(CollectionEnum.devices, querySnapshot.size)
      setDevices(querySnapshot.docs.map((doc) => doc.data()) as never)
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  const onClickGetSensorValues = async () => {
    setLoading(true)

    const now = new Date()
    const startOfHour = dateFns.startOfHour(now)
    const endDate = dateFns.add(startOfHour, { minutes: 30 })
    const startDate = dateFns.sub(endDate, { hours: 6 })
    setDateRange([startDate, endDate])

    try {
      const q = query(
        collection(
          db,
          CollectionEnum.devices,
          devices[0].id,
          CollectionEnum.sensorValues,
        ),
        where('created_at', '>=', startDate),
        where('created_at', '<=', endDate),
        orderBy('created_at', 'desc'),
      )
      const querySnapshot = await getDocs(q)
      console.log(CollectionEnum.sensorValues, querySnapshot.size)
      setSensorValues(querySnapshot.docs.map((doc) => doc.data()) as never)
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  const timeline = {
    max: dateRange[1].toJSON(),
    min: dateRange[0].toJSON(),
  }

  const scales: ChartOptions['scales'] = {
    [DataKindEnum.humidity]: makeHumidityScaleOptions({
      grid: false,
      position: 'right',
    }),
    [DataKindEnum.illumination]: makeIlluminationScaleOptions({
      grid: false,
      position: 'right',
    }),
    [DataKindEnum.temperature]: makeTemperatureScaleOptions({
      position: 'left',
    }),
  }

  const tooltipLabelFormatter = makeTooltipLabelFormatter(DataUnits)

  const convertDocumentToItem = (document: SensorValueDocument) =>
    convertSensorValueItemToChartDataItem({
      timestamp: document.created_at.toDate().getTime(),
      value: document.val,
    })

  const humidities = sensorValues
    .filter((doc) => doc.kind === SensorKindEnum.humidity)
    .map(convertDocumentToItem)
  const illuminations = sensorValues
    .filter((doc) => doc.kind === SensorKindEnum.illumination)
    .map(convertDocumentToItem)
  const temperatures = sensorValues
    .filter((doc) => doc.kind === SensorKindEnum.temperature)
    .map(convertDocumentToItem)

  const datasets: ChartData['datasets'] = [
    {
      ...DatasetDefaults[DataKindEnum.humidity],
      data: humidities,
      order: 1,
      yAxisID: DataKindEnum.humidity,
    },
    {
      ...DatasetDefaults[DataKindEnum.illumination],
      data: illuminations,
      order: 2,
      yAxisID: DataKindEnum.illumination,
    },
    {
      ...DatasetDefaults[DataKindEnum.temperature],
      data: temperatures,
      order: 0,
      yAxisID: DataKindEnum.temperature,
    },
  ]

  return (
    <>
      {!devices.length ? (
        <button disabled={loading} onClick={onClickGetDevices}>
          get devices
        </button>
      ) : !sensorValues.length ? (
        <button disabled={loading} onClick={onClickGetSensorValues}>
          get sensor_values
        </button>
      ) : (
        <NatureRemoGraph
          {...{
            datasets,
            scales,
            timeline,
            tooltipLabelFormatter,
          }}
          height={500}
        />
      )}
    </>
  )
}

export default Home
