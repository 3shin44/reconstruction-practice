<template>
	<div>
		<!-- 核身話術 -->
		<div class="card mb-3">
			<div class="card-header">{{ speakTip.speakTitle }}</div>
			<div class="card-body">
				<div class="row">
					<div class="col-12">
						<p v-html="speakTip.speakContent.replace(/\n/g, '<br />')"></p>
						<table class="table table-hover table-bordered table-sm table-auth">
							<thead>
								<tr>
									<th class="table-active" colspan="2" style="min-width: 90px">
										核對項目
									</th>
									<th class="table-active">詢問句</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, index) in identityList" :key="item.identityId">
									<td>{{ index + 1 }}</td>
									<td v-html="item.identityTitle"></td>
									<td class="text-practice" v-html="item.identityContent"></td>
								</tr>
							</tbody>
						</table>
						<button type="button" class="btn btn-success btn-sm mr-1"
							@click="openDialog('completedDialogActive')" :disabled="
                applyStatusAndReasonDisabled ||
                completedButtonDisabled ||
                hasBeenSent
              ">
							<i class="fas fa-check-circle mr-1"></i>
							<span>視訊完成</span>
						</button>
						<button type="button" class="btn btn-danger btn-sm ml-1" :disabled="
                applyStatusAndReasonDisabled ||
                notCompletedButtonDisabled ||
                hasBeenSent
              " @click="openDialog('notCompletedDialogActive')">
							<i class="fas fa-times-circle mr-1"></i>
							<span>視訊未通過/未完成</span>
						</button>
					</div>
				</div>
				<div style="color:red;" v-if="originApplyStatusAndReason.resultType">該通進線已送出過視訊結果</div>
			</div>
		</div>
		<!-- 視訊完成 燈箱 -->
		<BaseDialog v-model="completedDialogActive">
			<template slot="header">視訊完成</template>
			<template slot="body">
				<div class="form-check" v-for="(reason, index) in completedReasonList" :key="reason.reasonId">
					<input type="radio" :disabled="
              originApplyStatusAndReason.applyStatus === 'N' || hasBeenSent
            " class="form-check-input" v-model="completedReasonIdForm" :value="reason.reasonId"
						:id="'videoCompleted' + reason.reasonId" name="videoCompletedReasonList" />
					<label class="form-check-label" :for="'videoCompleted' + reason.reasonId">
						{{ index + 1 }}. {{ reason.reason }}
					</label>
					<!-- 新增備註欄位 僅選到對應欄位開啟填寫備註 -->
					<div v-if="reason.textYn === 'Y'" class="input-small">
						<!-- 操作邏輯與未通過未完成一致: 未選擇時開放編輯, 選擇後鎖定其他選項 -->
						<input type="text" class="form-control form-control-sm input-add ml-2" placeholder="請填寫備註"
							autocomplete="off" :id="'videoCompletedNote' + reason.reasonId"
							:disabled="reason.reasonId != completedReasonIdForm && completedReasonIdForm.length != 0 " />
					</div>
				</div>
			</template>
			<template slot="footer">
				<button type="button" class="btn btn-sm btn-success"
					:disabled="sendDisabled || completedReasonIdForm.length === 0"
					@click="sendIdentityVerificationSentence('completed')">
					<i class="fas fa-check-circle mr-1"></i>
					<span>確定</span>
				</button>
				<button type="button" class="btn btn-sm btn-secondary" :disabled="sendDisabled" @click="
            isApplyFailed
              ? (checkCloseApplyDialogActive = true)
              : (completedDialogActive = false)
          ">
					<i class="fas fa-times-circle mr-1"></i>
					<span>取消</span>
				</button>
			</template>
		</BaseDialog>
		<!-- 視訊未完成 燈箱 -->
		<BaseDialog v-model="notCompletedDialogActive">
			<template slot="header">視訊未通過/未完成</template>
			<template slot="body">
				<h6>視訊未完成</h6>
				<div class="form-check d-flex align-items-center flex-wrap"
					v-for="(reason, index) in notCompletedReasonList" :key="reason.reasonId">
					<input :disabled="notCompletedReasonIdFormDisabled || hasBeenSent" type="checkbox"
						class="form-check-input mb-1 position-top" v-model="notCompletedReasonIdForm"
						:value="reason.reasonId" :id="'videoNotCompleted' + reason.reasonId" />
					<label class="form-check-label" :for="'videoNotCompleted' + reason.reasonId">
						{{ index + 1 }}. {{ reason.reason }}
					</label>
					<!-- 原因輸入框(暫定) -->
					<div v-if="reason.textYn === 'Y'" class="input-small">
						<input :disabled="notCompletedReasonIdFormDisabled || hasBeenSent" type="text"
							autocomplete="off" class="form-control form-control-sm input-add ml-2" placeholder="請填寫備註"
							:id="'videoNotCompletedNote' + reason.reasonId" />
					</div>

				</div>
				<hr />
				<h6>視訊未通過</h6>
				<div class="form-check d-flex align-items-center flex-wrap" v-for="(reason, index) in failedReasonList"
					:key="reason.reasonId">
					<input :disabled="failedReasonIdFormDisabled || hasBeenSent" type="checkbox"
						class="form-check-input mb-1 position-top" v-model="failedReasonIdForm" :value="reason.reasonId"
						:id="'videoFailed' + reason.reasonId" />
					<label class="form-check-label" :for="'videoFailed' + reason.reasonId">
						{{ index + 1 }}. {{ reason.reason }}
					</label>
					<!-- 原因輸入框(暫定) -->
					<div v-if="reason.textYn === 'Y'" class="input-small">
						<input class="form-control form-control-sm input-add ml-2" placeholder="請填寫備註"
							:id="'videoFailedNote' + reason.reasonId" type="text"
							:disabled="failedReasonIdFormDisabled || hasBeenSent" autocomplete="off" />
					</div>
				</div>
			</template>
			<template slot="footer">
				<button type="button" class="btn btn-sm btn-success"
					@click="sendIdentityVerificationSentence('notCompletedOrFailed')" :disabled="
            sendDisabled ||
            (notCompletedReasonIdForm.length === 0 &&
              failedReasonIdForm.length === 0)
          ">
					<i class="fas fa-check-circle mr-1"></i>
					<span>確定</span>
				</button>
				<button type="button" class="btn btn-sm btn-secondary" :disabled="sendDisabled" @click="
            isApplyFailed
              ? (checkCloseApplyDialogActive = true)
              : (notCompletedDialogActive = false)
          ">
					<i class="fas fa-times-circle mr-1"></i>
					<span>取消</span>
				</button>
			</template>
		</BaseDialog>
		<!-- 關閉確認 燈箱 -->
		<BaseDialog v-model="checkCloseApplyDialogActive">
			<template slot="header">視訊結果取消</template>
			<template slot="body">
				<h6 style="padding-bottom: 40px">本次視訊結果已加入批次排程補送</h6>
			</template>
			<template slot="footer">
				<button type="button" class="btn btn-sm btn-success" @click="confirmCheckCloseApplyDialog()">
					<i class="fas fa-check-circle mr-1"></i>
					<span>確定</span>
				</button>
				<button type="button" class="btn btn-sm btn-secondary" @click="checkCloseApplyDialogActive = false">
					<i class="fas fa-times-circle mr-1"></i>
					<span>取消</span>
				</button>
			</template>
		</BaseDialog>
	</div>
</template>
<script>
	import { computed, defineComponent, onMounted, reactive, toRefs } from '@vue/composition-api'
	import BaseDialog from '../common/BaseDialog.vue'
	import api from '../../api'
	import logger from '../../util/loggerUtil'
	import toastr from 'toastr'
	import EventBus from '../../event/EventBus'
	// 核身話術
	export default defineComponent({
		name: 'IdentityVerificationSentence',
		components: { BaseDialog },
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
			identityList: {
				default: []
			},
			queryData: {
				default: {}
			}
		},
		setup(props) {
			const state = reactive({
				// 完成與未完成燈箱開關
				completedDialogActive: false,
				notCompletedDialogActive: false,
				// 查詢申請結果原始資料
				originApplyStatusAndReason: {
					applyStatus: null,
					resultType: null,
					reasonIdList: null
				},
				// 視訊完成按鈕disabled
				completedButtonDisabled: false,
				// 視訊未完成按鈕disabled
				notCompletedButtonDisabled: false,
				// 完成原因
				completedReasonList: [],
				// 未完成原因
				notCompletedReasonList: [],
				// 未通過原因
				failedReasonList: [],
				// 視訊完成原因選擇表單 (單選)
				completedReasonIdForm: '',
				// 視訊未完成原因選擇表單 (多選)
				notCompletedReasonIdForm: [],
				// 視訊未通過原因選擇表單 (多選)
				failedReasonIdForm: [],
				//
				applyStatusAndReasonDisabled: false,
				checkCloseApplyDialogActive: false,
				// 正在送出申請 完成/未完成/未通過
				sendDisabled: false,
				// 已經送出
				hasBeenSent: false,
				// 完成/未完成/未通過 呼叫失敗
				isApplyFailed: false
			})

			/**
			 * 載入 完成與未完成原因列表
			 * @returns {Promise<void>} 查詢結束
			 */
			const reloadGetFuncApplyReasonList = async () => {
				try {
					const {
						applyY_List,
						applyN_recheckN_Reasons,
						applyN_recheckY_Reasons
					} = await api.getFuncApplyReason({
						funcId: props.queryData.funcId
					})
					// 完成
					state.completedReasonList = applyY_List || []
					// 視訊未通過
					state.failedReasonList = applyN_recheckY_Reasons || []
					// 視訊未完成
					state.notCompletedReasonList = applyN_recheckN_Reasons || []
				} catch (error) {
					logger.error('func getFuncApplyReasonList error', error)
				}
			}

			// 視訊未通過表單checkbox disabled
			const failedReasonIdFormDisabled = computed(() => {
				return (
					// 上次有申請過
					state.originApplyStatusAndReason.applyStatus === 'N' ||
					// 已選擇視訊未完成
					state.notCompletedReasonIdForm.length > 0
				)
			})

			// 視訊未完成表單checkbox disabled
			const notCompletedReasonIdFormDisabled = computed(
				() =>
					// 上次有申請過
					state.originApplyStatusAndReason.applyStatus === 'N' ||
					state.failedReasonIdForm.length > 0
			)

			/**
			 * 設置 上次的完成與未完成原因(燈箱內表單)
			 */
			const setCompletedAndNotCompletedForm = () => {
				// 若 上次填寫成功代表正常 不做事
				state.completedReasonIdForm = ''
				state.notCompletedReasonIdForm = []
				state.failedReasonIdForm = []

				// 清除備註框內容 (配合備註欄位換行, 所產生的input box皆有特定class name)
				let allInput = document.querySelectorAll(".input-add");
				// 找到所有input 清除值
				if (allInput.length > 0) {
					allInput.forEach(element => {
						element.value = "";
					});
				};

				// 上次為成功
				if (state.originApplyStatusAndReason.applyStatus === 'Y') return
				// 上次失敗 且選擇完成
				if (state.originApplyStatusAndReason.resultType === 'Y') {
					// 加入上次完成原因
					if (Array.isArray(state.originApplyStatusAndReason.reasonIdList)) {
						state.completedReasonIdForm =
							state.originApplyStatusAndReason.reasonIdList[0] || ''
					}
				} else {
					// 上次失敗 且為未完成或未通過
					// 加入上次未完成
					state.notCompletedReasonIdForm = (
						state.originApplyStatusAndReason.reasonIdList || []
					).filter((reasonId) =>
						// 過濾上次有選但表單內沒有的
						state.notCompletedReasonList.find(
							(reasonItem) => Number(reasonItem.reasonId) === Number(reasonId)
						)
					)
					// 加入上次未通過原因
					state.failedReasonIdForm = (
						state.originApplyStatusAndReason.reasonIdList || []
					).filter((reasonId) =>
						// 過濾上次有選但表單內沒有的
						state.failedReasonList.find(
							(reasonItem) => Number(reasonItem.reasonId) === Number(reasonId)
						)
					)
				}
			}

			/**
			 * 開啟 完成與未完成燈箱
			 * @param {type} 'completedDialogActive' | 'notCompletedDialogActive'
			 */
			const openDialog = (type) => {
				state[type] = true
				setCompletedAndNotCompletedForm()
			}

			/**
			 * 查詢 上次申請完成與未完成結果
			 * @returns {Promise<void>} 查詢結束
			 */
			const reloadApplyStatusAndReason = async () => {
				try {
					state.completedButtonDisabled = false
					state.notCompletedButtonDisabled = false
					state.applyStatusAndReasonDisabled = true
					state.originApplyStatusAndReason = await api.getApplyStatusAndReason({
						callId: props.queryData.callId,
						funcId: props.queryData.funcId
					})
					// 有送出過同一通callId不應該可以再重新送出
					if (state.originApplyStatusAndReason.resultType) {
						state.notCompletedButtonDisabled = true
						state.completedButtonDisabled = true
					}
				} catch (error) {
					logger.error('func reloadApplyStatusAndReason error', error)
					state.completedButtonDisabled = false
					state.notCompletedButtonDisabled = false
				} finally {
					state.applyStatusAndReasonDisabled = false
				}
			}

			/**
			 * 送出 視訊完成/視訊未通過/視訊未完成
			 * @param {'completed' | 'notCompletedOrFailed'} status 申請狀態
			 * @returns {Promise<void>} 送出結束
			 */
			const sendIdentityVerificationSentence = async (status) => {
				let messageTag =
					status === 'completed' ? '視訊完成' : '視訊未完成'
				try {
					await reloadApplyStatusAndReason()
					if (state.originApplyStatusAndReason.resultType) {

						state.completedDialogActive = false
						state.notCompletedDialogActive = false
						throw new Error("該通進線已送出過視訊結果")
					}
					// 原因列表 包含 視訊完成 / 視訊未通過 / 未完成

					// 20221012: 使用情境更動為需要新增備註，所以回傳資料須變更為 
					// (範例) reasonDataList = [ {id: 1, note: null}, {id: 2, note: "data"} ]; 

					function joinNote(selected_Id_List, targetId = '', type = '') {
						let dataArray = [];
						switch (type) {
							case 'completed':
								// 完成僅字串, 
								let id = targetId + selected_Id_List;
								// 找到已選元素, 若有資料則加入
								let data = document.getElementById(id);
								dataArray.push({
									reasonId: selected_Id_List,
									note: data == null ? null : data.value
								});

								break;

							case 'other':
								selected_Id_List.forEach(element => {
									// 找到頁面元素, 與內部資料
									let id = targetId + element;
									let data = document.getElementById(id);
									dataArray.push({
										reasonId: element,
										note: data == null ? null : data.value
									});
								});
								break;

							default:
								return
								break;
						}

						return dataArray;
					};
					// 回傳改為reasonDataList
					let reasonDataList = [];

					let reasonIdList = []
					if (status === 'completed') {
						// 完成
						reasonIdList = [state.completedReasonIdForm]

						reasonDataList = joinNote(state.completedReasonIdForm, 'videoCompletedNote', 'completed');
					} else {
						// 認定未完成或是未通過
						// 用是否有選擇來判段 主要是因為畫面只能擇1
						if (state.notCompletedReasonIdForm.length > 0) {
							reasonIdList = state.notCompletedReasonIdForm

							// 改傳reasonDataList
							reasonDataList = joinNote(state.notCompletedReasonIdForm, 'videoNotCompletedNote', 'other');
						} else {
							reasonIdList = state.failedReasonIdForm

							reasonDataList = joinNote(state.failedReasonIdForm, 'videoFailedNote', 'other');
						}
					}
					let recheck = 'N'
					// 用全部原因去找 recheck
					// recheck 當前原因取得 有任一有就為Y
					const findReasonHaveRecheck = [
						...state.completedReasonList,
						...state.notCompletedReasonList,
						...state.failedReasonList
					]
						.filter(({ reasonId }) => reasonIdList.includes(reasonId))
						.find(({ recheck }) => recheck === 'Y')
					if (findReasonHaveRecheck) {
						recheck = 'Y'
						messageTag = '視訊未通過'
					}
					// 選擇結果
					let agentResult = status === 'completed' ? 'Y' : 'N'
					const param = {
						custId: props.queryData.custId,
						custName: props.queryData.custName,
						funcId: props.queryData.funcId,
						agentResult,
						action: props.queryData.action,
						callId: props.queryData.callId,
						agentId: props.queryData.agentId,
						agentName: props.queryData.dn + '(' + props.queryData.agentName + ')',
						applyNo: props.queryData.applyNo,
						channel: props.queryData.channel,
						recheck,
						// 改為送出 reasonDataList
						reasonDataList: reasonDataList,
						// reasonDataList: JSON.stringify(reasonDataList),
						accno_out: props.queryData.accno_out,
						email: props.queryData.email,
						mobilePhoneNumber: props.queryData.mobilePhoneNumber,
						userId: props.queryData.userId,
					}
					state.sendDisabled = true
					const { returnCode, returnMsg } = await api.raiseupLimit(param)
					state.hasBeenSent = true
					// 回寫混查
					const findReason = [
						...state.completedReasonList,
						...state.notCompletedReasonList,
						...state.failedReasonList
					]
						.filter(({ reasonId }) => reasonIdList.includes(reasonId))
					let prefix = "";
					let commentReason = "";
					findReason.forEach((item) => {
						commentReason += prefix + item.reason
						prefix = "、"
					})
					const paramCaseComment = {
						ixnID: props.queryData.ixnId,
						contactID: props.queryData.contactId,
						comment: "【系統結果】 " + messageTag + "：" + commentReason,
						status: 3,
						mediaType: 2,
						source: props.queryData.agentId,
						agentID: props.queryData.agentId,
						tenantID: props.queryData.tenantId,
					}
					let caseCommentResult;
					let caseCommentSuccess = "歷史資料寫入成功！";
					let caseCommentFail = "歷史資料寫入失敗！";
					const { data } = await api.replyComment(paramCaseComment)
					if (data) {
						let resultData = JSON.parse(data)
						caseCommentResult = resultData.returnCode === "00000";
					} else {
						caseCommentResult = false;
					}
					caseCommentResult ? toastr.success(caseCommentSuccess) : toastr.error(caseCommentFail);
					// 傳遞event 完成申請
					EventBus.$emit('raise-up-limit-finish')
					if (returnCode !== '0000') {
						throw new Error(returnMsg)
					}
					// 成功
					toastr.success('送出成功！', messageTag)
					// 成功後 關閉燈箱
					state.completedDialogActive = false
					state.notCompletedDialogActive = false
				} catch (error) {
					toastr.error(`送出失敗！</br>錯誤訊息：${error.message}`, messageTag)
					state.isApplyFailed = true
					logger.error('func sendIdentityVerificationSentence error', error)
				} finally {

					state.sendDisabled = false
				}
			}
			// 點選確認視訊結果取消燈箱
			const confirmCheckCloseApplyDialog = () => {
				state.checkCloseApplyDialogActive = false
				state.completedDialogActive = false
				state.notCompletedDialogActive = false
				toastr.success('視訊完成')
			}

			// 載入
			onMounted(async () => {
				// 查詢上次結果
				await reloadApplyStatusAndReason()
				// 查詢原因列表(燈箱使用)
				await reloadGetFuncApplyReasonList()
			})

			return {
				...toRefs(state),
				failedReasonIdFormDisabled,
				notCompletedReasonIdFormDisabled,
				sendIdentityVerificationSentence,
				confirmCheckCloseApplyDialog,
				openDialog
			}
		}
	})
</script>


<style scoped>
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