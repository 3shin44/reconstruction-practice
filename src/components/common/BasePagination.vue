<template>
  <el-pagination
    :current-page.sync="currentPage"
    :page-size="pageDateLength"
    :pager-count="5"
    layout="prev, pager, next"
    :total="totalDataLength"
    class="d-flex justify-center fill-width"
    prev-text="«"
    next-text="»"
    :disabled="disabled"
  >
  </el-pagination>
</template>
<script>
import { computed, defineComponent } from '@vue/composition-api'
// 共用元件頁數選擇器
export default defineComponent({
  name: 'BasePagination',
  components: {},
  props: {
    // 當前頁數
    value: {
      default: 0
    },
    // 總資料數量
    totalDataLength: {
      default: 0
    },
    // 每頁資料數量
    pageDateLength: {
      default: 10
    },
    // 鎖住
    disabled: {
      default: false
    }
  },
  setup(props, { emit }) {
    // 當前頁數
    const currentPage = computed({
      get: () => props.value,
      set: (newValue) => {
        emit('input', newValue)
      }
    })
    return {
      currentPage
    }
  }
})
</script>
