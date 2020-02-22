<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.teaName" placeholder="姓名" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.teaNumber" placeholder="工号" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.teaDept" placeholder="系部" style="width: 200px;" class="filter-item" />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item fr"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
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
    >
      <el-table-column label="工号" prop="teaNumber" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.teaNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teaName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" min-width="50" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teaGender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系部" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teaDept }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职称" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teaTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teaPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center" min-width="200">
        <template slot-scope="{row}">
          <span>{{ row.teaEmail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="80" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button
            :style="{color: '#409EFF'}"
            type="text"
            size="mini"
            @click="showPopTransfer(row)"
          >
            <svg-icon icon-class="jiaosexiugai" />
          </el-button>
          <el-button
            :style="{color: '#409EFF'}"
            type="text"
            size="mini"
            @click="handleUpdate(row)"
          >
            <i class="el-icon-edit" />
          </el-button>
          <el-button
            :style="{color: '#F56C6C'}"
            size="mini"
            type="text"
            @click="handleDelete(row,$index)"
          >
            <i class="el-icon-delete" />
          </el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
      >
        <el-form-item label="工号" prop="teaNumber">
          <el-input v-model="temp.teaNumber" />
        </el-form-item>
        <el-form-item label="姓名" prop="teaName">
          <el-input v-model="temp.teaName" />
        </el-form-item>
        <el-form-item label="性别" prop="teaGender">
          <el-select v-model="temp.teaGender" class="filter-item">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="系部" prop="teaDept">
          <el-input v-model="temp.teaDept" />
        </el-form-item>
        <el-form-item label="职称" prop="teaTitle">
          <el-input v-model="temp.teaTitle" />
        </el-form-item>
        <el-form-item label="电话" prop="teaPhone">
          <el-input v-model="temp.teaPhone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="teaEmail">
          <el-input v-model="temp.teaEmail" />
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
    <pop-transfer
      v-model="chooseList"
      pop-title="分配角色"
      :list-titles="['角色池', '已选项']"
      :data="rolesList"
      :visible="visible"
      :on-close="close"
      :on-submit="updateRoles"
    />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { isEmail, isPhone } from '@/utils/validate'
import PopTransfer from '@/components/PopTransfer'
import { getTeacherPageList, updateTeacher, addTeacher, deleteTeacher, getAssignedRole, saveAssignedRole } from '@/api/teacher-manage'
import { getRolesList } from '@/api/role-manage'

export default {
  name: 'TeacherManage',
  components: { Pagination, PopTransfer },
  directives: { waves },
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
        pageSize: 5,
        teaName: '',
        teaNumber: '',
        teaDept: ''
      },
      temp: {
        id: '',
        teaDept: '',
        teaGender: '',
        teaName: '',
        teaNumber: '',
        teaTitle: '',
        teaPhone: '',
        teaEmail: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改教师信息',
        create: '添加教师'
      },
      rules: {
        teaDept: [{ required: true, message: '请输入系部', trigger: 'blur' }],
        teaGender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        teaName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        teaNumber: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        teaTitle: [{ required: true, message: '请输入职称', trigger: 'blur' }],
        teaPhone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        teaEmail: [{ required: true, validator: checkEmail, trigger: 'blur' }]
      },
      // 穿梭框参数
      visible: false,
      rolesList: [],
      chooseList: [],
      selectTeacherId: ''
    }
  },
  created() {
    this.getList()
    this.getRolesList()
  },
  methods: {
    close() {
      this.visible = false
    },
    updatePage(val) {
      this.listQuery.currentPage = val
    },
    updateLimit(val) {
      this.listQuery.pageSize = val
    },
    // 显示穿梭弹窗
    async showPopTransfer(row) {
      this.selectTeacherId = row.id
      const response = await getAssignedRole({ id: row.id })
      this.chooseList = response.data.map(item => item + '')
      this.visible = true
    },
    getList() {
      this.listLoading = true
      getTeacherPageList(this.listQuery)
        .then(response => {
          const { content, total } = response.data
          this.list = content
          this.total = total
          this.listLoading = false
        })
    },
    getRolesList() {
      getRolesList()
        .then(response => {
          this.rolesList = response.data
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
    async updateRoles() {
      // 1. 获取数据
      const ids = this.chooseList.join(',')
      const data = {
        roleIds: ids,
        teaId: this.selectTeacherId
      }
      // 2. 发送请求
      await saveAssignedRole(data)
      this.$message({
        type: 'success',
        message: '角色分配成功'
      })
      this.visible = false
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
          // 1. 添加教师
          addTeacher(this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '教师添加成功'
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
          updateTeacher(this.temp)
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
      this.$confirm('确定永久删除该教师, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        deleteTeacher({ id: row.id })
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
      })
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
}
</style>
