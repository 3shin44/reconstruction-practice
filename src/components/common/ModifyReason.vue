<template>
	<div class="modify-reason">

		<div class="btnContainer">
			<button class="btn btn-outline-secondary" style="margin-right: 5px" @click="addItem">
				<i class="fa-solid fa-plus"></i> 新增
			</button>
			<button class="btn btn-outline-secondary" @click="removeItem">
				<i class="fa-solid fa-trash-can"></i> 刪除
			</button>
		</div>

		<table class="table table-hover table-bordered">
			<thead>
				<tr role="row">
					<th class="middle text-center table-active">
						<input type="checkbox" @change="selectAll" v-model="selectedList">
					</th>
					<th class="middle text-center table-active">ID</th>
					<th class="middle text-center table-active">未完成原因</th>
					<th class="middle text-center table-active">Info360服務代碼</th>
					<th class="middle text-center table-active">排序</th>
					<th class="middle text-center table-active">功能</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(item, index) in funcById_reasonsResultTypeNN">
					<td class="text-center align-middle">
						<input type="checkbox" v-model="funcById_reasonsResultTypeNNSelect" group="reasonsResultTypeNN"
							:value="item.sort">
					</td>
					<td class="text-start align-middle idSn">
						{{ item.sort }}
					</td>
					<td class="text-start align-middle">
						<input class="form-control" type="text" v-model="funcById_reasonsResultTypeNN[index].reason"
							:disabled="funcById_reasonsResultTypeNN[index].lock">
					</td>
					<td class="text-center align-middle">
						<select class="form-select selectSmall" v-model="funcById_reasonsResultTypeNN[index].api"
							:disabled="funcById_reasonsResultTypeNN[index].lock">
							<option value="Y">是</option>
							<option value="N">否</option>
						</select>
					</td>
					<td class="text-center align-middle">
						<select class="form-select selectSmall" v-model="funcById_reasonsResultTypeNN[index].textYN"
							:disabled="funcById_reasonsResultTypeNN[index].lock">
							<option value="Y">是</option>
							<option value="N">否</option>
						</select>
					</td>
					<td class="text-center align-middle">
						<button class="btn btn-outline-secondary" :disabled="funcById_reasonsResultTypeNN[index].lock"
							@click="infoCodeModal(funcById_reasonsResultTypeNN[index])">
							<i class="fa-solid fa-gears"></i>
						</button>
					</td>
					<td class="text-center align-middle">
						<button class="btn btn-outline-secondary up" style="margin-right: 5px"
							@click="moveElement(index, funcById_reasonsResultTypeNN, 'upward')"
							:disabled="funcById_reasonsResultTypeNN[index].lock">
							<i class="fa-solid fa-arrow-up"></i>
						</button>
						<button class="btn btn-outline-secondary down"
							@click="moveElement(index, funcById_reasonsResultTypeNN, 'downward')"
							:disabled="funcById_reasonsResultTypeNN[index].lock">
							<i class="fa-solid fa-arrow-down"></i>
						</button>
					</td>
					<td class="text-center align-middle">
						<button class="editButton" @click="editableSwitch('funcById_reasonsResultTypeNN', index)">
							<i class="fa-solid fa-pen"></i>
						</button>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- info360 服務代碼 -->
		<!-- 完成原因 info360 服務代碼 modal -->
		<div class="modal fade" id="infoCode" tabindex="-1" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="exampleModalLabel">服務代碼</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<v-jstree :data="infoCodeData" :collapse="treeCollapse" @item-click="selectInfoCode"
							show-checkbox multiple allow-batch whole-row>
						</v-jstree>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" @click="updateInfoCode(currentItem)">
							<i class="fa-solid fa-check"></i> 確認
						</button>
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
							<i class="fa-solid fa-xmark"></i> 取消
						</button>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import BaseDialog from '@/components/common/BaseDialog.vue'

	export default ({
		name: "ModifyReason",
		components: {
			BaseDialog
		},
		// 需傳入資料: 原始陣列 (須包含lock key)
		// reasonType
		props: {
			soruceData: {
				type: Array,
				default: () => []
			},
			reasonType: {
				type: object,
				default: {
					notPass: "Y"
				}
			}
		},
		data() {
			return {
				//	已選清單
				selectedList: []

			}
		},
		methods: {
			// 新增
			addItem() {
				this.soruceData.push({
					"skey": null,
					"reasonId": null,
					"reason": null,
					"resultType": "",
					"api": "Y",
					"textYN": "N",
					"notPass": this.reasonType.notPass,
					"dataId": "",
					"sort": this.soruceData.length + 1
				});
			},
			// 刪除
			removeItem() { },

			// 全選全不選
			// 完成原因 項目全選/全不選
			selectAll() {
				if (this.completeSelectAll_status) {
					this.funcById_reasonsResultTypeYNSelect = [];
					// 資料陣列中所有sort值加入選擇陣列
					this.funcById_reasonsResultTypeYN.forEach(element => {
						this.funcById_reasonsResultTypeYNSelect.push(element.sort)
					});
				} else {
					// dis select all
					this.funcById_reasonsResultTypeYNSelect = [];
				}
			},
		},
		mounted(){
			
		}

	});
</script>

<style scoped>

</style>