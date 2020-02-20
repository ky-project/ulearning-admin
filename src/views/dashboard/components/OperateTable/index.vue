<template>
  <el-table
    :data="data"
    :height="height"
    size="mini"
    border
    style="width: 100%"
  >
    <el-table-column
      type="index"
      width="50"
      label="#"
    />
    <el-table-column
      prop="logUsername"
      label="姓名"
      width="100"
    />
    <el-table-column
      prop="logDescription"
      label="操作名"
      width="180"
    />
    <el-table-column
      prop="createTime"
      label="时间"
    />
  </el-table>
</template>

<script>
import { getLogTop } from '@/api/log-monitor'
export default {
  name: 'OperateTable',
  props: {
    height: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      data: []
    }
  },
  async created() {
    // 获取20条操作记录
    const response = await getLogTop({ topNumber: 20 })
    this.data = response.data
  }
}

</script>
