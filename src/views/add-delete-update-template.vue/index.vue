<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="姓名" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.title" placeholder="工号" style="width: 200px;" class="filter-item" />
      <el-select
        v-model="listQuery.sort"
        style="width: 140px"
        class="filter-item"
        placeholder="部门"
        @change="handleFilter"
      >
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item fr" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
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
      <el-table-column label="Actions" align="center" min-width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      class="fr"
      @pagination="getList"
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
          <el-select v-model="temp.teaDept" class="filter-item">
            <el-option label="机电系" value="机电系" />
            <el-option label="纺服系" value="纺服系" />
          </el-select>
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
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { isEmail, isPhone } from '@/utils/validate'

export default {
  name: 'TeacherManage',
  components: { Pagination },
  directives: { waves },
  filters: {
  },
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
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      temp: {
        /* id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published' */
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改教师信息',
        create: '添加教师'
      },
      rules: {
        teaDept: [{ required: true, message: 'teaDept is required', trigger: 'change' }],
        teaGender: [{ required: true, message: 'teaGender is required', trigger: 'change' }],
        teaName: [{ required: true, message: 'teaName is required', trigger: 'blur' }],
        teaNumber: [{ required: true, message: 'teaNumber is required', trigger: 'blur' }],
        teaTitle: [{ required: true, message: 'teaTitle is required', trigger: 'blur' }],
        teaPhone: [{ validator: checkPhone, trigger: 'blur' }],
        teaEmail: [{ validator: checkEmail, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // TODO: 请求数据
      setTimeout(() => {
        this.list = [
          {
            'id': '1',
            'teaDept': '机电系', // 系部
            'teaEmail': '15868163725@163.com', // 邮箱
            'teaGender': '男', // 性别
            'teaName': '王一帆', // 姓名
            'teaNumber': '16620216', // 工号
            'teaPhone': '15868163725', // 电话
            'teaTitle': '无' // 职称
          },
          {
            'id': '2',
            'teaDept': '纺服系', // 系部
            'teaEmail': '1445830802@qq.com', // 邮箱
            'teaGender': '女', // 性别
            'teaName': '王帆', // 姓名
            'teaNumber': '16620217', // 工号
            'teaPhone': '13812822352', // 电话
            'teaTitle': '无' // 职称
          }
        ]
        this.total = 2
        this.listLoading = false
      }, 1.5 * 1000)
    },
    handleFilter() {
      this.listQuery.page = 1
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      console.log('更新数据')
    },
    handleDelete(row, index) {

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
