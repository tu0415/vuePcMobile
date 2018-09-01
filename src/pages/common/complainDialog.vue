<template>
	<div>
		<el-dialog :width="dialogWidth" :visible.sync="dataCloseVisible" :close-on-click-modal="false" :close-on-press-escape="false">
			<div class="hardContent" v-if="showHardContent">
				<div class="title">举报</div>
				<div class="list">
					<template v-for="item in reasonList">
						<div class="listContent clear" @click="showIconEvt(item)">
							<div class="text fl">{{ item.content }}</div>
							<div class="icon fr" v-if="item.active"><i class="el-icon-success"></i></div>
						</div>
					</template>
					<div class="listContent clear" @click="showtextContentEvt">
						<div class="text fl">我有话要说</div>
						<div class="icon fr"><i class="el-icon-arrow-right"></i></div>
					</div>
				</div>
				<div class="operator">
					<a class="flagBtn" href="javascript:;" @click="completeEvt">完成</a>
				</div>
			</div>
			<div class="textContent" v-if="showTextContent">
				<div class="title">我有话要说</div>
				<div class="list">
					<el-input type="textarea" v-model="textArea"></el-input>
				</div>
				<div class="operator">
					<a class="returnBtn" href="javascript:;" @click="returnBackEvt">返回</a>
					<a class="flagBtn" href="javascript:;" @click="completeEvt">完成</a>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import indexApi from '../../api/indexApi'

	export default {
		name: "complainDialog",
		props: ['complainData'],
		data() {
			return {
				dataCloseVisible: true,
				dialogWidth: '500px',
				reasonList: [],
				showHardContent: true,
				showTextContent: false,
				textArea: ''
			}
		},
		mounted() {
			this.getReasonList();
		},
		watch: {
			dataCloseVisible() {
				this.$emit('update:dataVisible', this.dataCloseVisible)
			}
		},
		methods: {
			getReasonList() {
				indexApi.getReason({
					type: this.complainData.reportType
				}).then(d => {
					if (d.code == "0") {
						if (d.data && d.data.list && d.data.list.length) {
							this.reasonList.splice(0);
							this.reasonList = this.reasonList.concat(d.data.list)

							this.reasonList.forEach(item => {
								this.$set(item, 'active', false)
							})
						}
					} else {
						this.$showErrorMessage(d.reason)
					}
				}).catch(err => {
					this.$showErrorMessage(err)
				})
			},
			showIconEvt(data) {
				this.reasonList.forEach(item => {
					if (item.id == data.id) {
						this.$set(item, 'active', true)
					} else {
						this.$set(item, 'active', false)
					}
				})
			},
			showtextContentEvt() {
				this.showHardContent = false
				this.showTextContent = true
			},
			returnBackEvt() {
				this.showTextContent = false
				this.showHardContent = true
			},
			completeEvt() {
				let selectedList = this.reasonList.filter(item => {
					return item.active == true
				});
				let reason = (selectedList.map(item => {
					return item.content
				}))

				if ((reason.length + this.textArea.length) == 0) {
					this.$showErrorMessage('请输入举报内容!');
					return false
				}

				if (this.textArea.length > 0) {
					reason.push(this.textArea)
				}

				indexApi.getComplain({
					type: this.complainData.type,
					mid: this.complainData.mid,
					reportId: this.complainData.reportId,
					content: reason.join(',')
				}).then(d => {
					if (d.code == "0") {
						this.$showSuccessMessage('举报成功!');
						this.dataCloseVisible = false
					} else {
						this.$showErrorMessage(d.reason)
					}
				}).catch(err => {
					this.$showErrorMessage(err)
				})
			}
		}
	}
</script>

<style>
	.textContent textarea {
		width: 100%;
		height: 115px;
		resize: none;
		font-size: 14px;
	}
</style>
<style lang="less" scoped>
	.hardContent {
		padding: 0 30px;
		.title {
			width: 100%;
			text-align: center;
			line-height: 30px;
			font-size: 24px;
			color: #4A505A;
		}
		.list {
			margin-top: 30px;
			.listContent {
				line-height: 30px;
				padding: 8px 0;
				border-bottom: 1px solid #E7E7E7;
				cursor: pointer;
			}
		}
		.operator {
			width: 100%;
			margin-top: 20px;
			text-align: center;
			.returnBtn {
				line-height: 28px;
				display: inline-block;
				padding: 0 20px;
				font-size: 16px;
				background: #ffffff;
				border: 1px solid #4A505A;
				color: #000000;
				margin-right: 15px;
			}
			.flagBtn {
				line-height: 30px;
				display: inline-block;
				padding: 0 20px;
				font-size: 16px;
				background: #0686D8;
				color: #ffffff;
			}
		}
	}

	.textContent {
		padding: 0 30px;
		.title {
			width: 100%;
			text-align: center;
			line-height: 30px;
			font-size: 24px;
			color: #4A505A;
		}
		.list {
			margin-top: 30px;
			.textArea {
				height: 165px;
				width: 100%;
				background: #F8F8F8;
				border: 1px solid #E7E7E7;
				resize: none;
				font-size: 16px;
				color: #4A505A;
			}
		}
		.operator {
			width: 100%;
			margin-top: 20px;
			text-align: center;
			.returnBtn {
				line-height: 28px;
				display: inline-block;
				padding: 0 20px;
				font-size: 16px;
				background: #ffffff;
				border: 1px solid #4A505A;
				color: #000000;
				margin-right: 15px;
			}
			.flagBtn {
				line-height: 30px;
				display: inline-block;
				padding: 0 20px;
				font-size: 16px;
				background: #0686D8;
				color: #ffffff;
			}
		}
	}
</style>
