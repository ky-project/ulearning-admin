<template>
  <div>
    <MyTransfer v-model="value" :data="data" />
  </div>
</template>

<script>
import MyTransfer from '@/components/MyTransfer'
export default {
  name: '',
  components: { MyTransfer },
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
      value: ['key1', 'key2']
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {}

}

</script>
<style lang='' scoped>

</style>
