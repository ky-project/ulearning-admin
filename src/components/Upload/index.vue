<template>
  <div :class="className">
    <input v-show="false" ref="input" type="file" @change="changeHandler">
    <div @click="clickHandler">
      <slot />
    </div>
  </div>
</template>

<script>
import { axios2 } from '@/utils/request'
export default {
  name: 'Upload',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    },
    // 格式验证
    validate: {
      type: Function
    },
    // 格式错误信息
    errorMsg: {
      type: String,
      default: '文件格式错误'
    },
    url: {
      type: String,
      required: true
    },
    // 文件参数键值
    fileKey: {
      type: String,
      required: true
    },
    // 其他参数
    data: {
      type: Object,
      default: () => {}
    },
    onUploading: {
      type: Function,
      default: () => {}
    },
    onSuccess: {
      type: Function,
      default: (response) => {}
    },
    onError: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    clickHandler() {
      if (this.disabled) return
      this.$refs.input.click()
    },
    changeHandler() {
      // 1. 获取文件
      const curFiles = this.$refs.input.files
      if (curFiles.length) {
        const curFile = curFiles[0]
        // 2. 验证文件
        if (this.validate) {
          const result = this.validate(curFile)
          if (!result) {
            this.$message.error(this.errorMsg)
            return false
          }
        }
        // 3. 设置参数
        const formData = new FormData()
        if (this.data instanceof Object && this.data !== {}) {
          Object.keys(this.data).forEach(key => {
            formData.append(key, this.data[key])
          })
        }
        formData.append(this.fileKey, curFile)
        // 4. 上传文件
        this.onUploading()
        axios2({
          method: 'POST',
          url: this.url,
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then((response) => {
          this.onSuccess(response)
        }).catch(error => {
          this.onError(error)
        })
      }
    }
  }

}

</script>
<style lang='scss' scoped>
.disabled {
  color: #ccc;
}
</style>
