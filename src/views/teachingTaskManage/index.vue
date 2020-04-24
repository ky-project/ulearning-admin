<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.courseId"
        placeholder="课程名"
        style="width: 200px;"
        class="filter-item"
         size="small"
      >
        <el-option
          v-for="item in courseList"
          :key="item.id"
          :label="item.courseName"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.teaId"
        placeholder="教师名"
        style="width: 200px;"
        class="filter-item"
        size="small"
      >
        <el-option
          v-for="item in teacherList"
          :key="item.id"
          :label="item.teaName"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.term"
        placeholder="学期"
        style="width: 200px;"
        class="filter-item"
        size="small"
      >
        <el-option
          v-for="item in termList"
          :key="item.termItem"
          :label="item.termItem"
          :value="item.termItem"
        />
      </el-select>
      <el-button v-waves size="small" round class="filter-item" type="primary" @click="handleReset">
        重置
      </el-button>
      <el-button v-waves size="small" round class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-permission="['teachingTask:save']" class="filter-item fr" size="small" round="" style="margin-left: 10px;" type="success" icon="el-icon-plus" @click="handleCreate">
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
        width="50">
      </el-table-column>
      <el-table-column label="课程名" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.course.courseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程别称" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teachingTaskAlias }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任课教师" min-width="60" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teacher.teaName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开课学期" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.term }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-permission="['teachingTask:update']" round type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-permission="['teachingTask:delete']" round size="mini" type="danger" @click="handleDelete(row,$index)">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
      >
        <el-form-item label="别称" prop="teachingTaskAlias">
          <el-input v-model="temp.teachingTaskAlias" />
        </el-form-item>
        <el-form-item label="课程名" prop="courseId">
          <el-select
            v-model="temp.courseId"
            placeholder="课程名"
            class="filter-item"
          >
            <el-option
              v-for="item in courseList"
              :key="item.id"
              :label="item.courseName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="教师名" prop="teaId">
          <el-select
            v-model="temp.teaId"
            placeholder="教师名"
            class="filter-item"
          >
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.teaName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学期" prop="term">
          <el-select
            v-model="temp.term"
            placeholder="学期"
            class="filter-item"
          >
            <el-option
              v-for="item in termList"
              :key="item.termItem"
              :label="item.termItem"
              :value="item.termItem"
            />
          </el-select>
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
import { getTaskPageList, updateTask, addTask, deleteTask, getTermList } from '@/api/teaching-task-manage'
import { getAllCourse } from '@/api/course-manage'
import { getAllTeacher } from '@/api/teacher-manage'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  /*  {
				"course": {
					"courseCredit": 0,
					"courseName": "",
					"courseNumber": "",
					"id": 0,
				},
				"courseId": 0,
				"id": 0,
				"teaId": 0,
				"teacher": {
					"id": 0,
					"teaName": "",
				},
				"teachingTaskAlias": "",
        "term": "",
        "createTime": ""
			} */
  name: 'TeachingTaskManage',
  components: { Pagination },
  directives: { waves, permission },
  filters: {
    /* statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    } */
  },
  data() {
    return {
      courseList: [],
      teacherList: [],
      termList: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 8,
        courseId: '',
        teaId: '',
        term: ''
      },
      temp: {
        id: '',
        courseId: '',
        teaId: '',
        teachingTaskAlias: '',
        term: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改教学任务',
        create: '添加教学任务'
      },
      rules: {
        courseId: [{ required: true, message: '请选择课程', trigger: 'blur' }],
        teaId: [{ required: true, message: '请选教师', trigger: 'change' }],
        teachingTaskAlias: [{ required: true, message: '请输入课程别称', trigger: 'blur' }],
        term: [{ required: true, message: '请选择学期', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getTeacherList()
    this.getTermList()
    this.getCourseList()
  },
  methods: {
    handleReset() {
      this.listQuery.courseId = ''
      this.listQuery.teaId = ''
      this.listQuery.term = ''
    },
    getCourseList() {
      getAllCourse()
        .then(response => {
          this.courseList = response.data
        })
    },
    getTeacherList() {
      getAllTeacher()
        .then(response => {
          this.teacherList = response.data
        })
    },
    getTermList() {
      getTermList()
        .then(response => {
          this.termList = response.data
        })
    },
    updatePage(val) {
      this.listQuery.currentPage = val
    },
    updateLimit(val) {
      this.listQuery.pageSize = val
    },
    getList() {
      this.listLoading = true
      getTaskPageList(this.listQuery)
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
        courseId: '',
        teaId: '',
        teachingTaskAlias: '',
        term: ''
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
          // 1. 添加教师
          addTask(this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '教学任务添加成功'
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
          updateTask(this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '教师信息更新成功'
              })
              this.getList()
              this.dialogFormVisible = false
            })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('确定永久删除该教学任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        deleteTask({ id: row.id })
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
