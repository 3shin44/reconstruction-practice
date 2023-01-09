<template>
  <div>
    <div v-for="speakTip in speakTipsList" :key="speakTip.tipSkey">
      <component :is="speakTip.speakComponent" :speak-tip="speakTip" :identity-list="identityList"
        :query-data="queryData" />
    </div>
    <!-- 無服務資料時 -->
    <div v-if="isNoService" class="all-center" style="font-size: 30px">
      <h2 style="line-height: calc(100vh - 1rem)">此服務不存在</h2>
    </div>
  </div>
</template>
<script>
  import { onMounted, reactive, toRefs } from '@vue/composition-api'
  import agentDesktopComponents from '../components/agentDesktopComponents'
  import { setAPIDefaultHeaders } from '../api/builder'
  import functionUtil from '../util/functionUtil'
  import api from '../api'
  import logger from '../util/loggerUtil'

  export default {
    name: 'Home',
    components: {
      ...agentDesktopComponents
    },
    setup() {
      // 狀態
      const state = reactive({
        speakTipsList: [],
        identityList: [],
        isNoService: false,
        // url參數 初始為null
        queryData: null
      })
      // 載入
      onMounted(() => {
        // 送入的query (allQuery後全小寫)
        let allQuery = functionUtil.getQueryStringObj()
        state.queryData = {
          funcId: allQuery.serviceno || '',
          callId: allQuery.callid || '',
          custId: allQuery.custid || '',
          action: allQuery.action || '',
          custName: allQuery.custname || '',
          dn: allQuery.dn || '',
          agentId: allQuery.agentid || '',
          agentName: allQuery.agentname || "",
          applyNo: allQuery.applyno || '',
          channel: allQuery.channel || '',
          accno_out: allQuery.accno_out || '',
          email: allQuery.email || '',
          ixnId: allQuery.ixnid || '',
          contactId: allQuery.contactid || '',
          mobilePhoneNumber: allQuery.mobilephonenumber || '',
          tenantId: allQuery.tenantid || '',
          userId: allQuery.userid || '',
        }
        logger.debug('url parameter', state.queryData)
        // 表頭加入
        setAPIDefaultHeaders('custid', state.queryData.custId)
        setAPIDefaultHeaders('callID', state.queryData.callId)
        setAPIDefaultHeaders('funcid', state.queryData.funcId)
        // 主頁功能
        reloadGetSpeakTips()


        // 新增進線相關資料到歷史紀錄, 後端若回覆錯誤則提示相關訊息
        insertCallDataToFuncHisData()


      })
      /**
       * 查詢 主頁面功能
       * @returns {Promise<void>} 查詢結束
       */
      const reloadGetSpeakTips = async () => {
        try {
          const { speakTipsList, identityList } = await api.getSpeakTips({
            funcId: state.queryData.funcId
          })
          state.speakTipsList = speakTipsList || []
          state.identityList = identityList || []
          // 排序
          const sortList = (list, sortField) => {
            return list.sort((a, b) =>
              Number(a[sortField]) > Number(b[sortField]) ? 1 : -1
            )
          }
          state.speakTipsList = sortList(state.speakTipsList, 'speakSort')
          state.identityList = sortList(state.identityList, 'identitySort')
        } catch (error) {
          logger.error('func reloadGetSpeakTips error', error)
        } finally {
          // 沒有服務
          if (state.speakTipsList.length === 0) {
            state.isNoService = true
          }
        }
      }

      /**
      * 新增進線相關資料到歷史紀錄
      */
      const insertCallDataToFuncHisData = async () => {
        try {

          let res = await api.insertCallDataToFuncHis({
            custId: state.queryData.custId,
            funcId: state.queryData.funcId,
            actionType: state.queryData.action,
            callId: state.queryData.callId,
            channel: state.queryData.channel,
            mobilePhoneNumber: state.queryData.mobilePhoneNumber,
            custName: state.queryData.custName,
            email: state.queryData.email,
            accno_out: state.queryData.accno_out,
            userId: state.queryData.userId,
            applyNo: state.queryData.applyNo,
          });

          // 後端資料錯誤提示
          if (res.returnCode != '0000') {
            window.alert(res.returnMsg);
          }

        } catch (error) {
          console.log(error);
        }
      }


      return {
        ...toRefs(state)
      }
    }
  }
</script>