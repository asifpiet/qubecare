import store from '@/store';
import { usePatientStore } from '@/stores/patientStore';
import { useProviderStore } from '@/stores/providerStore';
import { hexToRgb } from '@core/utils/colorConverter';
// 👉 Colors variables
const patientStore = usePatientStore()
const providerStore = useProviderStore()
const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`

  return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

export const getScatterChartConfig = themeColors => {
  const scatterColors = {
    series1: '#ff9f43',
    series2: '#7367f0',
    series3: '#28c76f',
  }

  const { themeSecondaryTextColor, themeBorderColor, themeDisabledTextColor } = colorVariables(themeColors)

  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      zoom: {
        type: 'xy',
        enabled: true,
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      markers: { offsetX: -3 },
      fontSize: '13px',
      labels: { colors: themeSecondaryTextColor },
      itemMargin: {
        vertical: 3,
        horizontal: 10,
      },
    },
    colors: [scatterColors.series1, scatterColors.series2, scatterColors.series3],
    grid: {
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: true },
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: '0.8125rem', colors: themeDisabledTextColor },
      },
    },
    xaxis: {
      tickAmount: 10,
      axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      crosshairs: {
        stroke: { color: themeBorderColor },
      },
      labels: {
        style: { colors: themeDisabledTextColor },
        formatter: val => Number.parseFloat(val).toFixed(1),
      },
    },
  }
}
export const getLineChartProviderSimpleConfig = themeColors => {
  console.log('getProviderStats', store.getters.getProviderStats.monthly);
  const { themeBorderColor, themeDisabledTextColor } = colorVariables(themeColors)

  return {
    chart: {
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ['#ff9f43'],
    stroke: { curve: 'straight' },
    dataLabels: { enabled: false },
    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      colors: ['#ff9f43'],
      strokeColors: ['#fff'],
    },
    grid: {
      padding: { top: -10 },
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: true },
      },
    },
    tooltip: {
      custom(data) {
        return `<div class='bar-chart pa-2'>
          <span>${data.series[data.seriesIndex][data.dataPointIndex]}%</span>
        </div>`
      },
    },
    yaxis: {
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      crosshairs: {
        stroke: { color: themeBorderColor },
      },
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
      categories: store.getters.getProviderStats.monthly,
    },
  }
}
export const getLineInvoiceChartSimpleConfig = themeColors => {
  console.log('getInvocieStats', providerStore.invocieReport.monthly);
  const { themeBorderColor, themeDisabledTextColor } = colorVariables(themeColors)

  return {
    chart: {
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ['#ff9f43'],
    stroke: { curve: 'straight' },
    dataLabels: { enabled: false },
    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      colors: ['#ff9f43'],
      strokeColors: ['#fff'],
    },
    grid: {
      padding: { top: -10 },
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: true },
      },
    },
    tooltip: {
      custom(data) {
        return `<div class='bar-chart pa-2'>
          <span>${data.series[data.seriesIndex][data.dataPointIndex]}%</span>
        </div>`
      },
    },
    yaxis: {
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      crosshairs: {
        stroke: { color: themeBorderColor },
      },
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
      categories: providerStore.invocieReport.monthly,
    },
  }
}
export const getLinePatientPortalAppointmentChartSimpleConfig = themeColors => {
  console.log('getPatientDashbaordPortalStats', patientStore.appointmentMonthlyDates);
  const { themeBorderColor, themeDisabledTextColor } = colorVariables(themeColors)

  return {
    chart: {
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ['#ff9f43'],
    stroke: { curve: 'straight' },
    dataLabels: { enabled: false },
    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      colors: ['#ff9f43'],
      strokeColors: ['#fff'],
    },
    grid: {
      padding: { top: -10 },
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: true },
      },
    },
    tooltip: {
      custom(data) {
        return `<div class='bar-chart pa-2'>
          <span>${data.series[data.seriesIndex][data.dataPointIndex]}%</span>
        </div>`
      },
    },
    yaxis: {
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      crosshairs: {
        stroke: { color: themeBorderColor },
      },
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
      categories: patientStore.appointmentMonthlyDates
    },
  }
}
export const getLineProviderChartSimpleConfig = themeColors => {
  console.log('getPatientStats', providerStore.providerReport.monthly);
  const { themeBorderColor, themeDisabledTextColor } = colorVariables(themeColors)

  return {
    chart: {
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ['#ff9f43'],
    stroke: { curve: 'straight' },
    dataLabels: { enabled: false },
    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      colors: ['#ff9f43'],
      strokeColors: ['#fff'],
    },
    grid: {
      padding: { top: -10 },
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: true },
      },
    },
    tooltip: {
      custom(data) {
        return `<div class='bar-chart pa-2'>
          <span>${data.series[data.seriesIndex][data.dataPointIndex]}%</span>
        </div>`
      },
    },
    yaxis: {
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      crosshairs: {
        stroke: { color: themeBorderColor },
      },
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
      categories: providerStore.providerReport.monthly,
    },
  }
}
export const getLinePatientChartSimpleConfig = themeColors => {
  console.log('getPatientStats', store.getters.getPatientStats.monthly);
  const { themeBorderColor, themeDisabledTextColor } = colorVariables(themeColors)

  return {
    chart: {
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ['#ff9f43'],
    stroke: { curve: 'straight' },
    dataLabels: { enabled: false },
    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      colors: ['#ff9f43'],
      strokeColors: ['#fff'],
    },
    grid: {
      padding: { top: -10 },
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: true },
      },
    },
    tooltip: {
      custom(data) {
        return `<div class='bar-chart pa-2'>
          <span>${data.series[data.seriesIndex][data.dataPointIndex]}%</span>
        </div>`
      },
    },
    yaxis: {
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      crosshairs: {
        stroke: { color: themeBorderColor },
      },
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
      categories: store.getters.getPatientStats.monthly,
    },
  }
}
export const getLineChartSimpleConfig = themeColors => {
  console.log('getProviderStats', store.getters.getPatientStats.monthly);
  const { themeBorderColor, themeDisabledTextColor } = colorVariables(themeColors)

  return {
    chart: {
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ['#ff9f43'],
    stroke: { curve: 'straight' },
    dataLabels: { enabled: false },
    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      colors: ['#ff9f43'],
      strokeColors: ['#fff'],
    },
    grid: {
      padding: { top: -10 },
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: true },
      },
    },
    tooltip: {
      custom(data) {
        return `<div class='bar-chart pa-2'>
          <span>${data.series[data.seriesIndex][data.dataPointIndex]}%</span>
        </div>`
      },
    },
    yaxis: {
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      crosshairs: {
        stroke: { color: themeBorderColor },
      },
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
      categories: store.getters.getPatientStats.monthly,
    },
  }
}
export const getBarChartConfig = themeColors => {
  const { themeBorderColor, themeDisabledTextColor } = colorVariables(themeColors);

  // Safely extract data from the store
  let appointmentReport = providerStore.appointementReport;

  // Ensure appointmentReport is an object and not null/undefined
  if (typeof appointmentReport === 'string') {
    try {
      appointmentReport = JSON.parse(appointmentReport);
    } catch (error) {
      console.error('Invalid JSON in getAppiontmentReport:', error);
      appointmentReport = {};
    }
  } else if (!appointmentReport || typeof appointmentReport !== 'object') {
    appointmentReport = {};
  }

  // Safely extract categories
  const categories = appointmentReport.providersName || [];
  console.log('Bar Chart Categories:', categories);

  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    colors: ['rgb(115,103,240)'],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 8,
        barHeight: '30%',
        horizontal: true,
      },
    },
    grid: {
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: false },
      },
      padding: {
        top: -10,
      },
    },
    yaxis: {
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      categories, // Safely use categories
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
    },
  };
};

export const getCandlestickChartConfig = themeColors => {
  const candlestickColors = {
    series1: '#28c76f',
    series2: '#ea5455',
  }

  const { themeBorderColor, themeDisabledTextColor } = colorVariables(themeColors)

  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: { columnWidth: '40%' },
      candlestick: {
        colors: {
          upward: candlestickColors.series1,
          downward: candlestickColors.series2,
        },
      },
    },
    grid: {
      padding: { top: -10 },
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: true },
      },
    },
    yaxis: {
      tooltip: { enabled: true },
      crosshairs: {
        stroke: { color: themeBorderColor },
      },
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
    },
    xaxis: {
      type: 'datetime',
      axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      crosshairs: {
        stroke: { color: themeBorderColor },
      },
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
    },
  }
}
export const getRadialBarChartConfig = themeColors => {
  const radialBarColors = {
    series1: '#fdd835',
    series2: '#32baff',
    series3: '#00d4bd',
    series4: '#7367f0',
    series5: '#FFA1A1',
  }

  const { themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(themeColors)

  return {
    stroke: { lineCap: 'round' },
    labels: ['Comments', 'Replies', 'Shares'],
    legend: {
      show: true,
      fontSize: '13px',
      position: 'bottom',
      labels: {
        colors: themeSecondaryTextColor,
      },
      markers: {
        offsetX: -3,
      },
      itemMargin: {
        vertical: 3,
        horizontal: 10,
      },
    },
    colors: [radialBarColors.series1, radialBarColors.series2, radialBarColors.series4],
    plotOptions: {
      radialBar: {
        hollow: { size: '30%' },
        track: {
          margin: 15,
          background: themeColors.variables['track-bg'],
        },
        dataLabels: {
          name: {
            fontSize: '2rem',
          },
          value: {
            fontSize: '0.9375rem',
            color: themeSecondaryTextColor,
          },
          total: {
            show: true,
            fontWeight: 400,
            label: 'Comments',
            fontSize: '1.125rem',
            color: themePrimaryTextColor,
            formatter(w) {
              const totalValue = w.globals.seriesTotals.reduce((a, b) => {
                return a + b
              }, 0) / w.globals.series.length

              if (totalValue % 1 === 0)
                return `${totalValue}%`
              else
                return `${totalValue.toFixed(2)}%`
            },
          },
        },
      },
    },
    grid: {
      padding: {
        top: -30,
        bottom: -25,
      },
    },
  }
}
export const getDonutChartConfig = themeColors => {
  const donutColors = {
    series1: '#826bf8',
    series2: '#00d4bd',
    series3: '#fdd835',
    series4: '#32baff',
    series5: '#ffa1a1',
  }

  const { themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(themeColors)
  // Safely extract data from the store
  let appointmentReport = providerStore.appointementReport;

  // Ensure appointmentReport is an object and not null/undefined
  if (typeof appointmentReport === 'string') {
    try {
      appointmentReport = JSON.parse(appointmentReport);
    } catch (error) {
      console.error('Invalid JSON in getAppiontmentReport:', error);
      appointmentReport = {};
    }
  } else if (!appointmentReport || typeof appointmentReport !== 'object') {
    appointmentReport = {};
  }

  // Safely extract categories
  const labels = providerStore.appointementReport.appointmentTypes || [];
  console.log('Bar Chart labels:', labels);
  return {
    stroke: { width: 0 },
    labels,
    colors: [donutColors.series1, donutColors.series5, donutColors.series3, donutColors.series2],
    dataLabels: {
      enabled: true,
      formatter: val => `${Number.parseInt(val, 10)}%`,
    },
    legend: {
      position: 'bottom',
      markers: { offsetX: -3 },
      fontSize: '13px',
      labels: { colors: themeSecondaryTextColor },
      itemMargin: {
        vertical: 3,
        horizontal: 10,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '1.125rem',
            },
            value: {
              fontSize: '1.125rem',
              color: themeSecondaryTextColor,
              formatter: val => `${Number.parseInt(val, 10)}`,
            },
            total: {
              show: true,
              fontSize: '1.125rem',
              label: 'Appiontment',
              formatter: () => '31%',
              color: themePrimaryTextColor,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '0.9375rem',
                  },
                  value: {
                    fontSize: '0.9375rem',
                  },
                  total: {
                    fontSize: '0.9375rem',
                  },
                },
              },
            },
          },
        },
      },
    ],
  }
}
export const getAreaChartSplineConfig = themeColors => {
  const areaColors = {
    series3: '#e0cffe',
    series2: '#b992fe',
    series1: '#ab7efd',
  }

  const { themeSecondaryTextColor, themeBorderColor, themeDisabledTextColor } = colorVariables(themeColors)

  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    tooltip: { shared: false },
    dataLabels: { enabled: false },
    stroke: {
      show: false,
      curve: 'straight',
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '13px',
      labels: { colors: themeSecondaryTextColor },
      markers: {
        offsetY: 1,
        offsetX: -3,
      },
      itemMargin: {
        vertical: 3,
        horizontal: 10,
      },
    },
    colors: [areaColors.series3, areaColors.series2, areaColors.series1],
    fill: {
      opacity: 1,
      type: 'solid',
    },
    grid: {
      show: true,
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: true },
      },
    },
    yaxis: {
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      crosshairs: {
        stroke: { color: themeBorderColor },
      },
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
      categories: [
        '7/12',
        '8/12',
        '9/12',
        '10/12',
        '11/12',
        '12/12',
        '13/12',
        '14/12',
        '15/12',
        '16/12',
        '17/12',
        '18/12',
        '19/12',
      ],
    },
  }
}
export const getColumnChartConfig = themeColors => {
  const columnColors = {
    series1: '#826af9',
    series2: '#d2b0ff',
    bg: 'transparent',
  };

  const { themeSecondaryTextColor, themeBorderColor, themeDisabledTextColor } = colorVariables(themeColors);

  // Safely extract data from the store
  let appointmentReport = providerStore.appointementReport;

  // Check if it's a JSON string and parse it
  if (typeof appointmentReport === 'string' && appointmentReport.trim()) {
    try {
      appointmentReport = appointmentReport;
    } catch (error) {
      console.error('Invalid JSON in getAppiontmentReport:', error);
      appointmentReport = {};
    }
  } else if (!appointmentReport || typeof appointmentReport !== 'object') {
    // If not a valid object, default to an empty object
    appointmentReport = {};
  }

  console.log('Chart appointmentReport:', appointmentReport);

  const categories = appointmentReport.monthly || [];
  console.log('Chart Categories:', categories);

  return {
    chart: {
      offsetX: -10,
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    fill: { opacity: 1 },
    dataLabels: { enabled: false },
    colors: [columnColors.series1, columnColors.series2],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '13px',
      labels: { colors: themeSecondaryTextColor },
      markers: {
        offsetY: 1,
        offsetX: -3,
      },
      itemMargin: {
        vertical: 3,
        horizontal: 10,
      },
    },
    stroke: {
      show: true,
      colors: ['transparent'],
    },
    plotOptions: {
      bar: {
        columnWidth: '70%',
        colors: {
          backgroundBarRadius: 10,
          backgroundBarColors: [columnColors.bg, columnColors.bg, columnColors.bg, columnColors.bg, columnColors.bg],
        },
      },
    },
    grid: {
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: true },
      },
    },
    yaxis: {
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      categories, // Safely use categories
      crosshairs: {
        stroke: { color: themeBorderColor },
      },
      labels: {
        style: { colors: themeDisabledTextColor, fontSize: '0.8125rem' },
      },
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '35%',
            },
          },
        },
      },
    ],
  };
};


export const getHeatMapChartConfig = themeColors => {
  const { themeSecondaryTextColor, themeDisabledTextColor } = colorVariables(themeColors)

  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      colors: [themeColors.colors.surface],
    },
    legend: {
      position: 'bottom',
      fontSize: '13px',
      labels: {
        colors: themeSecondaryTextColor,
      },
      markers: {
        offsetY: 0,
        offsetX: -3,
      },
      itemMargin: {
        vertical: 3,
        horizontal: 10,
      },
    },
    plotOptions: {
      heatmap: {
        enableShades: false,
        colorScale: {
          ranges: [
            { to: 10, from: 0, name: '0-10', color: '#b9b3f8' },
            { to: 20, from: 11, name: '10-20', color: '#aba4f6' },
            { to: 30, from: 21, name: '20-30', color: '#9d95f5' },
            { to: 40, from: 31, name: '30-40', color: '#8f85f3' },
            { to: 50, from: 41, name: '40-50', color: '#8176f2' },
            { to: 60, from: 51, name: '50-60', color: '#7367f0' },
          ],
        },
      },
    },
    grid: {
      padding: { top: -20 },
    },
    yaxis: {
      labels: {
        style: {
          colors: themeDisabledTextColor,
          fontSize: '0.8125rem',
        },
      },
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
  }
}
export const getRadarChartConfig = themeColors => {
  const radarColors = {
    series1: '#9b88fa',
    series2: '#ffa1a1',
  }

  const { themeSecondaryTextColor, themeBorderColor, themeDisabledTextColor } = colorVariables(themeColors)

  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      dropShadow: {
        top: 1,
        blur: 8,
        left: 1,
        opacity: 0.2,
        enabled: false,
      },
    },
    markers: { size: 0 },
    fill: { opacity: [1, 0.8] },
    colors: [radarColors.series1, radarColors.series2],
    stroke: {
      width: 0,
      show: false,
    },
    legend: {
      fontSize: '13px',
      labels: {
        colors: themeSecondaryTextColor,
      },
      markers: {
        offsetX: -3,
      },
      itemMargin: {
        vertical: 3,
        horizontal: 10,
      },
    },
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: themeBorderColor,
          connectorColors: themeBorderColor,
        },
      },
    },
    grid: {
      show: false,
      padding: {
        top: -20,
        bottom: -20,
      },
    },
    yaxis: { show: false },
    xaxis: {
      categories: ['Battery', 'Brand', 'Camera', 'Memory', 'Storage', 'Display', 'OS', 'Price'],
      labels: {
        style: {
          fontSize: '0.8125rem',
          colors: [
            themeDisabledTextColor,
            themeDisabledTextColor,
            themeDisabledTextColor,
            themeDisabledTextColor,
            themeDisabledTextColor,
            themeDisabledTextColor,
            themeDisabledTextColor,
            themeDisabledTextColor,
          ],
        },
      },
    },
  }
}
