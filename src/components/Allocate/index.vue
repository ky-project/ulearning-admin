<template>
  <div class="allocate">
    <div class="allocate-list">
      <div class="allocate-list__title">
        <span>{{ currentTitle }}</span>
      </div>
      <div class="allocate-list__content">
        <el-scrollbar style="height:100%">
          <ul>
            <li v-for="(item, index) in currentList" :key="item.id">
              <span>{{ item[valueName] }}</span>
              <i class="el-icon-minus" @click="() => {$emit('deleteItem',index)}" />
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <svg-icon icon-class="jiaohuan" class-name="allocate-icon" />
    <div class="allocate-list">
      <div class="allocate-list__title">
        <span>{{ poolTitle }}</span>
      </div>
      <div class="allocate-list__content">
        <el-scrollbar style="height:100%">
          <ul>
            <li v-for="(item, index) in poolList" :key="item.id">
              <span>{{ item[valueName] }}</span>
              <i class="el-icon-plus" @click="() => {$emit('addItem',index)}" />
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Allocate',
  props: {
    currentTitle: {
      type: String,
      default: '已分配列表'
    },
    poolTitle: {
      type: String,
      default: '未分配列表'
    },
    currentList: {
      type: Array,
      required: true
    },
    poolList: {
      type: Array,
      required: true
    },
    valueName: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang='scss' scoped>
.allocate {
  width: 100%;
  padding: 15px;
  display: flex;
  .allocate-list {
    min-width: 100px;
    flex-grow: 1;
    height: 250px;
    border-radius: 5px;
    border: 1px solid #ccc;
    &__title {
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      font-weight: bold;
      padding: 0 10px;
      text-align: center;
      border-bottom: 1px solid #ccc;
    }
    &__content {
      height: 220px;
      ::v-deep .el-scrollbar__wrap{
        overflow-x: hidden;
      }
      ul {
        list-style: none;
        padding-inline-start: 0;
        margin: 0;
        li {
          // width: 100%;
          &:hover {
            cursor: pointer;
            background-color: #eee;
          }
          display: flex;
          justify-content: space-between;
          height: 25px;
          line-height: 25px;
          padding: 0 10px;
          border-bottom: 1px solid #eee;
          i {
            margin-top: 5px;
            color: red;
            cursor: pointer;
          }
        }
      }
    }
  }
  .allocate-icon {
    align-self: center;
    width: 100px;
    font-size: 40px;
  }
}
</style>
