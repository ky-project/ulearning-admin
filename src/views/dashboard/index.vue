<template>
  <div class="dashboard__page">
    <div>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="8">
          <el-card class="dashboard__card welcome">
            <svg-icon icon-class="yonghu" class-name="icon"/>
            <div class="content">
              <p>{{ greet }}, {{ userInfo.teaName }}</p>
              <p :style="{paddingTop: '10px', fontSize: '15px'}">
                上次登录：{{ lastLoginTime }}
              </p>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-card class="dashboard__card visited">
            <svg-icon icon-class="tongji" class-name="icon"/>
            <div class="content">
              <p>今日访问</p>
              <p><span>{{ visitor }}</span>人</p>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-card class="dashboard__card document">
            <svg-icon icon-class="wendang" class-name="icon"/>
            <div class="content">
              <p>文件系统</p>
              <p><span>{{ fileSize }}</span>MB</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="18">
          <el-card class="dashboard__card">
            <div slot="header" class="clearfix">
              <span><svg-icon icon-class="caozuojilu" class-name="icon"/>操作记录</span>
              <el-button
                class="refresh_button"
                type="text"
                size="mini"
                :loading="chartsLoad"
                @click="initOperationCharts">
                <svg-icon icon-class="shuaxin"/>
              </el-button>
            </div>
            <div id="visit-count-chart" style="width: 100%;height: 400px"/>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="6">
          <el-card class="dashboard__card">
            <div slot="header" class="clearfix">
              <span><svg-icon icon-class="caozuorizhi" class-name="icon"/>操作日志</span>
              <el-button
                class="refresh_button"
                type="text"
                size="mini"
                :loading="operationListLoad"
                @click="getOperationList">
                <svg-icon icon-class="shuaxin"/>
                </el-button>
            </div>
            <!--<operate-table height="400px" />-->
            <el-scrollbar style="width:100%; height: 400px">
              <ul class="operation">
                <li v-for="item in list">
                  <span><svg-icon icon-class="yuanquan" class-name="icon"/>    {{ item.createTime }}&nbsp;&nbsp;&nbsp;&nbsp;IP:{{ item.logIp }}</span>
                  <p>
                    {{ item.logUsername }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.logDescription }}
                  </p>
                </li>
              </ul>
            </el-scrollbar>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
import OperateTable from './components/OperateTable'
import {getSumFileSize} from '@/api/file-manage'
import {getDaysTraffic, getLogTop, getDaysOperation} from '@/api/log-monitor'

export default {
  name: 'Dashboard',
  components: {OperateTable},
  mixins: [resize],
  data() {
    return {
      fileSize: 0,
      visitor: '',
      date: [],
      chart: null,
      list: [],
      daysTraffic: 10,
      totalOperation: [],
      selfOperation: [],
      chartsLoad: false,
      operationListLoad: false
    }
  },

  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    greet() {
      const hour = new Date().getHours()
      let greet = ''
      if (hour >= 5 && hour <= 10) {
        greet = '早上好'
      } else if (hour === 11 || hour === 12) {
        greet = '中午好'
      } else if (hour >= 13 && hour <= 17) {
        greet = '下午好'
      } else {
        greet = '晚上好'
      }
      return greet
    },
    lastLoginTime() {
      if (this.userInfo) {
        return this.userInfo.lastLoginTime.split(' ')[0]
      }
      return ''
    }
  },
  watch: {},
  async created() {
    // 1. 获取文件总量
    const fileResponse = await getSumFileSize()
    this.fileSize = parseFloat(fileResponse.data)
    // 2. 获取近7天访问量
    const visitResponse = await getDaysTraffic({days: 1})
    this.visitor = visitResponse.data[0].number;

    this.initOperationCharts();
    this.getOperationList();
  },

  beforeMount() {
  },

  mounted() {
  },

  methods: {
    async initOperationCharts(){
      this.chartsLoad = true;
      const operationResponse = await getDaysOperation({days: this.daysTraffic})
      const operationData = operationResponse.data
      this.totalOperation = operationData.totalOperation.map(item => parseInt(item.number))
      this.selfOperation = operationData.selfOperation.map(item => parseInt(item.number))
      this.date = operationData.totalOperation.map(item => {
        return item.date.split('-')[1] + '-' + item.date.split('-')[2]
      })
      this.initEcharts();
      this.chartsLoad = false;
    },
    async getOperationList(){
      this.operationListLoad = true;
      const response = await getLogTop({topNumber: 15})
      this.list = response.data
      this.operationListLoad = false;
    },
    initEcharts() {
      this.chart = echarts.init(document.getElementById('visit-count-chart'))
      const option = {
        backgroundColor: '#FFF',
        title: {
          text: '近10天的操作记录\n',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['您', '总数'],
          top: '18'
        },
        grid: {
          left: '3%',
          right: '5%',
          bottom: '3%',
          containLabel: true,
          show: false
        },
        toolbox: {
          feature: {
            dataView: {show: false, readOnly: false}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          splitLine: {
            show: false
          },
          data: this.date,
          axisLine: {
            lineStyle: {
              color: '#333'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#DDD'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#333'
              }
            },
            nameTextStyle: {
              color: '#999'
            },
            splitArea: {
              show: false
            }
          }],
        series: [
          {
            name: '总数',
            smooth: true,
            type: 'line',
            color: 'rgb(0, 143, 251)',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(0, 143, 251, 0.8)'
                },
                  {
                    offset: 1,
                    color: '#fff'
                  }
                ],
                globalCoord: false
              }
            },
            data: this.totalOperation
          },
          {
            name: '您',
            smooth: true,
            type: 'line',
            color: 'rgba(82, 222, 151, 1)',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(82, 222, 151, 0.8)'
                },
                  {
                    offset: 1,
                    color: '#fff'
                  }
                ],
                globalCoord: false
              }
            },
            data: this.selfOperation
          }
        ]
      }
      this.chart.setOption(option)
    }
  }

}

</script>
<style lang='scss' scoped>
  .dashboard {
    &__page {
      padding: 20px;
    }

    &__card {
      ::v-deep .el-card__body {
        display: flex;
        justify-content: space-between;

        p {
          color: #5d5d5d;

          span {
            font-weight: bold;
            font-size: 40px;
          }
        }

        .icon {
          width: 80px;
          height: 80px;
          margin-top: 10px;
          color: #ceccc9;
        }
      }

      .content {
        height: 100px;
        width: 100%;
        text-align: center;
      }

      &.welcome {
        background: #fff;

        .icon {
          width: 80px;
          height: 80px;
          margin-top: 10px;
          color: #57cebe;
        }
      }

      &.visited {
        background: #fff;

        .icon {
          width: 80px;
          height: 80px;
          margin-top: 10px;
          color: #ce887c;
        }
      }

      &.document {
        background: #fff;

        .icon {
          width: 80px;
          height: 80px;
          margin-top: 10px;
          color: #6bb4ce;
        }
      }

      .operation {
        width: 100%;
        margin: 5px 10px 5px 5px;
        padding-left: 0;
        line-height: 25px;
        list-style: none;

        .icon {
          width: 12px;
          height: 12px;
          color: #6bb4ce;
        }

        span {
          font-weight: bold;
          font-size: 12px;
          color: #5d5d5d;
        }

        p {
          padding-top: 0;
          margin-top: 0;
          margin: 0;
          font-size: 12px;
          color: #5d5d5d;
        }
      }

      ::v-deep .el-card__header {
        padding-top: 15px;
        padding-bottom: 15px;

        .icon {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
      }
    }
  }

  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .refresh_button {
    color: #409EFF;
    float: right;
    padding: 3px 0;
  }
</style>
