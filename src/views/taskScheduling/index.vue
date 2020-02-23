<template>
  <i-frame
    :src="task_scheduling"
    @refresh="refresh"
  />
</template>
<script>
import iFrame from '@/components/iFrame'

export default {
  name: 'TaskScheduling',
  components: { iFrame },
  data() {
    return {
      task_scheduling: process.env.VUE_APP_BASE_API + '/xxl-job-admin/'
    }
  },
  methods: {
  }
}
</script>
