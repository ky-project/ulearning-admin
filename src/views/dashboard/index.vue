<template>
  <div class="dashboard__page">
    <div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="dashboard__card welcome">
            <div>
              <p><span :style="{fontSize: '20px'}">{{ greet }}</span>， {{ userInfo.teaName }}</p>
              <p :style="{paddingTop: '10px'}">
                上次登录：{{ lastLoginTime }}
              </p>
            </div>
            <svg-icon icon-class="yonghu" class-name="icon" />
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="dashboard__card visited">
            <div>
              <p>今日访问</p>
              <p><span>{{ visitor[6] }}</span>人</p>
            </div>
            <svg-icon icon-class="tongji" class-name="icon" />
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="dashboard__card document">
            <div>
              <p>文件系统</p>
              <p><span>{{ fileSize }}</span>MB</p>
            </div>
            <svg-icon icon-class="wendang" class-name="icon" />
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="dashboard__card">
            <div slot="header" class="clearfix">
              <span><svg-icon icon-class="yonghu1" class-name="icon" />访问量</span>
            </div>
            <visit-chart
              :width="'100%'"
              :height="'280px'"
              :visitor="visitor"
              :date="date"
            />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="dashboard__card">
            <div slot="header" class="clearfix">
              <span><svg-icon icon-class="caozuojilu" class-name="icon" />操作记录</span>
            </div>
            <operate-table height="280px" />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VisitChart from './components/VisitChart'
import OperateTable from './components/OperateTable'
import { getSumFileSize } from '@/api/file-manage'
import { getDaysTraffic } from '@/api/log-monitor'
export default {
  name: 'Dashboard',
  components: { VisitChart, OperateTable },
  data() {
    return {
      fileSize: 0,
      visitor: [],
      date: []
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
      return this.userInfo.lastLoginTime.split(' ')[0]
    }
  },
  watch: {},
  async created() {
    // 1. 获取文件总量
    const fileResponse = await getSumFileSize()
    this.fileSize = parseFloat(fileResponse.data)
    // 2. 获取近7天访问量
    const visitResponse = await getDaysTraffic({ days: 7 })
    const visitData = visitResponse.data
    this.visitor = visitData.map(item => parseInt(item.number))
    this.date = visitData.map(item => {
      return item.date.split('-')[2]
    })
    console.log(this.date)
  },

  beforeMount() {},

  mounted() {},

  methods: {}

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
        color: #fff;
        span {
          font-weight: bold;
          font-size: 40px;
        }
      }
      &>div {
        height: 102px;
      }
      .icon {
        width: 80px;
        height: 80px;
        margin-top: 10px;
        color: #fff;
      }
    }
    &.welcome {
      background: #409EFF;
    }
    &.visited {
      background: #E6A23C;
    }
    &.document {
      background: #409EFF;;
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
</style>
