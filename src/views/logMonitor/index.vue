<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.logUsername" placeholder="用户账号" style="width: 200px;" class="filter-item" />
      <el-select
        v-model="listQuery.logType"
        placeholder="日志类型"
        style="width: 200px;"
        class="filter-item"
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
      />
      <el-button v-waves class="filter-item" type="primary" @click="handleReset">
        重置
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
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
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="执行模块">
              <span>{{ row.logModule }}</span>
            </el-form-item>
            <el-form-item label="异常详细">
              <span>{{ row.logException }}</span>
            </el-form-item>
            <el-form-item label="请求耗时">
              <span>{{ row.logTime }}</span>
            </el-form-item>
            <el-form-item label="请求参数">
              <span>{{ row.logParams }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="用户账号" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.logUsername }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作地址" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.logAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="50" align="center">
        <template slot-scope="{row}">
          <span>{{ row.logDescription }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日志类型" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.logType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      class="fr"
      @pagination="setPagination"
    />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getLogTypeList, getLogPageList } from '@/api/log-monitor'

export default {
  name: 'LogMonitor',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      logTypeList: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 5,
        logUsername: '',
        logType: '',
        createTime: ''
      },
      dialogFormVisible: false
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
      console.log('createTime', this.listQuery.createTime)
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
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
}
</style>
