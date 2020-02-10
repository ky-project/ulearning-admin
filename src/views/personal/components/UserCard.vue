<template>
  <el-card class="user-card">
    <div slot="header" class="clearfix">
      <span>关于我</span>
    </div>
    <div class="content">

      <div class="header">
        <img :src="userInfo.teaPhoto ? userInfo.teaPhoto : avatar" class="avatar" alt="">
        <h4>{{ role.roleName || '???' }}</h4>
        <p>{{ userBaseInfo.teaName }}</p>
      </div>
      <div class="info">
        <div class="info-section">
          <div class="info-section__header">
            <svg-icon icon-class="yonghuxinxi" />
            <span>基本信息</span>
          </div>
          <div class="info-section__body">
            <switch-input
              placeholder="请输入账号"
              label="账号"
              :disabled="true"
              :value="userBaseInfo.teaNumber"
              @input="(value) => {userBaseInfo.teaNumber = value}"
            />
            <switch-input
              placeholder="请输入姓名"
              label="姓名"
              :disable="true"
              :value="userBaseInfo.teaName"
              @input="(value) => {userBaseInfo.teaName = value}"
            />
            <switch-select
              placeholder="请输入性别"
              label="性别"
              :disable="true"
              :value="userBaseInfo.teaGender"
              :options="[{label: '男', value: '男'}, {label: '女', value: '女'}]"
              @change="(val) => {userBaseInfo.teaGender = val}"
            />
            <switch-input
              placeholder="请输入部门"
              label="部门"
              :disabled="true"
              :value="userBaseInfo.teaDept"
              @input="(value) => {userBaseInfo.teaDept = value}"
            />
            <switch-input
              placeholder="请输入职称"
              label="职称"
              :disabled="true"
              :value="userBaseInfo.teaTitle"
            />
          </div>
        </div>
        <div class="info-section">
          <div class="info-section__header">
            <svg-icon icon-class="lianxi" />
            <span>联系方式</span>
          </div>
          <div class="info-section__body">
            <switch-input
              placeholder="请输入手机号"
              label="手机"
              :mode="inputMode"
              :value="userBaseInfo.teaPhone"
              @input="(value) => {userBaseInfo.teaPhone = value}"
            />
            <switch-input
              placeholder="请输入邮箱"
              label="邮箱"
              :mode="inputMode"
              :value="userBaseInfo.teaEmail"
              @input="(value) => {userBaseInfo.teaEmail = value}"
            />
          </div>
        </div>
      </div>
      <el-button
        class="btn"
        type="primary"
        :loading="isloading"
        @click="handeBtnClick"
      >{{ state === 1 ? '保存' : '修改' }}</el-button>
    </div>
  </el-card>
</template>

<script>
import SwitchInput from './SwitchInput'
import SwitchSelect from './SwitchSelect'
import { mapActions, mapGetters } from 'vuex'
import defaultAvatar from '@/assets/images/user.gif'
import { filterObj } from '@/utils'
import { isPhone, isEmail } from '@/utils/validate'
export default {
  name: 'UserCard',

  components: {
    SwitchInput,
    SwitchSelect
  },
  data() {
    return {
      avatar: defaultAvatar,
      userBaseInfo: {},
      isloading: false,
      state: 0 // 0 - show , 1 - edit
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'role'
    ]),
    inputMode() {
      return this.state === 1 ? 'input' : 'text'
    }
  },
  created() {
    this.userBaseInfo = this.getUserBaseInfo()
  },
  methods: {
    ...mapActions({
      'setInfo': 'user/setInfo'
    }),
    getUserBaseInfo() {
      const userInfo = this.$store.getters.userInfo
      const condition = ['id', 'teaNumber', 'teaName', 'teaGender', 'teaDept', 'teaTitle', 'teaPhone', 'teaEmail']
      return filterObj(userInfo, condition)
    },
    handeBtnClick() {
      const { state } = this
      if (state === 0) {
        this.state = 1
      } else if (state === 1) {
        // 1. 表单验证
        const result = this.isValidate()
        if (result === true) {
          this.isloading = true
          // 2. 发送请求
          this.setInfo(this.userBaseInfo)
            .then(() => {
              this.$message({
                type: 'success',
                message: '个人信息修改成功'
              })
              this.state = 0
              this.isloading = false
            })
            .catch((error) => {
              this.$message({
                type: 'error',
                message: error
              })
              this.isloading = false
            })
        } else {
          this.$message({
            type: 'error',
            message: result
          })
        }
      }
    },
    isValidate() {
      const { teaPhone, teaEmail } = this.userBaseInfo
      if (!teaPhone) {
        return '请输入电话号'
      }
      if (!teaEmail) {
        return '请输入邮箱'
      }
      if (!isPhone(teaPhone)) {
        return '电话格式错误'
      }
      if (!isEmail(teaEmail)) {
        return '邮箱格式错误'
      }
      return true
    }
  }

}

</script>
<style lang='scss' scoped>
.user-card {
  margin-bottom: 20px;
  .content {
    .header {
      text-align: center;
      .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: #ccc;
      }
      h4 {
        margin: 0;
        margin-top: 10px;
        font-size: 16px;
      }
      p {
        margin: 0;
        margin-top: 10px;
        font-size: 14px;
        color: #777;
      }
    }
    .info {
      .info-section {
        &__header {
          line-height: 30px;
          margin-bottom: 10px;
          border-bottom: 1px solid #ccc;
        }
      }
    }
    // padding-left: 15px;
    ::v-deep .el-button {
      width: 100% !important;
      margin-top: 10px;
      padding: 6px 0;
    }
  }
}
</style>
