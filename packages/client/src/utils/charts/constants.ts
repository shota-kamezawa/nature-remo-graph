export const DataKindEnum = {
  humidity: 'humidity',
  illumination: 'illumination',
  temperature: 'temperature',
} as const

export const DataLabels = {
  [DataKindEnum.humidity]: '湿度',
  [DataKindEnum.illumination]: '照度',
  [DataKindEnum.temperature]: '室温',
} as const

export const DataUnits = {
  [DataKindEnum.humidity]: '%',
  [DataKindEnum.illumination]: '',
  [DataKindEnum.temperature]: '℃',
} as const

export const DatasetDefaults = {
  [DataKindEnum.humidity]: {
    backgroundColor: 'rgba(54, 162, 235, 0.5)',
    borderColor: 'rgb(54, 162, 235)',
    fill: false,
    label: DataLabels[DataKindEnum.humidity],
    type: 'line',
  },
  [DataKindEnum.illumination]: {
    backgroundColor: 'rgba(255, 159, 64, 0.5)',
    borderColor: 'rgb(255, 159, 64)',
    fill: false,
    label: DataLabels[DataKindEnum.illumination],
    type: 'line',
  },
  [DataKindEnum.temperature]: {
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
    borderColor: 'rgb(255, 99, 132)',
    fill: false,
    label: DataLabels[DataKindEnum.temperature],
    type: 'line',
  },
} as const
