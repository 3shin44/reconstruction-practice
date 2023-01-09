<template>
    <div id="vueapp">
        <!-- 篩選條件輸入 -->
        <div class="querySelectors">
            <div class="queryItem d-flex justify-content-center align-items-center">
                <p>進線時間</p>
                <div class="inputBox">
                    <vue-datepicker-local v-model="range" range-separator="~" format="YYYY/MM/DD"
                        :disabled-date="maxOneYear">
                    </vue-datepicker-local>
                </div>
            </div>

            <div class="queryItem d-flex justify-content-center align-items-center">
                <p>服務項目</p>
                <div class="inputBox">
                    <select class="form-select" v-model="funcId" @change="getFuncHisDropdownOptions">
                        <option value="">請選擇</option>
                        <option v-for="item in allFuncData" :value="item.funcId">{{ item.funcName }} ({{ item.desc }})
                        </option>
                    </select>
                </div>
            </div>

            <div class="queryItem d-flex justify-content-center align-items-center">
                <p>視訊結果</p>
                <div class="inputBox">
                    <select class="form-select" v-model="resultType" :disabled="optionLock">
                        <option value="">請選擇</option>
                        <option v-for="item in resultTypeOptions" :value="item">{{ item }}</option>
                    </select>
                </div>
            </div>

            <div class="queryItem d-flex justify-content-center align-items-center">
                <p>處理人員</p>
                <div class="inputBox">
                    <select class="form-select" v-model="muser" :disabled="optionLock">
                        <option value="">請選擇</option>
                        <option v-for="item in muserOptions" :value="item">{{ item }}</option>
                    </select>
                </div>
            </div>

            <div class="queryItem d-flex justify-content-center align-items-center">
                <p>電文狀態</p>
                <div class="inputBox">
                    <select class="form-select" v-model="applyStatus" :disabled="optionLock">
                        <option value="">請選擇</option>
                        <option v-for="item in applyStatusOptions" :value="item">{{ item }}</option>
                    </select>
                </div>
            </div>

            <div class="queryItem queryBtn d-flex v-application v-application--is-ltr">
                <button
                    class="v-btn v-btn--depressed v-btn--flat v-btn--outlined theme--light v-size--small success--text"
                    type="button" @click="mediaQuery">
                    <span class="v-btn__content">
                        <i aria-hidden="true" class="v-icon notranslate fas fa-search theme--light"
                            style="font-size: 16px;"></i> 查詢
                    </span>
                </button>
                <button type="button"
                    class="ml-2 v-btn v-btn--depressed v-btn--flat v-btn--outlined theme--light v-size--small"><span
                        class="v-btn__content" @click="resetQuery">
                        <i aria-hidden="true" class="v-icon notranslate fas fa-trash-alt theme--light"
                            style="font-size: 16px;"></i> 清除
                    </span>
                </button>
            </div>

            <!-- 查詢結果表格 -->
            <div class="w-100">
                <div class="table-overflow">
                    <table class="table table-hover table-bordered min-width-last-column">
                        <thead>
                            <tr>
                                <th class="table-active" v-for="item in tableHead">{{ item }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- 無資料提示 -->
                            <tr v-if="funcHisData.length == 0">
                                <td colspan="13" class="text-center">(查無資料)</td>
                            </tr>

                            <!-- 資料顯示 -->
                            <tr v-else v-for="(item, index) in funcHisData_display">
                                <td>{{ item.loginTime || '---' }}</td>
                                <td>{{ item.funcName || '---' }}</td>
                                <td>{{ item.custId || '---' }}</td>
                                <td>{{ item.activeTime || '---' }}</td>
                                <td>{{ item.resultType || '---' }}</td>
                                <td>{{ item.reason || '---' }}</td>
                                <td>{{ item.agents || '---' }}</td>
                                <td>{{ item.applyStatus || '---' }}</td>
                                <td>{{ item.exceptionMSG || '---' }}</td>
                                <td>
                                    <!-- 電文未送出,  -->
                                    <div v-if=" item.applyStatus  == '未送出' ">
                                        <UnSend :getFuncApplyReasonData="UnSendReason" :index_props="index"
                                            @resendTelegram="resendTelegram" />
                                    </div>

                                    <!-- 補送成功 -->
                                    <div v-else-if=" item.applyStatus  == '補送成功' " class="mediaBtn">
                                        <button class="btn btn-resend btn-sm mr-1"
                                            @click="sendAgain(index)">重新補送</button>
                                    </div>

                                    <!-- 其他狀態 -->
                                    <div v-else>
                                        <p>---</p>
                                    </div>
                                </td>
                                <td>
                                    <!-- 顯示文字換成處理過NOTE字串, title綁原始資料 -->
                                    <!-- 備註欄位為主管編輯結果, 修改時間與人員皆為主管 -->
                                    <div class="notePreview align-middle" data-bs-tooltip="tooltip"
                                        data-bs-placement="left" :title="item.resendDescript">
                                        {{ item.displayResendDescript || '---' }}
                                    </div>
                                    <button class="btn btn-outline-secondary align-middle"
                                        @click="openNoteModal(index)">
                                        <i class="fa-solid fa-pen"></i>
                                    </button>
                                </td>
                                <td>{{ item.resendMDate || '---' }}</td>
                                <td>{{ item.resendMuser || '---' }}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>


            <!-- 頁碼與資料筆數 -->
            <div class="w-100">
                <BasePaginationMediaQuery :totalDataLength="funcHisData.length" :value="funcHisData_pageNo"
                    @currentPage="funcHisDataRefresh" />
            </div>

        </div>


        <!-- 備註 MODAL -->
        <div class="modal fade" id="noteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">備註</h5>
                    </div>
                    <div class="modal-body">
                        <textarea class="form-control areaContent areaContent-large area-TopBorder"
                            v-model="currentNote"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" data-bs-dismiss="modal" class="btn btn-primary" @click="saveNote">
                            <i class="fa-solid fa-check"></i> 儲存
                        </button>
                        <button type="button" data-bs-dismiss="modal" class="btn btn-secondary" @click="closeNoteModal">
                            <i class="fa-solid fa-xmark"></i> 取消
                        </button>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>


<script>
    import logger from '../util/loggerUtil'
    import functionUtil from '../util/functionUtil'
    import api from '../api'
    import BasePaginationMediaQuery from '@/components/common/BasePaginationMediaQuery.vue'
    import BaseDialog from '@/components/common/BaseDialog.vue'
    import { Modal } from 'bootstrap'
    import { Tooltip } from 'bootstrap'
    import VueDatepickerLocal from 'vue-datepicker-local'

    // unsend組件為資料查詢後才渲染，需使用 Async Components (Import vue components dynamically)
    export default {
        name: 'MediaQuery',
        components: {
            BasePaginationMediaQuery,
            VueDatepickerLocal,
            BaseDialog,
            'UnSend': () => import("@/components/common/UnSend.vue")
        },
        data() {
            return {
                // 網址傳入資料
                queryData: null,

                tableHead: ['進線時間', '服務項目', '身份證', '視訊結果時間', '視訊結果', '視訊結果原因', '視訊結果處理人員', '電文狀態', '電文失敗原因', '功能', '備註', '最後修改時間', '最後處理人員'],

                // 服務項目
                allFuncData: null,

                // 篩選選項: 
                // 時間範圍, 進線服務, 申請結果
                // 處理人員, 電文狀態
                range: [],
                maxDate: new Date(),
                // 預設不選擇
                funcId: "",

                // 視訊結果, 處理人員, 電文狀態 顯示資料, lock為服務項目API取得資料後解鎖
                optionLock: false,
                applyStatusOptions: [],
                muserOptions: [],
                resultTypeOptions: [],

                // 視訊結果, 處理人員, 電文狀態 選擇結果
                applyStatus: "",
                muser: "",
                resultType: "",

                // 視訊結果代碼轉換
                resultCode: {
                    "Y": "視訊完成",
                    "N": "視訊未完成、視訊未通過"
                },

                // 完整歷史紀錄查詢結果,  顯示用陣列
                funcHisData: [],
                funcHisData_display: [],
                funcHisData_pageNo: 1,


                // BS彈窗物件
                noteModalObj: null,

                // 電文狀態原因
                UnSendReason: null,

                // 備註視窗使用變數, 指向當前編輯物件
                currentItem: null,
                currentNote: null,
            }
        },
        methods: {
            // datePicker時間重置
            resetDate() {
                // datePicker: 時間範圍為 當日前三個月~當日
                let today = new Date();
                let prevMonth = today.setMonth((today.getMonth() - 3));
                this.range = [new Date(prevMonth), new Date()];
            },

            // 清除查詢條件
            resetQuery() {
                // 重置時間, 服務項目重置, 清除後續三項
                this.resetDate();
                this.funcId = "",
                    this.clearOptions();
                // 顯示資料重置
                this.funcHisData = [];
                this.funcHisData_display = [];
                this.funcHisData_pageNo = 1;

                // this.optionLock = true;
            },


            // 補送電文查詢
            mediaQuery(e, defaultPageNo = 1) {
                // 必要查詢欄位檢查&提示
                if (this.funcId == "") {
                    window.alert("請選擇欲查詢的服務項目");
                    return;
                };

                // 取得服務的歷史紀錄 (所選時間格式轉換)
                let startTime = functionUtil.dateToYYYYMMDD(this.range[0], "-");
                let endTime = functionUtil.dateToYYYYMMDD(this.range[1], "-");
                (async () => {
                    try {
                        const getFuncHisRes = await api.getFuncHis({
                            loginStartTime: startTime,
                            loginEndTime: endTime,
                            funcId: this.funcId,
                            resultType: this.resultType,
                            mUser: this.muser,
                            applyStatus: this.applyStatus
                        });

                        // 檢查回傳結果, 有誤提示訊息並中斷後續執行
                        if (functionUtil.apiResponseError(getFuncHisRes)) {
                            return;
                        };

                        // 接收資料, 更新顯示資料
                        this.funcHisData = getFuncHisRes.funcHis;

                        // 空資料不執行後續更新
                        if (this.funcHisData.length == 0) {
                            return;
                        };

                        // 增加顯示用備註文字, 預覽備註僅顯示30字
                        this.funcHisData = this.addDisplayNoteText(this.funcHisData);

                        this.funcHisDataRefresh(defaultPageNo);
                    }
                    catch (error) {
                        console.log(error);
                    }
                })();


                // 獲取電文狀態原因
                (async () => {
                    try {
                        let res = await api.getFuncApplyReason({
                            funcId: this.funcId
                        });

                        this.UnSendReason = res;

                    } catch (error) {
                        console.log(error);
                    }
                })();

            },

            // 依據頁碼更新顯示資料
            funcHisDataRefresh(pageNo) {
                this.funcHisData_pageNo = pageNo;
                this.funcHisData_display = functionUtil.refreshTable(this.funcHisData, this.funcHisData_display, pageNo, 10);

                // BS tooltip 外觀更新, 等待資料更新完畢 才執行
                this.$nextTick(() => {
                    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip"]'));

                    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                        return new Tooltip(tooltipTriggerEl)
                    });
                });
            },

            // 清除頁面已選查詢選項
            clearOptions() {
                this.applyStatus = "";
                this.muser = "";
                this.resultType = "";
                this.applyStatusOptions = [];
                this.muserOptions = [];
                this.resultTypeOptions = [];

                // 選項鎖
                // this.optionLock = true;
            },

            // 取得資料
            getFuncHisDropdownOptions() {
                // 清除現存資料
                this.clearOptions();

                // 未選則不呼叫API
                if (this.funcId == "") {
                    return
                };

                // 取得歷史紀錄
                (async () => {
                    try {
                        const getFuncHisDropdownOptionsRes = await api.getFuncHisDropdownOptions({
                            funcId: this.funcId
                        });

                        // 檢查回傳結果, 有誤提示訊息並中斷後續執行
                        if (functionUtil.apiResponseError(getFuncHisDropdownOptionsRes)) {
                            return;
                        };

                        //   接收資料
                        this.applyStatusOptions = getFuncHisDropdownOptionsRes.options.applyStatusOptions;
                        this.muserOptions = getFuncHisDropdownOptionsRes.options.muserOptions;
                        this.resultTypeOptions = getFuncHisDropdownOptionsRes.options.resultTypeOptions;

                        // 後續選項開放選擇
                        // this.optionLock = false;
                    }
                    catch (error) {
                        console.log(error);
                    }
                })();
            },


            // 增加顯示用備註文字
            addDisplayNoteText(array, noteKey = 'resendDescript', displayNoteKey = 'displayResendDescript', limit = 30) {

                // 字數檢查, 保留30字並於結尾添加"..."
                function charsCheck(inputString = "") {
                    if (inputString.length > limit) {
                        let newString = inputString.slice(0, limit);
                        newString += "...";
                        return newString;
                    } else {
                        return inputString;
                    }
                };
                // 新增顯示KEY值與資料
                array.forEach(element => {
                    element[displayNoteKey] = charsCheck(element[noteKey]);
                });
                // 回傳整理過資料
                return array;
            },

            // 補送電文: 使用者編輯後資料回傳後端, data: 使用者編輯資料, index: 所編輯索引值, agentResult: agent判斷結果, recheck: Y:申請原因為非本人，反之N
            resendTelegram(data, index, agentResult, recheck) {
                // 目前編輯物件索引值: index + (頁碼-1)*10
                let currentIndex = parseInt(index) + (this.funcHisData_pageNo - 1) * 10;

                // 目前編輯物件
                let currentItem = this.funcHisData[currentIndex];

                // 補送電文 API
                (async () => {
                    try {
                        let res = await api.resendRaiseupLimit({
                            agentResult: agentResult,
                            action: this.queryData.action,
                            // callId來源為 getFuncHis
                            callId: currentItem.callId,
                            reasonDataList: data,
                            recheck: recheck,
                            agentName: this.queryData.agentName
                        });

                        // 清除現存資料 等待更新
                        this.funcHisData = [];
                        this.funcHisData_display = [];

                        // 成功後重新獲取資料列表，並跳轉至當先前編輯頁數
                        this.mediaQuery(null, this.funcHisData_pageNo);

                    } catch (error) {
                        console.log(error);
                    }
                })();

            },

            // 重新補送 (補送成功再次送出)
            sendAgain(index) {
                // 目前編輯物件索引值: index + (頁碼-1)*10
                let currentIndex = parseInt(index) + (this.funcHisData_pageNo - 1) * 10;
                // 更新目前編輯資料
                this.currentItem = this.funcHisData[currentIndex];

                // 呼叫API
                (async () => {
                    try {
                        let res = await api.updateFailedDataForResend({
                            "skey": this.currentItem.skey
                        });


                        // 檢查回傳結果, 有誤提示訊息並中斷後續執行
                        if (functionUtil.apiResponseError(res)) {
                            return;
                        };

                        // 清除目前指向資料
                        this.closeNoteModal();

                        // 成功後重新獲取資料列表，並跳轉至當先前編輯頁數
                        this.mediaQuery(null, this.funcHisData_pageNo);


                    } catch (error) {
                        console.log(error);
                    }
                })();



            },

            // 開啟備註MODAL
            openNoteModal(index) {
                // 目前編輯物件索引值: index + (頁碼-1)*10
                let currentIndex = parseInt(index) + (this.funcHisData_pageNo - 1) * 10;
                // 更新目前編輯資料
                this.currentItem = this.funcHisData[currentIndex];
                // 更新目前編輯視窗內文
                this.currentNote = this.funcHisData[currentIndex].resendDescript;

                // 開啟MODAL
                this.noteModalObj.show();
            },

            // 儲存已編輯資料
            saveNote() {
                // 呼叫API
                (async () => {
                    try {
                        let res = await api.updateFuncHisToResendData({
                            skey: this.currentItem.skey,
                            resendDescript: this.currentNote,
                            resendMuser: this.queryData.agentId || ""
                        });


                        // 檢查回傳結果, 有誤提示訊息並中斷後續執行
                        if (functionUtil.apiResponseError(res)) {
                            return;
                        };


                        // 清除目前指向資料
                        this.closeNoteModal();

                        // 成功後重新獲取資料列表，並跳轉至當先前編輯頁數
                        this.mediaQuery(null, this.funcHisData_pageNo);

                    } catch (error) {
                        console.log(error);
                    }
                })();
            },

            // 關閉備註MODAL
            closeNoteModal() {
                // 取消目前編輯對象
                this.currentItem = null;
                this.currentNote = null;
            },

            // 檢測時間大於一年 禁止選擇
            maxOneYear(time) {
                let today = new Date();
                return time > this.maxDate ;
            },
            // 使用者更新起始日期 更新最大期限與 迄日期
            updateMaxDate() {
                this.maxDate = new Date(this.range[0]);
                this.maxDate.setDate(this.range[0].getDate() + 365);
                let today = new Date();

                // 預設迄期為最大期限
                if (this.range[1] > this.maxDate ) {
                    this.range[1] = new Date(this.maxDate);
                }
            }
        },
        created() {
            // 獲取網址資料 送入的query (allQuery後全小寫)
            let allQuery = functionUtil.getQueryStringObj()
            this.queryData = {
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
            };

            // 初始化 datePicker
            this.resetDate();

            // 取得所有服務
            (async () => {
                try {
                    const getAllFuncRes = await api.getAllFunc({
                        isCancel: "N"
                    });

                    // 檢查回傳結果, 有誤提示訊息並中斷後續執行
                    if (functionUtil.apiResponseError(getAllFuncRes)) {
                        return;
                    };

                    this.allFuncData = getAllFuncRes.funcMains;

                }
                catch (error) {
                    console.log(error);
                }
            })();


        },
        mounted() {
            // 獲取BS MODAL物件 (並設定關閉僅能以"取消"關閉, 與AGD操作行為一致)
            this.noteModalObj = new Modal(document.getElementById('noteModal'), { backdrop: 'static', keyboard: false });
        },
        watch: {
            range: {
                handler: function () {
                    this.updateMaxDate();
                },
                deep: true
            }
        }

    }
</script>


<style scoped>
    @import '../assets/scss/director_common.css';


    /* textarea 獨立 */
    .areaContent {
        border-radius: 0 0 .2rem .2rem;
        border: 1px solid #ced4da;
        border-top: unset;
        resize: none;
    }

    .areaContent-large {
        height: 13rem;
    }

    .area-TopBorder {
        border: 1px solid #ced4da;
    }

    .btn-resend {
        font-size: 14px;
        background-color: hwb(119 36% 28%);
        color: #fff;
    }

    .btn-resend:hover {
        background-color: hwb(119 36% 35%);
        color: #fff;
    }
</style>