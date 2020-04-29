<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.permissionGroup"
        size="small"
        style="width: 200px"
        class="filter-item"
        placeholder="权限组"
        @change="handleFilter"
      >
        <el-option v-for="item in rightsGroup" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input v-model="listQuery.permissionName" size="small" class="filter-item" style="width: 200px" placeholder="权限名" />
      <el-button v-waves round size="small" class="filter-item" type="primary" @click="handleReset">
        重置
      </el-button>
      <el-button v-waves round size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-permission="['permission:save']" round size="small" class="filter-item fr" style="margin-left: 10px;" type="success" icon="el-icon-plus" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      size="small"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        :index="indexMethod"
        width="50"
      />
      <el-table-column label="权限组" align="center" min-width="100">
        <template slot-scope="{row}">
          <span>{{ row.permissionGroup }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限名" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.permissionName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限码" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.permissionSource }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限url" min-width="160" align="center">
        <template slot-scope="{row}">
          <span>{{ row.permissionUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" min-width="160" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-permission="['permission:update']" type="primary" round size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-permission="['permission:delete']" round size="mini" type="danger" @click="handleDelete(row,$index)">
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

    <el-dialog
      v-el-drag-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        size="small"
        label-position="left"
        label-width="70px"
      >
        <el-form-item label="权限组" prop="permissionGroup">
          <el-autocomplete
            v-model="temp.permissionGroup"
            :style="{width: '100%'}"
            :fetch-suggestions="querySearch"
          />
        </el-form-item>
        <el-form-item label="权限名" prop="permissionName">
          <el-input v-model="temp.permissionName" />
        </el-form-item>
        <el-form-item label="权限码" prop="permissionSource">
          <el-input v-model="temp.permissionSource" />
        </el-form-item>
        <el-form-item label="权限url" prop="permissionUrl">
          <el-input v-model="temp.permissionUrl" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getAllRightsGroup, getRightsPageList, deleteRights, addRights, updateRights } from '@/api/rights-manage'
import permission from '@/directive/permission/index.js' // 权限判断指令
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  name: 'RightsManage',
  components: { Pagination },
  directives: { waves, permission, elDragDialog },
  data() {
    return {
      rightsGroup: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 8,
        permissionGroup: '',
        permissionName: ''
      },
      temp: {
        id: '',
        permissionGroup: '',
        permissionName: '',
        permissionSource: '',
        permissionUrl: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改权限信息',
        create: '添加权限'
      },
      rules: {
        permissionGroup: [{ required: true, message: '请输入权限组', trigger: ['blur', 'change'] }],
        permissionName: [{ required: true, message: '请输入权限名', trigger: 'blur' }],
        permissionSource: [{ required: true, message: '请输入权限码', trigger: 'blur' }],
        permissionUrl: [{ required: true, message: '请输入权限url', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getAllRightsGroup()
  },
  methods: {
    handleReset() {
      this.listQuery.courseId = ''
      this.listQuery.permissionGroup = ''
      this.listQuery.permissionName = ''
    },
    querySearch(queryString, cb) {
      const { rightsGroup } = this
      const rightsList = rightsGroup.map(item => ({ value: item }))
      const queryExp = new RegExp(queryString)
      var results = queryString ? rightsList.filter(item => queryExp.test(item.value)) : rightsList
      return cb(results)
    },
    updatePage(val) {
      this.listQuery.currentPage = val
    },
    updateLimit(val) {
      this.listQuery.pageSize = val
    },
    getAllRightsGroup() {
      getAllRightsGroup()
        .then(response => {
          const { data } = response
          this.rightsGroup = data
        })
    },
    getList() {
      this.listLoading = true
      const { listQuery } = this
      getRightsPageList(listQuery)
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
    resetTemp() {
      this.temp = {
        id: '',
        permissionGroup: '',
        permissionName: '',
        permissionSource: '',
        permissionUrl: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addRights(this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '权限添加成功'
              })
              this.getList()
              this.dialogFormVisible = false
            })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateRights(this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '权限信息更新成功'
              })
              this.getList()
              this.dialogFormVisible = false
            })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('确定永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        deleteRights({ id: row.id })
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
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
}
</style>
