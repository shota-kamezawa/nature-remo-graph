import { Button, CircularProgress, TextField } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
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
import { useEffect, useRef, useState } from 'react'

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
  const [activeDeviceId, setActiveDeviceId] = useState<string>('')
  const [sensorValues, setSensorValues] = useState<SensorValueDocument[]>([])
  const [endDate, setEndDate] = useState(
    dateFns.add(dateFns.startOfHour(new Date()), { minutes: 30 }),
  )
  const [startDate, setStartDate] = useState(dateFns.sub(endDate, { hours: 6 }))

  const getDevices = async () => {
    setLoading(true)

    try {
      const q = query(collection(db, CollectionEnum.devices))
      const querySnapshot = await getDocs(q)
      console.log(CollectionEnum.devices, querySnapshot.size)
      const deviceDocs = querySnapshot.docs.map((doc) =>
        doc.data(),
      ) as DeviceDocument[]
      setDevices(deviceDocs)
      setActiveDeviceId(deviceDocs[0]?.id || '')
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  const updateGraph = async () => {
    setLoading(true)

    try {
      const q = query(
        collection(
          db,
          CollectionEnum.devices,
          activeDeviceId,
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

  const devicesFirstLoading = useRef(false)
  useEffect(() => {
    if (!devicesFirstLoading.current) {
      devicesFirstLoading.current = true
      getDevices()
    }
  }, [])

  const sensorValuesFirstLoading = useRef(false)
  useEffect(() => {
    if (devices.length && !sensorValuesFirstLoading.current) {
      sensorValuesFirstLoading.current = true
      updateGraph()
    }
  }, [devices])

  const timeline = {
    max: endDate.toJSON(),
    min: startDate.toJSON(),
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {!sensorValues.length ? (
        <CircularProgress />
      ) : (
        <>
          <div style={{ alignItems: 'center', display: 'flex' }}>
            <DateTimePicker
              ampm={false}
              label="start"
              minutesStep={30}
              onChange={setStartDate as never}
              renderInput={(params) => (
                <TextField {...params} onKeyDown={(e) => e.preventDefault()} />
              )}
              value={startDate}
            />
            <DateTimePicker
              ampm={false}
              label="end"
              minutesStep={30}
              onChange={setEndDate as never}
              renderInput={(params) => (
                <TextField {...params} onKeyDown={(e) => e.preventDefault()} />
              )}
              value={endDate}
            />
            <Button
              disabled={loading}
              onClick={updateGraph}
              variant="contained"
            >
              update
            </Button>
          </div>
          <div>
            <NatureRemoGraph
              {...{
                datasets,
                scales,
                timeline,
                tooltipLabelFormatter,
              }}
              height={500}
            />
          </div>
        </>
      )}
    </LocalizationProvider>
  )
}

export default Home
