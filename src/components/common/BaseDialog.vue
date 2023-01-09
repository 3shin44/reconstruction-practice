<template>
  <div :id="dialogID" class="modal fade" role="dialog">
    <div class="modal-dialog" :class="dialogWrapSizeClass">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
            <slot name="header"></slot>
            <button
              v-show="closeButton"
              type="button"
              class="close"
              style=""
              @click="toggleDialogActive(false)"
            >
              <span>×</span>
            </button>
          </h4>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  computed,
  onMounted,
  reactive,
  toRefs,
  watch,
  onBeforeUnmount
} from '@vue/composition-api'
import functionUtil from '../../util/functionUtil'
import { Modal } from 'bootstrap'
import logger from '@/util/loggerUtil'
// 共用元件燈箱
export default defineComponent({
  name: 'BaseDialog',
  components: {},
  props: {
    // 開關
    value: {
      default: false
    },
    // header關閉按鈕
    closeButton: {
      default: false
    },
    // dialog唯一值ID
    dialogKey: {
      // UUID util 跑測試會報錯
      default: () => functionUtil.createUUID()
    },
    // 燈箱大小 (middle | large)
    size: {
      default: 'middle'
    }
  },
  setup(props, { emit }) {
    // 狀態
    const state = reactive({
      dialogID: props.dialogKey,
      dialogModalDOM: null
    })
    // 燈箱開關
    const show = computed({
      get: () => props.value,
      set: (newValue) => {
        emit('input', newValue)
      }
    })
    const dialogWrapSizeClass = computed(() => {
      if (props.size === 'large') {
        return 'modal-lg'
      }
      return ''
    })
    // 監聽顯示狀態後開或關燈箱
    watch(
      () => props.value,
      (currentShow) => {
        if (!state.dialogModalDOM) return
        setTimeout(() => {
          if (currentShow) {
            state.dialogModalDOM.show()
          } else {
            state.dialogModalDOM.hide()
          }
          // 主要是燈箱fade有150動畫的時間影響 連續按會有問題(此方法是快速解法)
        }, 151)
      }
    )
    /**
     * 切換燈箱開啟或關閉
     * @param { boolean } active - 切換狀態
     */
    const toggleDialogActive = (active) => {
      show.value = active
    }
    // 載入
    onMounted(() => {
      const DOM = document.getElementById(state.dialogID)
      if (DOM) {
        // 初始化燈箱
        state.dialogModalDOM = new Modal(DOM, {
          backdrop: 'static',
          keyboard: false
        })
        // 初始化就開啟燈箱
        if (show.value) {
          state.dialogModalDOM.show()
        }
      }
    })
    // 銷毀
    onBeforeUnmount(() => {
      try {
        state.dialogModalDOM.hide()
      } catch (error) {
        logger.warn('BaseDialog onBeforeUnmount error', error)
      }
    })
    return {
      ...toRefs(state),
      toggleDialogActive,
      show,
      dialogWrapSizeClass
    }
  }
})
</script>
<style lang="scss" scoped>
.modal-body {
  overflow-y: auto;
  max-height: 75vh;
}
</style>
