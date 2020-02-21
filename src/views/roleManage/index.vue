<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.roleName" placeholder="角色名" style="width: 200px;" class="filter-item" />
      <el-select v-model="listQuery.isAdmin" placeholder="是否为管理员" style="width: 200px;" class="filter-item">
        <el-option
          label="true"
          :value="true"
        />
        <el-option
          label="false"
          :value="false"
        />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" @click="handleReset">
        重置
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item fr" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
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
      <el-table-column label="角色名" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色资源" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.roleSource }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否为管理员" min-width="50" align="center">
        <template slot-scope="{row}">
          <span>{{ row.isAdmin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="70" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button :style="{color: '#409EFF'}" type="text" size="mini" @click="showPopTransfer(row)">
            <svg-icon icon-class="jiaosexiugai" />
          </el-button>
          <el-button :style="{color: '#409EFF'}" type="text" size="mini" @click="handleUpdate(row)">
            <i class="el-icon-edit" />
          </el-button>
          <el-button :style="{color: '#F56C6C'}" size="mini" type="text" @click="handleDelete(row,$index)">
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
        <el-form-item label="角色名" label-width="80px" prop="roleName">
          <el-input v-model="temp.roleName" />
        </el-form-item>
        <el-form-item label="角色资源" label-width="80px" prop="roleSource">
          <el-input v-model="temp.roleSource" />
        </el-form-item>
        <el-form-item label="管理员" label-width="80px" prop="isAdmin">
          <el-select v-model="temp.isAdmin" class="filter-item">
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
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
    <pop-transfer
      v-model="chooseList"
      pop-title="分配权限"
      :list-titles="['权限池', '已选项']"
      :data="rightsList"
      :visible="visible"
      :on-close="close"
      :on-submit="updateRights"
    />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import PopTransfer from '@/components/PopTransfer'
import { getPrivilegeGroupList, getAllPrivilegeGroup } from '@/api/privilege-manage'
import {
  getRolePageList,
  updateRole,
  addRole,
  deleteRole,
  saveAssignedPermission,
  getAssignedPermission
} from '@/api/role-manage'
import {
  getRightsList
} from '@/api/rights-manage'

export default {
  name: 'RoleManage',
  components: { Pagination, PopTransfer },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 5,
        isAdmin: '',
        roleName: ''
      },
      temp: {
        id: '',
        isAdmin: '',
        roleName: '',
        roleSource: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改角色',
        create: '添加角色'
      },
      rules: {
        roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        roleSource: [{ required: true, message: '请选角色资源', trigger: 'blur' }],
        isAdmin: [{ required: true, message: '请选择是否为管理员', trigger: 'change' }]
      },
      allPrivilege: [],
      assignedPrivilege: [],
      restPrivilege: [],
      privilegeGroup: [],
      // 穿梭框参数
      visible: false,
      rightsList: [],
      chooseList: [],
      selectRoleId: ''
    }
  },
  created() {
    this.getList()
    this.getAllPrivilege()
    this.getAllPrivilegeGroup()
    this.getRightsList()
  },
  methods: {
    close() {
      this.visible = false
    },
    // 更新角色权限
    async updateRights() {
      // 1. 获取数据
      const ids = this.chooseList.join(',')
      const data = {
        permissionIds: ids,
        roleId: this.selectRoleId
      }
      // 2. 发送请求
      await saveAssignedPermission(data)
      this.$message({
        type: 'success',
        message: '角色权限分配成功'
      })
      this.visible = false
    },
    // 显示穿梭弹窗
    async showPopTransfer(row) {
      this.selectRoleId = row.id
      const response = await getAssignedPermission({ roleId: row.id })
      this.chooseList = response.data.map(item => {
        return item.key
      })
      this.visible = true
    },
    deleteItem(index) {
      const tempItem = this.assignedPrivilege[index]
      this.assignedPrivilege.splice(index, 1)
      this.restPrivilege.push(tempItem)
    },
    addItem(index) {
      const tempItem = this.restPrivilege[index]
      this.restPrivilege.splice(index, 1)
      this.assignedPrivilege.push(tempItem)
    },
    // 格式化权限
    formatPrivilege(data) {
      const keys = Object.keys(data)
      let result = []
      keys.forEach(item => {
        result = [...result, ...data[item]]
      })
      return result
    },
    // 获取所有权限列表
    getRightsList() {
      getRightsList()
        .then(response => {
          this.rightsList = response.data
        })
    },
    // 获取所有权限组
    getAllPrivilegeGroup() {
      getAllPrivilegeGroup()
        .then(response => {
          this.privilegeGroup = response.data
        })
    },
    // 获取已分配的权限
    getAssignedPermission(id) {
      return getAssignedPermission({ roleId: id })
        .then(response => {
          this.assignedPrivilege = this.formatPrivilege(response.data)
          return Promise.resolve('success')
        })
    },
    // 获取所有权限
    getAllPrivilege() {
      getPrivilegeGroupList()
        .then(response => {
          const temp = this.formatPrivilege(response.data)
          this.allPrivilege = temp
        })
    },
    handleReset() {
      this.listQuery.roleName = ''
      this.listQuery.isAdmin = ''
    },
    updatePage(val) {
      this.listQuery.currentPage = val
    },
    updateLimit(val) {
      this.listQuery.pageSize = val
    },
    getList() {
      this.listLoading = true
      getRolePageList(this.listQuery)
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
    resetData() {
      this.temp = {
        isAdmin: '',
        roleName: '',
        roleSource: ''
      }
      this.assignedPrivilege = []
      this.restPrivilege = JSON.parse(JSON.stringify(this.allPrivilege))
    },
    handleCreate() {
      this.resetData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          // 1. 添加角色
          await addRole(this.temp)
          this.$message({
            type: 'success',
            message: '角色添加成功'
          })
          this.getList()
          this.getAllPrivilegeGroup()
          this.dialogFormVisible = false
        }
      })
    },
    async updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 1. 发送修改角色请求
          const permissionIds = this.privilege2string(this.assignedPrivilege)
          Promise.all([updateRole(this.temp), saveAssignedPermission({ roleId: this.temp.id, permissionIds })])
            .then(response => {
              this.$message({
                type: 'success',
                message: '角色信息更新成功'
              })
              this.getList()
              this.getAllPrivilegeGroup()
              this.dialogFormVisible = false
            })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('确定永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        deleteRole({ id: row.id })
          .then(response => {
            this.$message({
              type: 'success',
              message: '角色删除成功!'
            })
            this.getList()
          })
      })
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
