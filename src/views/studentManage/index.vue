<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input v-model="listQuery.stuName" size="small" placeholder="姓名" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.stuNumber" size="small" placeholder="学号" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.stuDept" size="small" placeholder="系部" style="width: 200px;" class="filter-item" />
      <el-button
        v-waves
        round
        size="small"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <Upload
        url="/system-manage/student/importExcel"
        file-key="file"
        class-name="fr"
        :on-success="uploadSuccess"
        :on-error="uploadError"
      >
        <el-button
          size="small"
          round
          class="filter-item"
          style="margin-left: 10px;"
          type="success"
          v-permission="['student:importExcel']"
          icon="el-icon-upload2"
        >
          批量导入
        </el-button>
      </Upload>
      <el-button
        size="small"
        round
        class="filter-item fr pan-btn green-btn"
        style="margin-left: 10px;"
        type="info"
        icon="el-icon-download"
        v-permission="['student:downloadTemplate']"
        @click="handleDownloadTemplate"
      >
        下载模板
      </el-button>
      <el-button
        size="small"
        round
        class="filter-item fr"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-plus"
        v-permission="['student:save']"
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>
    <!-- 表格 -->
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
        width="50"
        :index="indexMethod"
      />
      <el-table-column label="学号" prop="stuNumber" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.stuNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" min-width="50" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stuGender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系部" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stuDept }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stuPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center" min-width="200">
        <template slot-scope="{row}">
          <span>{{ row.stuEmail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button
            type="primary"
            size="mini"
            round
            v-permission="['student:update']"
            @click="handleUpdate(row)"
          >
            修改
          </el-button>
          <el-button
            size="mini"
            type="danger"
            round
            v-permission="['student:delete']"
            @click="handleDelete(row,$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page-sizes="[8, 16, 32, 64]"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      class="fr"
      @pagination="setPagination"
    />
    <!-- 弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
      >
        <el-form-item label="学号" prop="stuNumber">
          <el-input v-model="temp.stuNumber" />
        </el-form-item>
        <el-form-item label="姓名" prop="stuName">
          <el-input v-model="temp.stuName" />
        </el-form-item>
        <el-form-item label="性别" prop="stuGender">
          <el-select v-model="temp.stuGender" class="filter-item">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="系部" prop="stuDept">
          <el-input v-model="temp.stuDept" />
        </el-form-item>
        <el-form-item label="电话" prop="stuPhone">
          <el-input v-model="temp.stuPhone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="stuEmail">
          <el-input v-model="temp.stuEmail" />
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
    <!-- 提示消息 -->
    <el-dialog
      class-name="error-dialog"
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>{{ dialogTitle }}</span>
      <ul>
        <li
          v-for="item in dialogMessageList"
          :key="item.line"
          :style="{lineHeight: '23px'}"
        >
          {{ `第${item.line}行：${item.errorMsg}` }}
        </li>
      </ul>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Upload from '@/components/Upload'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { isEmail, isPhone } from '@/utils/validate'
import { getStudentPageList, updateStudent, addStudent, deleteStudent } from '@/api/student-manage'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  name: 'StudentManage',
  components: { Pagination, Upload },
  directives: { waves, permission },
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('stuPhone is required'))
      } else if (!isPhone(value)) {
        return callback(new Error('手机格式有误!'))
      } else {
        return callback()
      }
    }
    const checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('stuEmail is required'))
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
        stuName: '',
        stuNumber: '',
        stuDept: ''
      },
      temp: {
        id: '',
        stuDept: '',
        stuGender: '',
        stuName: '',
        stuNumber: '',
        stuTitle: '',
        stuPhone: '',
        stuEmail: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改学生信息',
        create: '添加学生'
      },
      rules: {
        stuDept: [{ required: true, message: '请输入系部', trigger: 'blur' }],
        stuGender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        stuName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        stuNumber: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        stuPhone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        stuEmail: [{ required: true, validator: checkEmail, trigger: 'blur' }]
      },
      dialogVisible: false, // 消息提示
      dialogTitle: '', //
      dialogMessageList: [] // {line:xxx, errorMsg:xxx}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    uploadSuccess(response) {
      const { message, data } = response.data
      if (message && data) {
        this.dialogVisible = true
        this.dialogTitle = message
        this.dialogMessageList = Object.keys(data).map(key => {
          return {
            line: key,
            errorMsg: data[key].errorMsg
          }
        })
      } else {
        this.$message.success('导入成功')
      }
    },
    uploadError(error) {
      // this.$message.error(error.message || '出错')
    },
    updatePage(val) {
      this.listQuery.currentPage = val
    },
    updateLimit(val) {
      this.listQuery.pageSize = val
    },
    getList() {
      this.listLoading = true
      getStudentPageList(this.listQuery)
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
        'stuDept': '', // 系部
        'stuEmail': '', // 邮箱
        'stuGender': '', // 性别
        'stuName': '', // 姓名
        'stuNumber': '', // 学号
        'stuPhone': '' // 电话
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
          // 1. 添加学生
          addStudent(this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '学生添加成功'
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
          updateStudent(this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '学生信息更新成功'
              })
              this.getList()
              this.dialogFormVisible = false
            })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('确定永久删除该学生, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        deleteStudent({ id: row.id })
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
      })
    },
    handleDownloadTemplate() {
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = process.env.VUE_APP_BASE_API + '/system-manage/student/downloadTemplate'
      document.body.appendChild(a)
      a.click() // 触发点击
      document.body.removeChild(a) // 然后移除
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
  /* .error-dialog {
    // &::v-deep .el-dialog__body
    &::v-deep ul {
      list-style: none;
      li {
        line-height: 23px;
      }
    }
  } */
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
