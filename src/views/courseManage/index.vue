<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.courseName" size="small" placeholder="课程名" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.courseNumber" size="small" placeholder="课程号" style="width: 200px;" class="filter-item" />
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
        width="50"
      />
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
// import { isEmail, isPhone } from '@/utils/validate'
import { getCoursePageList, updateCourse, addCourse, deleteCourse } from '@/api/course-manage'
import permission from '@/directive/permission/index.js' // 权限判断指令
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  name: 'CourseManage',
  components: { Pagination },
  directives: { waves, permission, elDragDialog },
  data() {
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
    }
  },
  created() {
    this.getPagePars()
    this.getList()
  },
  methods: {
    getPagePars() {
      const { pagePars } = this.$store.getters
      const path = this.$route.path
      if (pagePars.has(path)) {
        const { currentPage, pageSize, filter } = pagePars.get(path)
        this.listQuery = {
          currentPage,
          pageSize,
          courseName: filter.courseName,
          courseNumber: filter.courseNumber
        }
        return true
      } else {
        return false
      }
    },
    savePagePars() {
      const path = this.$route.path
      const pars = {
        currentPage: this.listQuery.currentPage,
        pageSize: this.listQuery.pageSize,
        filter: {
          courseName: this.listQuery.courseName,
          courseNumber: this.listQuery.courseNumber
        }
      }
      this.$store.dispatch('pagePars/savePagePars', { path, pars })
    },
    updatePage(val) {
      this.listQuery.currentPage = val
    },
    updateLimit(val) {
      this.listQuery.pageSize = val
    },
    getList() {
      this.savePagePars()
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
      this.getList()
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },

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
      }).catch(() => {

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
  .el-input-number {
    width: 100%;
  }
  .el-input-number .el-input__inner {
    text-align: left;
  }
}
</style>
