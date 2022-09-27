import type { ChartData, ChartOptions } from 'chart.js'
import 'chart.js/auto'
import 'chartjs-adapter-date-fns'
// import * as dateFns from 'date-fns'

import { NatureRemoGraph } from '../components/NatureRemoGraph'
import {
  DataKindEnum,
  DatasetDefaults,
  makeHumidityScaleOptions,
  makeIlluminationScaleOptions,
  makeTemperatureScaleOptions,
} from '../utils/charts'

const Mock = () => {
  const timeline = {
    max: '2021-11-07 03:00',
    min: '2021-11-06 23:00',
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

  const datasets: ChartData['datasets'] = [
    {
      ...DatasetDefaults[DataKindEnum.temperature],
      data: [
        {
          x: new Date('2021-11-06 23:39:30').getTime(),
          y: 26,
        },
        {
          x: new Date('2021-11-07 01:00:28').getTime(),
          y: 30,
        },
        {
          x: new Date('2021-11-07 02:00:28').getTime(),
          y: 20,
        },
      ],
      yAxisID: DataKindEnum.temperature,
    },
    {
      ...DatasetDefaults[DataKindEnum.humidity],
      data: [
        {
          x: new Date('2021-11-06 23:19:30').getTime(),
          y: 70,
        },
        {
          x: new Date('2021-11-07 01:15:28').getTime(),
          y: 61,
        },
        {
          x: new Date('2021-11-07 02:05:28').getTime(),
          y: 80,
        },
      ],
      yAxisID: DataKindEnum.humidity,
    },
    {
      ...DatasetDefaults[DataKindEnum.illumination],
      data: [
        {
          x: new Date('2021-11-06 23:19:30').getTime(),
          y: 100,
        },
        {
          x: new Date('2021-11-07 01:15:28').getTime(),
          y: 200,
        },
        {
          x: new Date('2021-11-07 02:05:28').getTime(),
          y: 100,
        },
      ],
      yAxisID: DataKindEnum.illumination,
    },
  ]

  return (
    <>
      <NatureRemoGraph
        datasets={datasets}
        height={500}
        scales={scales}
        timeline={timeline}
      />
    </>
  )
}

export default Mock
