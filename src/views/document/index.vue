<template>
  <i-frame
    :src="document"
  />
</template>
<script>
import iFrame from '@/components/iFrame'

export default {
  name: 'Document',
  components: { iFrame },
  data() {
    return {
      document: process.env.VUE_APP_BASE_API + '/doc.html'
    }
  },
  methods: {
  }
}
</script>
