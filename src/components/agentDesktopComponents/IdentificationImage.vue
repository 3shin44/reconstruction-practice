<template>
  <!-- 證件影像 -->
  <div class="card mb-3">
    <div class="card-header">{{ speakTip.speakTitle }}</div>
    <div class="card-body">
      <div class="row">
        <div class="col-9">
          <div
            class="tab-content text-center"
            id="identificationImageTabContent"
          >
            <div v-if="!identificationImageTabs[0].identificationImageSrc && !identificationImageTabs[1].identificationImageSrc && !identificationImageTabs[2].identificationImageSrc">
              <span style="font-size: 20px">無證件影像</span>
            </div>
            <div
              v-for="tabContent in identificationImageTabs"
              :key="tabContent.tabKey"
              class="tab-pane fade active show"
              :id="tabContent.tabKey"
              role="tabpanel"
              aria-labelledby="v-pills-messages-tab"
            >
              <transition name="fade">
                <div v-show="tabContent.active">
                  <div style="text-align: left">
                    <!-- speakContent 內容為HTML格式 -->
                    <!-- photoTime 為時間 -->
                    <!-- 修正為 replace {Date}字串 , 取代為影像時間 -->
                    <span
                      v-html="speakTip.speakContent.replace('{Date}', tabContent.photoTime).replace(/\n/g, '<br />')""
                    ></span>
                  </div>
                  <img
                    v-if="tabContent.identificationImageSrc"
                    :src="tabContent.identificationImageSrc"
                    width="400"
                    :alt="tabContent.tabTitle"
                  />
                  <span v-else style="font-size: 20px">查無此圖檔</span>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <div class="col-3">
          <div
            class="nav flex-column nav-pills"
            id="v-pills-tab"
            role="tablist"
            aria-orientation="vertical"
          >
            <button
              v-for="tab in identificationImageTabs"
              :key="tab.tabKey"
              class="nav-link"
              :class="tab.active ? 'active' : ''"
              :id="'tabTitle' + tab.tabKey"
              data-toggle="pill"
              :href="'#' + tab.tabKey"
              role="tab"
              aria-controls="v-pills-home"
              aria-selected="true"
              :disabled="!tab.identificationImageSrc"
              :style="tab.identificationImageSrc ? 'color :blue' : 'color :grey'"
              style="text-align:left"
              @click.prevent="switchTab(tab.tabKey)"
            >
              {{ tab.tabTitle }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import logger from '../../util/loggerUtil'
import api from '../../api'
import {defineComponent, onMounted, reactive, toRefs} from '@vue/composition-api'
// 證件影像
export default defineComponent({
  name: 'IdentificationImage',
  components: {},
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
    const state = reactive({
      // 頁籤標題固定 預設顯示第0筆
      identificationImageTabs: [
        {
          tabTitle: '身分證正面',
          tabKey: 'IdentityCardFront',
          identificationImageSrc: '',
          photoTime: '',
          active:false

        },
        {
          tabTitle: '身分證反面',
          tabKey: 'IdentityCardReverseSide',
          identificationImageSrc: '',
          photoTime: '',
          active: false

        },
        {
          tabTitle: '第二證件正面',
          tabKey: 'FrontOfSecondDocument',
          identificationImageSrc: '',
          photoTime: '',
          active: false
        }
      ]
    })
    // 載入
    onMounted(() => {
      getIdentificationImage()
    })

    /**
     * 取得證件照片
     */
    const getIdentificationImage = async () => {
      try {
        const getPhotoForApplycaaResponse = await api.getPhotoForApplycaa({
          action: props.queryData.action,
          custId: props.queryData.custId
        })
        // 身份證 正面
        if (Array.isArray(getPhotoForApplycaaResponse.IDC1)) {
          // 第1個是圖片路徑
          state.identificationImageTabs[0].identificationImageSrc =
            getPhotoForApplycaaResponse.IDC1[0] || ''
          // 影像時間
          state.identificationImageTabs[0].photoTime =
            getPhotoForApplycaaResponse.IDC1[1] || ''
          // 有照片時才active
          if(getPhotoForApplycaaResponse.IDC1[0]) {
            state.identificationImageTabs[0].active = true;
          }
        }

        // 身份證 反面
        if (Array.isArray(getPhotoForApplycaaResponse.IDC2)) {
          // 第1個是圖片路徑
          state.identificationImageTabs[1].identificationImageSrc =
            getPhotoForApplycaaResponse.IDC2[0] || ''
          // 影像時間
          state.identificationImageTabs[1].photoTime =
            getPhotoForApplycaaResponse.IDC2[1] || ''
        }

        // 第二證件 正面
        if (Array.isArray(getPhotoForApplycaaResponse.SIDC1)) {
          // 第1個是圖片路徑
          state.identificationImageTabs[2].identificationImageSrc =
            getPhotoForApplycaaResponse.SIDC1[0] || ''
          // 影像時間
          state.identificationImageTabs[2].photoTime =
            getPhotoForApplycaaResponse.SIDC1[1] || ''
        }
      } catch (error) {
        logger.error('func getIdentificationImage error', error)
      }
    }

    /**
     * 切換頁籤
     * @param { string } 切換頁籤的key
     */
    const switchTab = (switchTabKey) => {
      state.identificationImageTabs = state.identificationImageTabs.map(
        (tab) => {
          console.log(tab)
          tab.active = tab.tabKey === switchTabKey
          return tab
        }
      )
    }
    return {
      ...toRefs(state),
      switchTab
    }
  }
})
</script>
<style lang="scss" scoped>
.fade-leave-active {
  display: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
