<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <div class="avatar" @click.stop="uploadHeadImg">
        <img :src="userInfo.teaPhoto ? userInfo.teaPhoto : teaPhoto" alt="">
      </div>
      <input type="file" accept="image/*" class="hiddenInput" @change="handleFile">
      <el-dropdown trigger="click" class="dropdown">
        <span class="el-dropdown-link">
          <i class="el-icon-caret-bottom" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/personal">
            <el-dropdown-item>
              个人信息
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">
              <svg-icon icon-class="tuichu" />
              退出
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- <span>{{ userInfo }}</span> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import SvgIcon from '@/components/SvgIcon'
import defaultAvatar from '@/assets/images/user.gif'
export default {
  name: 'Navbar',
  components: {
    Breadcrumb,
    Hamburger,
    SvgIcon
  },
  data() {
    return {
      teaPhoto: defaultAvatar
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userInfo'
    ])
  },
  methods: {
    ...mapActions({
      'uploadAvatar': 'user/uploadAvatar'
    }),
    // 打开图片上传
    uploadHeadImg: function() {
      this.$el.querySelector('.hiddenInput').click()
    },
    // 将头像显示
    handleFile: function(e) {
      const $target = e.target || e.srcElement
      const file = $target.files[0]
      // 上传头像
      // 1. 创建formData
      const params = new FormData()
      // 2. 添加参数
      params.append('photo', file, file.name)
      // 3. 请求
      this.uploadAvatar(params)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    &:focus {
      outline: none;
    }
    .hiddenInput {
      display: none;
    }
    .avatar {
      margin-top: 5px;
      margin-right: 5px;
      cursor: pointer;
      img {
        width: 40px;
        height: 40px;
        border-radius: 5px;
      }
    }
    .dropdown {
      margin-right: 20px;
      .el-dropdown-link {
        cursor: pointer
      }
    }

    /* .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    } */
    /* .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          // background-color: #ccc;
          border-radius: 10px;
        }
      } */

  }
}
</style>
