<template>
  <div class="pop-transfer">
    <el-dialog
      :title="popTitle"
      :visible="visible"
      @close="onClose"
    >
      <my-transfer
        :value="value"
        :data="data"
        :titles="listTitles"
        @input="(val) => {this.$emit('input', val)}"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyTransfer from '@/components/MyTransfer'
export default {
  name: '',
  components: { MyTransfer },
  props: {
    value: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    },
    onClose: {
      type: Function,
      requreid: true,
      default: () => {}
    },
    popTitle: {
      type: String,
      default: '提示'
    },
    listTitles: Array,
    onSubmit: {
      type: Function,
      required: true
    }
  },
  data() {
    return {

    }
  }
}

</script>
<style lang='scss' scoped>
.pop-transfer {
  ::v-deep .el-dialog {
    width: 500px;
    .el-dialog__body {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
}
</style>
