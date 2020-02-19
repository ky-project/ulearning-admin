<template>
  <div class="my-transfer">
    <el-transfer
      :value="value"
      filterable
      :data="data"
      :titles="titles"
      :filter-placeholder="filterPlaceholder"
      @input="(val) => {this.$emit('input',val)}"
    />
  </div>
</template>

<script>

export default {
  name: 'MyTransfer',
  props: {
    value: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    titles: {
      type: Array,
      default: () => {
        return ['备选池', '已选项']
      }
    },
    filterPlaceholder: {
      type: String,
      default: '请输入要搜索内容'
    }
  }
}

</script>
<style lang='scss' scoped>
.my-transfer {
  ::v-deep .el-transfer__buttons {
    width: 60px;
    margin-right: 25px;
    .el-button {
      padding: 5px;
      margin-left: 0;
    }
  }
}
</style>
