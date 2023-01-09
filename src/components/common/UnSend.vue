<template>
    <div class="UnSend">

        <button type="button" class="btn btn-success btn-sm mr-1" @click="openDialog('completedDialogActive')">
            <i class="fas fa-check-circle mr-1"></i>
            <span>視訊完成</span>
        </button>
        <button type="button" class="btn btn-danger btn-sm ml-1" @click="openDialog('notCompletedDialogActive')">
            <i class="fas fa-times-circle mr-1"></i>
            <span>視訊未通過/未完成</span>
        </button>

        <!-- 視訊完成 燈箱 -->
        <BaseDialog v-model="completedDialogActive">
            <template slot="header">視訊完成</template>
            <template slot="body">
                <div class="form-check" v-for="(reason, index) in getFuncApplyReasonData.applyY_List"
                    :key="reason.reasonId">
                    <!-- 依據上層PROPS 索引值給予ID, 避免重複 -->
                    <input type="radio" class="form-check-input" v-model="completedReasonIdForm"
                        :value="reason.reasonId" :id="'videoCompleted' + reason.reasonId + '_' + index_props"
                        name="videoCompletedReasonList" />
                    <label class="form-check-label" :for="'videoCompleted' + reason.reasonId + '_' + index_props">
                        {{ index + 1 }}. {{ reason.reason }}
                    </label>
                    <!-- 新增備註欄位 僅選到對應欄位開啟填寫備註 -->
                    <div v-if="reason.textYn === 'Y'" class="input-small">
                        <!-- 操作邏輯與未通過未完成一致: 未選擇時開放編輯, 選擇後鎖定其他選項 -->
                        <input type="text" class="form-control form-control-sm input-add ml-2" placeholder="請填寫備註"
                            autocomplete="off" :id="'videoCompletedNote' + reason.reasonId + '_' + index_props"
                            :disabled="reason.reasonId != completedReasonIdForm && completedReasonIdForm.length != 0 " />
                    </div>
                </div>
            </template>
            <template slot="footer">
                <button type="button" class="btn btn-sm btn-success" @click="resendTelegram('completed')"
                    :disabled=" completedReasonIdForm.length == 0 ">
                    <i class="fas fa-check-circle mr-1"></i>
                    <span>確定</span>
                </button>
                <button type="button" class="btn btn-sm btn-secondary" @click="closeModal('completedDialogActive')">
                    <i class="fas fa-times-circle mr-1"></i>
                    <span>取消</span>
                </button>
            </template>
        </BaseDialog>

        <!-- 未通過 未完成  -->
        <!-- 視訊未完成 燈箱 -->
        <BaseDialog v-model="notCompletedDialogActive">
            <template slot="header">視訊未通過/未完成</template>
            <template slot="body">
                <h6>視訊未完成</h6>
                <div class="form-check d-flex align-items-center flex-wrap"
                    v-for="(reason, index) in getFuncApplyReasonData.applyN_recheckN_Reasons" :key="reason.reasonId">
                    <input type="checkbox" class="form-check-input mb-1 position-top" v-model="notCompletedReasonIdForm"
                        :value="reason.reasonId" :disabled=" failedReasonIdForm.length > 0 "
                        :id="'videoNotCompleted' + reason.reasonId + '_' + index_props" />
                    <label class="form-check-label" :for="'videoNotCompleted' + reason.reasonId + '_' + index_props">
                        {{ index + 1 }}. {{ reason.reason }}
                    </label>
                    <!-- 原因輸入框(暫定) -->
                    <div v-if="reason.textYn === 'Y'" class="input-small">
                        <input :disabled=" failedReasonIdForm.length > 0 " type="text" autocomplete="off"
                            class="form-control form-control-sm input-add ml-2" placeholder="請填寫備註"
                            :id="'videoNotCompletedNote' + reason.reasonId + '_' + index_props" />
                    </div>

                </div>
                <hr />
                <h6>視訊未通過</h6>
                <div class="form-check d-flex align-items-center flex-wrap"
                    v-for="(reason, index) in  getFuncApplyReasonData.applyN_recheckY_Reasons" :key="reason.reasonId">
                    <input type="checkbox" class="form-check-input mb-1 position-top"
                        :disabled="notCompletedReasonIdForm.length > 0" v-model="failedReasonIdForm"
                        :value="reason.reasonId" :id="'videoFailed' + reason.reasonId + '_' + index_props" />
                    <label class="form-check-label" :for="'videoFailed' + reason.reasonId + '_' + index_props">
                        {{ index + 1 }}. {{ reason.reason }}
                    </label>
                    <!-- 原因輸入框(暫定) -->
                    <div v-if="reason.textYn === 'Y'" class="input-small">
                        <input class="form-control form-control-sm input-add ml-2" placeholder="請填寫備註" type="text"
                            autocomplete="off" :disabled="notCompletedReasonIdForm.length > 0"
                            :id="'videoFailedNote' + reason.reasonId + '_' + index_props" />
                    </div>
                </div>
            </template>
            <template slot="footer">
                <button type="button" class="btn btn-sm btn-success" @click="resendTelegram('other')"
                    :disabled="notCompletedReasonIdForm.length == 0 && failedReasonIdForm.length == 0">
                    <i class="fas fa-check-circle mr-1"></i>
                    <span>確定</span>
                </button>
                <button type="button" class="btn btn-sm btn-secondary" :disabled="false" @click="closeModal">
                    <i class="fas fa-times-circle mr-1"></i>
                    <span>取消</span>
                </button>
            </template>
        </BaseDialog>


    </div>
</template>


<script>
    import BaseDialog from '@/components/common/BaseDialog.vue'

    // 人工補送電文, 未送出按鈕
    // PROPS: getFuncApplyReason API資料  
    // EMIT: 使用者所編輯資料
    export default ({
        name: "UnSend",
        components: {
            BaseDialog
        },
        props: {
            getFuncApplyReasonData: {
                type: Object,
                default: () => ({
                    applyN_recheckN_Reasons: [],
                    applyN_recheckY_Reasons: [],
                    applyY_List: []
                })
            },
            index_props: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                // 完成與未完成燈箱開關
                completedDialogActive: false,
                notCompletedDialogActive: false,
                // 視訊完成按鈕disabled
                completedButtonDisabled: false,
                // 視訊未完成按鈕disabled
                notCompletedButtonDisabled: false,

                // 視訊完成原因選擇表單 (單選)
                completedReasonIdForm: '',
                // 視訊未完成原因選擇表單 (多選)
                notCompletedReasonIdForm: [],
                // 視訊未通過原因選擇表單 (多選)
                failedReasonIdForm: [],
            }
        },
        methods: {
            // 開啟燈箱
            openDialog(msg) {
                msg == 'completedDialogActive' ? this.completedDialogActive = true : this.notCompletedDialogActive = true;
            },
            // 關閉燈箱
            closeModal(msg) {
                // 清除已編輯資料
                this.clearData();

                // 關閉燈箱
                msg == 'completedDialogActive' ? this.completedDialogActive = false : this.notCompletedDialogActive = false;
            },

            // 使用者取消編輯, 清除現存資料
            clearData() {
                // 清除已選資料 (動畫結束後再清除)
                setTimeout(() => {
                    this.completedReasonIdForm = '';
                    this.notCompletedReasonIdForm = [];
                    this.failedReasonIdForm = [];

                    // 清除備註框內容 (配合備註欄位換行, 所產生的input box皆有特定class name)
                    let allInput = document.querySelectorAll(".input-add");
                    if (allInput.length > 0) {
                        allInput.forEach(element => {
                            element.value = "";
                        });
                    };
                }, 250);
            },

            // $emit編輯後資料與所編輯INDEX值
            resendTelegram(type) {
                // 備註資料陣列 reasonDataList = [ {id: 1, note: null}, {id: 2, note: "data"} ]; 
                // 更新agent判斷結果: 完成: Y,  未通過未完成:N
                // 更新recheck判斷結果: 未通過: Y,   其餘為N (未完成, 完成)
                let dataArray = [];
                let agentResult = null;
                let recheck = null;

                // 視訊結果更新
                switch (type) {
                    case 'completed':
                        // agent判斷結果更新
                        agentResult = "Y";
                        recheck = "N"
                        // 整理備註資料 (完成僅字串), 找到已選元素, 若有資料則加入
                        let id = 'videoCompletedNote' + this.completedReasonIdForm + "_" + this.index_props;
                        let data = document.getElementById(id);
                        dataArray.push({
                            reasonId: this.completedReasonIdForm,
                            note: data == null ? null : data.value
                        });

                        break;

                    case 'other':
                        // agent判斷結果更新
                        agentResult = "N";

                        // 判斷目前選擇哪類原因
                        let selectedType = this.notCompletedReasonIdForm.length > 0 ? "videoNotCompletedNote" : "videoFailedNote";

                        // 更新recheck判斷結果: 未通過: Y,   未完成為N 
                        this.failedReasonIdForm.length > 0 ? recheck = "Y" : recheck = "N";

                        // 未完成
                        if (this.notCompletedReasonIdForm.length > 0) {
                            this.notCompletedReasonIdForm.forEach(element => {
                                // 找到頁面元素, 與內部資料
                                let id = selectedType + element + "_" + this.index_props
                                let data = document.getElementById(id);
                                dataArray.push({
                                    reasonId: element,
                                    note: data == null ? null : data.value
                                });
                            });
                        } else {
                            // 未通過
                            this.failedReasonIdForm.forEach(element => {
                                let id = selectedType + element + "_" + this.index_props
                                let data = document.getElementById(id);
                                dataArray.push({
                                    reasonId: element,
                                    note: data == null ? null : data.value
                                });
                            });
                        }
                        break;

                    default:
                        break;
                };

                // emit回父層, 回傳: 備註資料, 當前編輯資料INDEX, agentResult, recheck
                this.$emit('resendTelegram', dataArray, this.index_props, agentResult, recheck);

                // 關閉燈箱
                this.completedDialogActive == true ? this.completedDialogActive = false : this.notCompletedDialogActive = false;
            }

        }

    });
</script>

<style scoped>
    /* 覆寫其他來源影響 */
    .form-check-label {
        padding-left: unset;
    }

    /* 備註input框 縮小, 換行 */
    .input-small {
        flex-basis: 100%;
        padding-left: 8px;
    }

    .input-small input {
        width: 200px;
    }

    /* 未通過 未完成 checkbox 置頂 (有換行狀況) */
    .position-top {
        top: 0;
    }
</style>