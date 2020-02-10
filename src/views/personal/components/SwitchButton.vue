<template>
  <el-button type="primary" @click="handleClick">{{ textList[index] }}</el-button>
</template>

<script>

export default {
  name: 'SwitchButton',

  components: {},
  props: {
    textList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      index: 0
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {
    handleClick() {
      this.$emit('change', this.index)
      const next = this.index + 1
      this.index = next <= this.textList.length - 1 ? next : 0
    }
  }

}

</script>
<style lang='scss' scoped>

</style>
