<template>
	<div>
		<el-dialog :width="dialogWidth" :visible.sync="dataCloseVisible" :close-on-click-modal="false" :close-on-press-escape="false">
			<div class="contentList">
				<div class="title">{{ title }}</div>
				<div class="list">
					<template v-for="item in reasonList">
						<div class="listContent clear" @click="showIconEvt(item)">
							<div class="text fl">{{ item.content }}</div>
							<template v-if="item.list && item.list.length">
								<div class="icon fr"><i class="el-icon-arrow-right"></i></div>
							</template>
							<template v-else>
								<div class="icon fr" v-if="item.active"><i class="el-icon-success"></i></div>
							</template>
						</div>
					</template>
					<div class="operator">
						<a class="returnBtn" v-if="levelList.length > 1" href="javascript:;"
						   @click="returnBackEvt">返回</a>
						<a class="flagBtn" href="javascript:;" @click="completeEvt">标记</a>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import indexApi from '../../api/indexApi'
	import {mapState} from 'vuex'

	export default {
		props: ['listData'],
		name: "unthroughDialog",
		data() {
			return {
				dataCloseVisible: true,
				dialogWidth: '500px',
				showSelectedIcon: false,
				reasonList: [],
				levelList: [],
				title: '标记未通过的原因',
				content: ''
			}
		},
		watch: {
			dataCloseVisible() {
				this.$emit('update:dataVisible', this.dataCloseVisible)
			}
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		mounted() {
			this.getReasonList();
		},
		methods: {
			getReasonList() {
				indexApi.getReason({
					type: "1"
				}).then(d => {
					if (d.code == "0") {
						if (d.data && d.data.list && d.data.list.length) {
							this.reasonList.splice(0);
							this.reasonList = this.reasonList.concat(d.data.list)
							this.levelList.push({
								content: d.data.list,
								title: '标记未通过的原因'
							});

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
				if (data.list && data.list.length) {
					this.reasonList.forEach(item => {
						this.$set(item, 'active', false)
					});
					this.title = data.content;

					this.reasonList.splice(0);
					this.reasonList = this.reasonList.concat(data.list)
					this.levelList.push({
						content: data.list,
						title: data.content
					});
				} else {
					this.reasonList.forEach(item => {
						if (item.id == data.id) {
							this.$set(item, 'active', true)
							this.content = data.content;
						} else {
							this.$set(item, 'active', false)
						}
					})
				}
			},
			returnBackEvt() {
				if (this.levelList.length == 1) {
					this.title = '标记未通过的原因';
					return false
				}
				this.reasonList.splice(0);
				this.reasonList = this.reasonList.concat(this.levelList[this.levelList.length - 2].content)
				this.title = this.levelList[this.levelList.length - 2].title
				this.levelList.splice(this.levelList.length - 1)
			},
			completeEvt() {
				if (this.content == '') {
					this.$showErrorMessage('请选择不通过原因!');
					return false
				}
				indexApi.approveArticle({
					id: this.listData.id,
					userId: this.userInfo.id,
					status: 2,
					content: this.content
				}).then(d => {
					if (d.code == '0') {
						this.$showSuccessMessage('审查不通过!');
						this.$router.push({
							name: 'wallet',
							query: {
								id: 3
							}
						})
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

<style lang="less" scoped>
	.contentList {
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
</style>
