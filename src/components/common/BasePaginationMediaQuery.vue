<template>
	<div class="BasePaginationMediaQuery">
		<!-- 資料總筆數 -->
		<div>
			<p>顯示第 {{ startNo }} 至 {{ endNo }} 項結果，共 {{ totalDataLength }} 項</p>
		</div>

		<el-pagination :page-size="pageDataLength" :pager-count="5" layout="prev, pager, next" :total="totalDataLength"
			class="d-flex justify-center fill-width" prev-text="«" next-text="»" :disabled="disabled"
			@current-change="handleCurrentChange">
		</el-pagination>

	</div>
</template>


<script>
	import { defineComponent } from "@vue/composition-api";

	// 共用元件頁數選擇器
	export default defineComponent({
		name: "BasePaginationMediaQuery",
		props: {
			// 當前頁數
			value: {
				default: 0,
			},
			// 總資料數量
			totalDataLength: {
				default: 0,
			},
			// 每頁資料數量
			pageDataLength: {
				default: 10,
			},
			// 鎖住
			disabled: {
				default: false,
			},
			
		},
		data() {
			return {
				// 顯示起始筆數, 終止筆數
				startNo: 0,
				endNo: 0
			}
		},
		methods: {
			// emit目前頁碼
			handleCurrentChange(val) {
				this.$emit("currentPage", val);
			},

			// 更新顯示區間值
			updateDisplayRange() {
				// 起始區間值
				if (this.totalDataLength == 0) {
					this.startNo = 0;
				} else {
					this.startNo = (this.value - 1) * this.pageDataLength + 1;
				}


				// 結束區間值
				let endCount = this.value * this.pageDataLength;

				// 資料筆數顯示最大值或自身值
				if (endCount > this.totalDataLength) {
					this.endNo = this.totalDataLength;
				} else {
					this.endNo = endCount;
				}
			}

		},
		watch: {
			// 依據頁碼更新資料
			value: {
				handler: function () {
					this.updateDisplayRange();
				},
				immediate: true,
				deep: true
			},
			// 這組資料有時間差, 會導致初使化時更新不到, 故加這組強迫更新
			totalDataLength: {
				handler: function () {
					this.updateDisplayRange();
				},
				immediate: true,
				deep: true
			}
		}

	});
</script>