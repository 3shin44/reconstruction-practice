<template>
  <!-- 如果都沒資料 不顯示此元件 -->
  <div v-if="incomingCallAlertNotOwnerList.length > 0">
    <!-- 來電提示-有非本人來電記錄 當前(3筆) -->
    <div class="card mb-3 border-danger">
      <div class="card-header bg-danger">
        <span style="vertical-align: -webkit-baseline-middle">
          {{ speakTip.speakTitle }}
        </span>
        <!-- More按鈕 -->
        <button
          type="button"
          class="btn btn-sm btn-light float-right"
          @click="incomingCallAlertNotOwnerDialogActive = true"
          v-show="incomingCallAlertNotOwnerList.length > 3"
        >
          <span>More</span>
        </button>
      </div>
      <div class="card-body">
        <!-- 顯示speakContent訊息 字串做換行<br>處理 -->
        <div class="row">
          <div class="col-12">
            <p v-html="speakTip.speakContent.replace(/\n/g, '<br />')"></p>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <!-- 最近期的資料(目前固定3筆) -->
            <table
              class="table table-hover table-bordered table-sm table-auth mb-0"
            >
              <thead>
                <tr>
                  <th class="table-active">來電時間</th>
                  <th class="table-active" style="min-width: 70px">接電人員</th>
                  <th class="table-active">原因註記</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in recentIncomingCallAlertNotOwnerList"
                  :key="item.SKEY"
                >
                  <td>{{ item.LOGIN_TIME }}</td>
                  <td>{{ item.AGENTS }}</td>
                  <td class="text-practice">{{ item.REASON }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- 來電提示-有非本人來電記錄全部 燈箱 -->
    <BaseDialog v-model="incomingCallAlertNotOwnerDialogActive" :size="'large'">
      <template slot="header">來電提示-有非本人來電記錄</template>
      <template slot="body">
        <table
          class="table table-hover table-bordered table-sm table-auth mb-2"
        >
          <thead>
            <tr>
              <th class="table-active">來電時間</th>
              <th class="table-active">接電人員</th>
              <th class="table-active">原因註記</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="pageItem in currentPageIncomingCallAlertNotOwnerList"
              :key="pageItem.SKEY"
            >
              <td>{{ pageItem.LOGIN_TIME }}</td>
              <td>{{ pageItem.AGENTS }}</td>
              <td class="text-practice">{{ pageItem.REASON }}</td>
            </tr>
          </tbody>
        </table>
        <BasePagination
          v-model="currentPage"
          :total-data-length="incomingCallAlertNotOwnerList.length"
          :page-date-length="10"
        />
      </template>
      <template slot="footer">
        <button
          type="button"
          class="btn btn-sm btn-secondary"
          @click="incomingCallAlertNotOwnerDialogActive = false"
        >
          <i class="fas fa-times-circle mr-1"></i>
          <span>關閉</span>
        </button>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import api from '../../api'
import logger from '../../util/loggerUtil'
import BaseDialog from '../common/BaseDialog.vue'
import BasePagination from '../common/BasePagination.vue'
import {computed, defineComponent, onMounted, reactive, toRefs, watch} from '@vue/composition-api'
import EventBus from '../../event/EventBus'
// 來電提示-有非本人來電記錄
export default defineComponent({
  name: 'IncomingCallAlertNotOwner',
  components: { BaseDialog, BasePagination },
  props: {
    speakTip: {
      default: {
        tipSkey: '',
        speakComponent: '',
        speakTitle: '',
        speakContent: '',
        speakSort: '',
        mDate: '',
        muser: ''
      }
    },
    queryData: {
      default: {}
    }
  },
  setup(props) {
    // 狀態
    const state = reactive({
      // 來電提示非本人列表
      incomingCallAlertNotOwnerList: [],
      incomingCallAlertNotOwnerDialogActive: false,
      currentPage: 1
    })

    // 最近期的 來電提示非本人列表(目前是最前面3筆)
    const recentIncomingCallAlertNotOwnerList = computed(() =>
      state.incomingCallAlertNotOwnerList.slice(0, 3)
    )

    // 當前頁數的 來電提示非本人列表
    const currentPageIncomingCallAlertNotOwnerList = computed(() => {
      // 10頁一筆
      return state.incomingCallAlertNotOwnerList.slice(
        (state.currentPage - 1) * 10,
        state.currentPage * 10
      )
    })

    // 監聽 來電提示非本人燈箱開啟
    watch(
      () => state.incomingCallAlertNotOwnerDialogActive,
      async (newValue) => {
        if (newValue) {
          state.currentPage = 1
        }
      }
    )

    // 取得來電提示-有非本人來電記錄
    const getIncomingCallAlertNotOwner = async () => {
      try {
        const { funcHis } = await api.checkClientRecordInPeriod({
          custId: props.queryData.custId,
          funcId: props.queryData.funcId
        })
        if (funcHis && Array.isArray(funcHis)) {
          state.incomingCallAlertNotOwnerList = funcHis
        }
      } catch (error) {
        logger.error('func getIncomingCallAlertNotOwner error', error)
      }
    }

    // 載入
    onMounted(() => {
      getIncomingCallAlertNotOwner()
    })
    // 監聽到核身話術申請完成
    EventBus.$on('raise-up-limit-finish', () => getIncomingCallAlertNotOwner())

    return {
      recentIncomingCallAlertNotOwnerList,
      currentPageIncomingCallAlertNotOwnerList,
      ...toRefs(state)
    }
  }
})
</script>
