<template>
  <div class="switch-select">
    <span class="switch-select__label">{{ label }}</span>
    <el-select
      v-if="disabled === false && mode === 'select'"
      :value="value"
      :placeholder="placeholder"
      @change="(val) => {$emit('change',val)}"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <span v-else-if=" disabled === true || mode === 'text'" class="switch-select__text">{{ value }}</span>
  </div>
</template>

<script>

export default {
  name: 'SwitchSelect',

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
      default: 'text' // text 或者 select
    },
    disabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      required: true
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
.switch-select {
  ::v-deep .el-select__inner{
    height: 22px;
    line-height: 22px;
  }
}
</style>
<style lang='scss' scoped>
.switch-select {
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
    .el-input__icon {
      line-height: 22px;
    }
  }
}
</style>

