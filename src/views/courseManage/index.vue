<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.courseName" size="small" placeholder="课程号" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.courseNumber" size="small" placeholder="课程名" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" size="small" round type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-permission="['course:save']" class="filter-item fr" size="small" round style="margin-left: 10px;" type="success" icon="el-icon-plus" @click="handleCreate">
        添加
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
        width="50">
      </el-table-column>
      <el-table-column label="课程号" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.courseNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.courseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学分" min-width="50" align="center">
        <template slot-scope="{row}">
          <span>{{ row.courseCredit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-permission="['course:update']" round type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-permission="['course:delete']" round size="mini" type="danger" @click="handleDelete(row,$index)">
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

    <el-dialog :title="textMap[dialogStatus]"
               v-el-drag-dialog
               :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        size="small"
        label-position="left"
        label-width="70px"
      >
        <el-form-item label="课程号" prop="courseNumber">
          <el-input v-model="temp.courseNumber" />
        </el-form-item>
        <el-form-item label="课程名" prop="courseName">
          <el-input v-model="temp.courseName" />
        </el-form-item>
        <el-form-item label="学分" prop="courseCredit">
          <!-- <el-input v-model="temp.courseCredit" /> -->
          <el-input-number
            v-model="temp.courseCredit"
            controls-position="right"
            :min="0.5"
            :max="10"
            :step="0.5"
          />
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
import { isEmail, isPhone } from '@/utils/validate'
import { getCoursePageList, updateCourse, addCourse, deleteCourse } from '@/api/course-manage'
import permission from '@/directive/permission/index.js' // 权限判断指令
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  name: 'CourseManage',
  components: { Pagination },
  directives: { waves, permission, elDragDialog },
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('teaPhone is required'))
      } else if (!isPhone(value)) {
        return callback(new Error('手机格式有误!'))
      } else {
        return callback()
      }
    }
    const checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('teaEmail is required'))
      } else if (!isEmail(value)) {
        return callback(new Error('邮箱格式有误!'))
      } else {
        return callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 8,
        courseName: '',
        courseNumber: ''
      },
      temp: {
        id: '',
        courseName: '',
        courseNumber: '',
        courseCredit: '',
        updateTime: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改课程信息',
        create: '添加课程'
      },
      rules: {
        courseName: [{ required: true, message: '请输入课程名', trigger: 'blur' }],
        courseNumber: [{ required: true, message: '请输入课程号', trigger: 'blur' }],
        courseCredit: [{ required: true, message: '请输入学分', trigger: 'blur' }]
      }
      /* dialogPvVisible: false,
      pvData: [],
      downloadLoading: false */
    }
  },
  /* computed: {
    page: {
      get() {
        return this.listQuery.currentPage
      },
      set(val) {
        this.listQuery.currentPage = val
      }
    },
    limit: {
      get() {
        return this.listQuery.pageSize
      },
      set(val) {
        this.listQuery.pageSize = val
      }
    }
  }, */
  created() {
    this.getList()
  },
  methods: {
    updatePage(val) {
      this.listQuery.currentPage = val
    },
    updateLimit(val) {
      this.listQuery.pageSize = val
    },
    getList() {
      this.listLoading = true
      getCoursePageList(this.listQuery)
        .then(response => {
          const { content, total } = response.data
          this.list = content
          this.total = total
          this.listLoading = false
        })
    },
    setPagination(currentPage, pageSize) {
      // this.listQuery.currentPage = currentPage
      // this.listQuery.pageSize = pageSize
      this.getList()
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    /* handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },*/
    resetTemp() {
      this.temp = {
        'id': '',
        'teaDept': '', // 系部
        'teaEmail': '', // 邮箱
        'teaGender': '', // 性别
        'teaName': '', // 姓名
        'teaNumber': '', // 工号
        'teaPhone': '', // 电话
        'teaTitle': '' // 职称
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
          // 1. 添加课程
          addCourse(this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '课程添加成功'
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
          // 1. 发送请求
          updateCourse(this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '课程信息更新成功'
              })
              this.getList()
              this.dialogFormVisible = false
            })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('确定永久删除该课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        deleteCourse({ id: row.id })
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
    /* handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    } */
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
  .el-input-number {
    width: 100%;
  }
  .el-input-number .el-input__inner {
    text-align: left;
  }
}
</style>
