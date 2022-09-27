import type { ScatterDataPoint } from 'chart.js'

import type { SensorValueItem } from './types'

export const convertSensorValueItemToChartDataItem = (
  item: SensorValueItem,
): ScatterDataPoint => ({
  x: item.timestamp,
  y: item.value,
})
