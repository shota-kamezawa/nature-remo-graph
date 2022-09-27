import type { ScatterDataPoint } from 'chart.js'

import type { SensorItem } from './types'

export const convertSensorItemToChartData = (
  item: SensorItem,
): ScatterDataPoint => ({
  x: item.timestamp,
  y: item.value,
})
