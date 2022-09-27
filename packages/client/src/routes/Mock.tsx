import type { ChartData, ChartOptions, ScatterDataPoint } from 'chart.js'
import 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import * as dateFns from 'date-fns'
import { Chart } from 'react-chartjs-2'

const Mock = () => {
  // https://www.chartjs.org/docs/latest/axes/cartesian/time.html
  // https://www.chartjs.org/docs/latest/samples/line/multi-axis.html
  // https://www.chartjs.org/docs/latest/samples/utils.html

  const unitMap: Record<string, string> = {
    y: '℃',
    y1: '%',
  }

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
        text: 'Chart.js Line Chart',
      },
      tooltip: {
        callbacks: {
          label(tooltipItem) {
            const point = tooltipItem.raw as ScatterDataPoint
            const value = Number(point.y).toFixed(1)
            const unit = unitMap[tooltipItem.dataset.yAxisID as string] || ''
            return `${value}${unit}`
          },
        },
      },
    },
    responsive: true,
    scales: {
      x: {
        bounds: 'ticks',
        max: '2021-11-07 03:00',
        min: '2021-11-06 23:00',
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
      },
      y: {
        position: 'left',
        suggestedMax: 35,
        suggestedMin: 10,
        title: {
          display: true,
          text: '室温 ℃',
        },
        type: 'linear',
      },
      y1: {
        grid: {
          drawOnChartArea: false,
        },
        position: 'right',
        suggestedMax: 80,
        suggestedMin: 30,
        title: {
          display: true,
          text: '湿度 %',
        },
        type: 'linear',
      },
      y2: {
        grid: {
          drawOnChartArea: false,
        },
        position: 'right',
        suggestedMax: 300,
        suggestedMin: 0,
        title: {
          display: true,
          text: '照度',
        },
        type: 'linear',
      },
    },
  }

  const data: ChartData = {
    datasets: [
      {
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
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
        label: '気温',
        yAxisID: 'y',
      },
      {
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
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
        label: '湿度',
        yAxisID: 'y1',
      },
      {
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgb(255, 159, 64)',
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
        // fill: true,
        label: '照度',
        // type: 'bar',
        yAxisID: 'y2',
      },
    ],
  }

  return (
    <>
      <Chart data={data} height={500} options={options} type="line" />
    </>
  )
}

export default Mock
