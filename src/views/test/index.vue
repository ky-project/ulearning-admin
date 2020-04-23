<template>
  <div>{{ data }}</div>
</template>

<script>
export default {
  name: 'Test',
  data() {
    return {
      data: [
        {
          name: 1,
          children: [
            {
              name: 4,
              auth: 'a'
            },
            {
              name: 5,
              children: [
                {
                  name: 10,
                  auth: 'b'
                }
              ]
            }
          ]
        },
        {
          name: 2,
          children: [
            {
              name: 6,
              auth: 'c'
            }
          ]
        },
        {
          name: 3,
          children: [
            {
              name: 7,
              auth: 'd'
            },
            {
              name: 8,
              children: [
                {
                  name: 11,
                  auth: 'e'
                }
              ]
            },
            {
              name: 9,
              auth: 'f'
            }
          ]
        }
      ],
      permissions: ['a', 'b', 'd', 'e'],
      accessPermissions: {}
    }
  },
  created() {
    /* if (!isEmpty(this.data)) {
      const stack = [...this.data]
      this.getRoutes(stack, this.permissions)
    } */
    if (this.data) {
      const root = {
        name: 0,
        children: [...this.data]
      }
      // debugger
      const result = this.getRoutes(root)
    }
  },
  methods: {
    copyExpectChildren(obj) {
      const temp = { ...obj }
      delete temp.children
      temp.children = []
      return temp
    },
    // 递归遍历
    getRoutes(node) {
      if (node.children) {
        const tempNode = this.copyExpectChildren(node)
        node.children.forEach(childNode => {
          const obj = this.getRoutes(childNode)
          if (obj.result) {
            tempNode.children.push(obj.node)
          }
        })
        return {
          result: tempNode.children.length > 0,
          node: tempNode
        }
      } else {
        // 叶节点
        const result = this.permissions.includes(node.auth)
        return {
          result,
          node
        }
      }
    }
    /* getRoutes(stack, permissions) {
      while (!isEmpty(stack)) {
        const temp = stack.pop()
        if (temp.children) {
          temp.children.forEach(item => {
            stack.push(item)
          })
        } else {
          // 子节点
          const result = permissions.includes(temp.auth)
          console.log(`子节点${temp.name}：${result}`)
        }
      }
    } */
  }
}
</script>

<style>
/**
 * 默认尺寸为 600px×400px，如果想让图表响应尺寸变化，可以像下面这样
 * 把尺寸设为百分比值（同时请记得为容器设置尺寸）。
 */
.echarts {
  width: 100%;
  height: 100%;
}
</style>
