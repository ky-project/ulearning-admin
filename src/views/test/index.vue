<template>
  <v-chart :options="option" />
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

export default {
  components: {
    'v-chart': ECharts
  },
  data() {
    return {
      option: {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // x轴数据
          name: '日期', // x轴名称
          // x轴名称样式
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 18
          }
        },
        yAxis: {
          type: 'value',
          name: '访问量', // y轴名称
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'axis' // axis   item   none三个值
        },
        series: [
          {
            name: '访问数',
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
          }
        ]
      }
    }
  }
}
</script>

<style>
/**
 * 默认尺寸为 600px×400px，如果想让图表响应尺寸变化，可以像下面这样
 * 把尺寸设为百分比值（同时请记得为容器设置尺寸）。
 */
.echarts {
  width: 100%;
  height: 100%;
}
</style>
