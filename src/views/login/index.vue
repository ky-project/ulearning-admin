<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">U-Learning  后台管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="code" class="code-input">
        <span class="svg-container">
          <svg-icon icon-class="verify-code" />
        </span>
        <el-input
          v-model="loginForm.code"
          placeholder="验证码"
          name="code"
          type="text"
          tabindex="3"
          @change="handleLogin"
        />
        <!--<img :src="code.img" alt="" @click="getcode">-->
      </el-form-item>
      <img :src="code.img" alt="" class="code-image" @click="getcode">

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

    </el-form>
  </div>
</template>

<script>
import { getVerifyCode } from '@/api/auth'

export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码至少为5位'))
      } else {
        callback()
      }
    }
    return {
      code: {
        img: '',
        uuid: ''
      },
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        code: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      loading: false,
      passwordType: 'password'
    }
  },
  /* watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  }, */
  created() {
    this.getcode()
  },
  methods: {
    getcode() {
      getVerifyCode()
        .then(response => {
          this.code = response.data
        })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', { ...this.loginForm, uuid: this.code.uuid, loginType: 1 }).then(() => {
            this.$router.push({ path: '/' })
            this.loading = false
          }).catch(() => {
            this.getcode()
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
  $bg: #fff;
  $light_gray: #fff;
  $cursor: #555;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      font-size: 14px;
      color: $cursor;
    }
  }

  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 75%;
      input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        color: #000000;
        height: 28px;
        caret-color: $cursor;
        &:-webkit-autofill {
          box-shadow: 0 0 0 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid #dedede;
      border-radius: 2px;
      color: #454545;
      transition: all .3s;

      &:hover {
        border-color: #57a3f3;
      }
    }
  }

</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #aaa;
  $light_gray: #eee;

  .login-container {
    background: url(../../assets/images/admin_background.png) 50% no-repeat;
    background-size: cover;
    width: 100%;
    height: 100vh;

    .login-info {
      position: absolute;
      left: 15%;
      top: 44%;
      margin-top: -100px;
      color: #fff;
      font-weight: 600;

      .title {
        font-size: 1.8rem;
        font-weight: 600;
      }
    }

    .login-form {
      position: absolute;
      top: 35%;
      left: 75%;
      margin: -180px 0 0 -160px;
      width: 320px;
      height: 400px;
      padding: 36px;
      background: #fff;
      border-radius: 3px;
      box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.16);

      .code-input {
        .el-input {
          width: 70%;
        }

        width: 50%;
        display: inline-block;
        vertical-align: middle;
      }

      .code-image {
        width: 48%;
        height: 52px;
        display: inline-block;
        vertical-align: top;
        cursor: pointer;
      }

      .login-type {
        text-align: right;
        display: inline-block;
        width: 100%;
      }

      .logo-wrapper {
        display: inline-block;
        margin: 10px 0;

        img {
          width: 1.9rem;
          display: inline-block;
          margin: .8rem .8rem -.8rem .8rem;
          cursor: pointer;

          &.radius {
            border-radius: 50%;
          }
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .title-container {
      position: relative;

      .title {
        font-size: 20px;
        color: rgba(0, 0, 0, .85);
        margin: 0 auto 40px auto;
        text-align: center;
        font-weight: bold;
      }

    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }

    @media screen and (max-width: 1100px) {
      .login-info {
        left: 8%;
      }
    }

    @media screen and (max-width: 970px) {
      .login-form {
        left: 50%;
      }
      .login-info {
        display: none;
      }
    }
  }

</style>
