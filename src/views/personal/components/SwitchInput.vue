<template>
  <div class="switch-input">
    <span class="switch-input__label">{{ label }}</span>
    <el-input
      v-if="disabled === false && mode === 'input'"
      :value="value"
      class="switch-input__input"
      :placeholder="placeholder"
      @input="(value) => $emit('input',value)"
    />
    <span v-else-if=" disabled === true || mode === 'text'" class="switch-input__text">{{ value }}</span>
  </div>
</template>

<script>

export default {
  name: 'SwitchInput',

  components: {},
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: 'text' // text 或者 input
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {}

}

</script>
<style lang="scss">
.switch-input {
  ::v-deep .el-input__inner{
    height: 22px;
    line-height: 22px;
  }
}
</style>
<style lang='scss' scoped>
.switch-input {
  display: flex;
  font-size: 14px;
  margin-bottom: 5px;
  height: 22px;
  line-height: 22px;
  // overflow: hidden;
  &__label {
    align-self: center;
    display: inline-block;
    margin-right: 10px;
    white-space: nowrap;
    vertical-align: bottom;
  }
  &__text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  ::v-deep .el-input {
    .el-input__inner {
      height: 22px;
      line-height: 22px;
    }
  }
}
</style>

