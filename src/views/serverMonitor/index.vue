<template>
  <i-frame
    :src="server_monitor"
    @refresh="refresh"
  />
</template>
<script>
import iFrame from '@/components/iFrame'

export default {
  name: 'ServerMonitor',
  components: { iFrame },
  data() {
    return {
      server_monitor: process.env.VUE_APP_BASE_API + '/monitor-manage/'
    }
  },
  methods: {
  }
}
</script>
