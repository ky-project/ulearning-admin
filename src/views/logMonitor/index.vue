<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.logUsername" size="small" placeholder="用户账号" style="width: 200px;" class="filter-item" @change="handleFilter" />
      <el-input v-model="listQuery.logDescription" size="small" placeholder="操作内容" style="width: 200px;" class="filter-item" @change="handleFilter" />
      <el-select
        v-model="listQuery.logType"
        placeholder="日志类型"
        style="width: 200px;"
        class="filter-item"
        size="small"
        @change="handleFilter"
      >
        <el-option
          v-for="item in logTypeList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-date-picker
        v-model="listQuery.createTime"
        class="filter-item"
        type="date"
        placeholder="选择日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        style="width: 200px;"
        size="small"
        @change="handleFilter"
      />
      <el-button v-waves class="filter-item" size="small" type="primary" round @click="handleReset">
        重置
      </el-button>
      <el-button v-waves class="filter-item" size="small" type="primary" round icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves v-permission="['logHistory:download', 'logHistory:getVoList']" class="filter-item fr" size="small" type="info" round icon="el-icon-download" @click="handleDownload()">
        历史日志下载
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      size="small"
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="异常详细">
              <span>{{ row.logException }}</span>
            </el-form-item>
            <el-form-item label="请求参数">
              <span>{{ row.logParams }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="用户账号" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.logUsername }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作地址" min-width="170" align="center">
        <template slot-scope="{row}">
          <span>{{ row.logAddress }}({{ row.logIp }})</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.logDescription }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问接口" min-width="170" align="center">
        <template slot-scope="{row}">
          <span>{{ row.logModule }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日志类型" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.logType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" min-width="90" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="耗时" min-width="70" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.logTime > 500 ? (row.logTime > 1000 ? 'danger' : 'warning' ): 'success'">
            <span>{{ row.logTime }} ms</span>
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page-sizes="[8, 16, 32, 64]"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      class="fr"
      @pagination="setPagination"
    />

    <el-dialog
      title="历史日志"
      :visible.sync="dialogFormVisible"
      width="30%"
    >
      <el-radio-group v-model="logHistoryId">
        <el-radio v-for="item in logHistoryList" :key="item.id" :label="item.id">{{ item.logHistoryDate }}</el-radio>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="downLoadLogFile()">
          下载
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getLogTypeList, getLogPageList, getLogHistoryList } from '@/api/log-monitor'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  name: 'LogMonitor',
  components: { Pagination },
  directives: { waves, permission },
  data() {
    return {
      logTypeList: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 8,
        logUsername: '',
        logType: '',
        createTime: '',
        logDescription: ''
      },
      dialogFormVisible: false,
      logHistoryList: [],
      logHistoryId: ''
    }
  },
  created() {
    this.getList()
    this.getLogTypeList()
  },
  methods: {
    getLogTypeList() {
      getLogTypeList()
        .then(response => {
          this.logTypeList = response.data
        })
    },
    handleReset() {
      this.listQuery.logUsername = ''
      this.listQuery.logType = ''
      this.listQuery.createTime = ''
      this.listQuery.logDescription = ''
      this.handleFilter()
    },
    updatePage(val) {
      this.listQuery.currentPage = val
    },
    updateLimit(val) {
      this.listQuery.pageSize = val
    },
    getList() {
      this.listLoading = true
      // 1. 格式化时间
      // this.listQuery.createTime = moment(this.listQuery.createTime,)
      getLogPageList(this.listQuery)
        .then(response => {
          const { content, total } = response.data
          this.list = content
          this.total = total
          this.listLoading = false
        })
    },
    setPagination(currentPage, pageSize) {
      this.getList()
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    // 下载历史文件弹窗
    handleDownload() {
      this.dialogFormVisible = true
      getLogHistoryList()
        .then(response => {
          this.logHistoryList = response.data
        })
    },
    downLoadLogFile() {
      window.location.href = process.env.VUE_APP_BASE_API + `/monitor-manage/logHistory/download?id=${this.logHistoryId}`
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }

}
</style>
<style lang="scss">
.app-container {
  .el-dialog__body {
    padding-bottom: 0;
  }
  .el-select {
    width: 100%;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
}
</style>
