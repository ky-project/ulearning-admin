<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.recordSizeTmp"
        size="small"
        placeholder="文件大小(MB) 大于等于"
        style="width: 200px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.recordTable"
        size="small"
        placeholder="文件记录所属表"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button v-waves class="filter-item" size="small" type="primary" round @click="handleReset">
        重置
      </el-button>
      <el-button
        v-waves
        class="filter-item"
        size="small"
        type="primary"
        round
        icon="el-icon-search"
        @click="handleFilter"
      >
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
      size="small"
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        :index="indexMethod"
        width="50"
      />
      <el-table-column label="文件名" align="center" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.recordName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属表" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.recordTable }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属表id" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.recordTableId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件大小" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ Math.round(((row.recordSize * 1.0) / 1024 / 1024) * 100) / 100 }} MB</span>
        </template>
      </el-table-column>
      <el-table-column label="文件类型" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.recordType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-permission="['fileRecord:download']" round size="mini" type="info" @click="downLoadFile(row.id)">
            下载
          </el-button>
          <el-button v-permission="['fileRecord:delete']" round size="mini" type="danger" @click="handleDelete(row.id)">
            删除
          </el-button>
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
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { pageListFile, deleteFile } from '@/api/file-manage'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  name: 'FileManage',
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
        recordSizeTmp: '',
        recordSize: '',
        recordTable: ''
      },
      dialogFormVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleReset() {
      this.listQuery.recordTable = ''
      this.listQuery.recordSize = ''
      this.listQuery.recordSizeTmp = ''
    },
    updatePage(val) {
      this.listQuery.currentPage = val
    },
    updateLimit(val) {
      this.listQuery.pageSize = val
    },
    getList() {
      this.listLoading = true
      if (this.listQuery.recordSizeTmp) {
        this.listQuery.recordSize = Math.round(this.listQuery.recordSizeTmp * 1024 * 1024)
      }
      pageListFile(this.listQuery)
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
    downLoadFile(id) {
      window.location.href = process.env.VUE_APP_BASE_API + `/monitor-manage/fileRecord/download?id=${id}`
    },
    handleDelete(id) {
      this.$confirm('确定永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        deleteFile({ id: id })
          .then(response => {
            this.$message({
              type: 'success',
              message: '文件删除成功!'
            })
            this.getList()
          })
      })
    },
    indexMethod(index) {
      return (index + 1) + (this.listQuery.currentPage - 1) * this.listQuery.pageSize
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
