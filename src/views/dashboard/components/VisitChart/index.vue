<template>
  <v-chart :options="option" :style="{ width: width, height: height}" />
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

export default {
  name: 'VisitChart',
  components: {
    'v-chart': ECharts
  },
  props: {
    width: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    },
    date: {
      type: Array,
      required: true
    },
    visitor: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
    option() {
      return {
        xAxis: {
          type: 'category',
          data: this.date // x轴数据
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis' // axis   item   none三个值
        },
        series: [
          {
            name: '访问数',
            data: this.visitor,
            type: 'line'
          }
        ]
      }
    }
  }
}
</script>
