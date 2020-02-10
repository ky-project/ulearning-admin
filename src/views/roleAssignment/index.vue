<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.roleName" placeholder="姓名" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.roleName" placeholder="工号" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.roleName" placeholder="部门" style="width: 200px;" class="filter-item" />
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

    <!-- <el-table
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
          <el-button :style="{color: '#409EFF'}" type="text" size="mini" @click="handleUpdate(row)">
            <i class="el-icon-edit" />
          </el-button>
          <el-button :style="{color: '#F56C6C'}" size="mini" type="text" @click="handleDelete(row,$index)">
            <i class="el-icon-delete" />
          </el-button>
        </template>
      </el-table-column>
    </el-table> -->

    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      class="fr"
      @pagination="setPagination"
    /> -->

    <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="temp.roleName" />
        </el-form-item>
        <el-form-item label="角色资源" prop="roleSource">
          <el-input v-model="temp.roleSource" />
        </el-form-item>
        <el-form-item label="管理员" prop="isAdmin">
          <el-select v-model="temp.isAdmin" class="filter-item">
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <allocate
          :current-list="assignedPrivilege"
          :pool-list="restPrivilege"
          value-name="permissionName"
          current-title="已分配权限"
          pool-title="权限池"
          @addItem="addItem"
          @deleteItem="deleteItem"
        />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Allocate from '@/components/Allocate'
// import { isEmpty } from '@/utils'
import { getPrivilegeGroupList, getAllPrivilegeGroup } from '@/api/privilege-manage'
import { getRolePageList, updateRole, addRole, deleteRole, getAssignedPermission, saveAssignedPermission } from '@/api/role-manage'

export default {
  name: 'RoleAssignment',
  components: { Pagination, Allocate },
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
      privilegeGroup: []
    }
  },
  computed: {

  },
  created() {
    this.getList()
    this.getAllPrivilege()
    this.getAllPrivilegeGroup()
  },
  methods: {
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
    /* // 获取剩余权限组
    getRestPrivilege() {
      this.privilegeGroup.forEach(groupName => {
        let tempArr = []
        const allItems = this.allPrivilege[groupName]
        // 如果没有对应的权限组
        if (!this.assignedPrivilege[groupName]) {
          // 直接进行深拷贝
          tempArr = JSON.parse(JSON.stringify(allItems))
        } else {
          // 否则
          const assignedItems = this.assignedPrivilege[groupName]
          for (let i = 0; i < allItems.length; i++) {
            let flag = true
            const allItem = allItems[i]
            for (let j = 0; j < assignedItems.length; j++) {
              const assignedItem = assignedItems[j]
              if (allItem.id === assignedItem.id) {
                flag = false // 存在flag = false
                break
              }
            }
            // 如果不存在，添加
            if (flag) {
              tempArr.push(allItem)
            }
          }
        }
        this.restPrivilege[groupName] = tempArr
      })
    }, */
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
          console.log('response', response)
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
          // this.restPrivilege = temp
          console.log('allPrivilege', this.allPrivilege)
        })
    },
    // 获取未分配的权限
    getRestPrivilege() {
      this.restPrivilege = []
      for (let i = 0; i < this.allPrivilege.length; i++) {
        let flag = true
        const allItem = this.allPrivilege[i]
        for (let j = 0; j < this.assignedPrivilege.length; j++) {
          const assignedItem = this.assignedPrivilege[j]
          if (allItem.id === assignedItem.id) {
            flag = false
            break
          }
        }
        if (flag) {
          this.restPrivilege.push(allItem)
        }
      }
      console.log('restPrivilege', this.restPrivilege)
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
          const response = await addRole(this.temp)
          const id = response.data
          // 2. 添加角色权限
          const permissionIds = this.privilege2string(this.assignedPrivilege)
          await saveAssignedPermission({ roleId: id, permissionIds })
          this.$message({
            type: 'success',
            message: '角色添加成功'
          })
          this.getList()
          this.dialogFormVisible = false
        }
      })
    },
    async handleUpdate(row) {
      // 1. 请求获取该角色已有的权限
      const result = await this.getAssignedPermission(row.id)
      console.log('assignedPrivilege', this.assignedPrivilege)
      if (result === 'success') {
        // 2. 计算剩余权限
        this.getRestPrivilege()
        console.log('restPrivilege', this.restPrivilege)
        // 3. 设置要显示的角色信息
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    },
    privilege2string(privilegeList) {
      const arr = []
      privilegeList.forEach(item => arr.push(item.id))
      return arr.join(',')
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
              message: '删除成功!'
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
