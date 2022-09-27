import type { ScaleOptionsByType, TooltipCallbacks } from 'chart.js'
import type { DeepPartial } from 'chart.js/types/utils'

import { DataLabels, DataUnits } from './constants'

export const makeTimelineScaleOptions = (options?: {
  endTime?: ScaleOptionsByType<'time'>['max']
  startTime?: ScaleOptionsByType<'time'>['min']
}): DeepPartial<ScaleOptionsByType<'time'>> => ({
  bounds: 'ticks',
  max: options?.endTime,
  min: options?.startTime,
  time: {
    displayFormats: {
      minute: 'HH:mm',
    },
    round: 'minute',
    stepSize: 30,
    tooltipFormat: 'yyyy-MM-dd HH:mm',
    unit: 'minute',
  },
  type: 'time',
})

export const makeTemperatureScaleOptions = (options?: {
  grid?: Required<ScaleOptionsByType<'linear'>['grid']>['drawOnChartArea']
  position?: ScaleOptionsByType<'linear'>['position']
}): DeepPartial<ScaleOptionsByType<'linear'>> => ({
  grid: {
    drawOnChartArea: options?.grid,
  },
  position: options?.position,
  suggestedMax: 35,
  suggestedMin: 10,
  title: {
    display: true,
    text: `${DataLabels.temperature} ${DataUnits.temperature}`,
  },
  type: 'linear',
})

export const makeHumidityScaleOptions = (options?: {
  grid?: Required<ScaleOptionsByType<'linear'>['grid']>['drawOnChartArea']
  position?: ScaleOptionsByType<'linear'>['position']
}): DeepPartial<ScaleOptionsByType<'linear'>> => ({
  grid: {
    drawOnChartArea: options?.grid,
  },
  position: options?.position,
  suggestedMax: 80,
  suggestedMin: 30,
  title: {
    display: true,
    text: `${DataLabels.humidity} ${DataUnits.humidity}`,
  },
  type: 'linear',
})

export const makeIlluminationScaleOptions = (options?: {
  grid?: Required<ScaleOptionsByType<'linear'>['grid']>['drawOnChartArea']
  position?: ScaleOptionsByType<'linear'>['position']
}): DeepPartial<ScaleOptionsByType<'linear'>> => ({
  grid: {
    drawOnChartArea: options?.grid,
  },
  position: 'right',
  suggestedMax: 300,
  suggestedMin: 0,
  title: {
    display: true,
    text: DataLabels.illumination,
  },
  type: 'linear',
})

export const makeTooltipLabelFormatter =
  (units: { [yAxisID: string]: string }): TooltipCallbacks<'line'>['label'] =>
  (tooltipItem) => {
    const unit = units[tooltipItem.dataset.yAxisID as string] || ''
    return `${tooltipItem.formattedValue}${unit}`
  }
