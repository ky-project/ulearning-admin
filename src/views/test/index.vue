<template>
  <div>
    <Button @click="open">打开弹窗</Button>
    <PopTransfer
      v-model="value"
      :data="data"
      :visible="visible"
      :on-close="close"
      :on-submit="submit"
    />
  </div>
</template>

<script>
import PopTransfer from '@/components/PopTransfer'
export default {
  name: '',
  components: { PopTransfer },
  data() {
    return {
      data: [
        {
          key: 'key1',
          label: '备选项一'
        },
        {
          key: 'key2',
          label: '备选项二'
        },
        {
          key: 'key3',
          label: '备选项三'
        }
      ],
      value: ['key1', 'key2'],
      visible: false
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {
    open: function() {
      this.visible = true
    },
    close: function() {
      this.visible = false
    },
    submit: function() {
      // 发送请求信息
    }
  }

}

</script>
<style lang='' scoped>

</style>
