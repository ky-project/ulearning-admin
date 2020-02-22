<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.beforeunloadFn(e))
  },
  methods: {
    beforeunloadFn(e) {
      console.log('刷新了')
      this.$store.dispatch('app/setFresh', true)
    }
  }
}
</script>
