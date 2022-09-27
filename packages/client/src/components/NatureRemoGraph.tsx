import type {
  ChartData,
  ChartOptions,
  ScaleOptionsByType,
  TooltipCallbacks,
} from 'chart.js'
import 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import { Chart } from 'react-chartjs-2'

import { makeTimelineScaleOptions } from '../utils/charts'

// https://www.chartjs.org/docs/latest/axes/cartesian/time.html
// https://www.chartjs.org/docs/latest/samples/line/multi-axis.html
// https://www.chartjs.org/docs/latest/samples/utils.html

export const NatureRemoGraph = (props: {
  datasets: ChartData['datasets']
  height?: string | number
  scales: ChartOptions['scales']
  timeline?: {
    max?: ScaleOptionsByType<'time'>['max']
    min?: ScaleOptionsByType<'time'>['min']
  }
  tooltipLabelFormatter?: TooltipCallbacks<'line'>['label']
}) => {
  const options: ChartOptions = {
    interaction: {
      intersect: false,
      mode: 'nearest',
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Nature Remo Graph',
      },
      tooltip: {
        callbacks: {
          label: props.tooltipLabelFormatter,
        },
      },
    },
    responsive: true,
    scales: {
      ...props.scales,
      x: makeTimelineScaleOptions({
        endTime: props.timeline?.max,
        startTime: props.timeline?.min,
      }),
    },
  }

  const data: ChartData = {
    datasets: props.datasets,
  }

  return (
    <>
      <Chart data={data} height={props.height} options={options} type="line" />
    </>
  )
}

export default NatureRemoGraph
