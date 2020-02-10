<template>
  <div class="dashboard-container">
    <img src="@/assets/images/showcase.png" alt="">
    <div>
      <p>欢迎登录</p>
      <p>基于泛在学习的后台管理系统</p>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  computed: {

  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  position: relative;;
  img {
    filter: blur(3px);
    text-align: center;
  }
  div {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    p {
      font-size: 30px;
      color: #fff;
    }
  }
}
</style>
