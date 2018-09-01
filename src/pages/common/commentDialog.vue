<template>
	<div>
		<el-dialog custom-class="dialogStyle" :width="dialogWidth" :visible.sync="dataCloseVisible" :close-on-click-modal="false" :close-on-press-escape="false">
			<div class="nacTabs clear">
				<div class="navList fl" @click="navListEvt('vote')" :class="{ active: leftType == 'vote' }">投票</div>
				<div class="navList fr" @click="navListEvt('investe')" :class="{ active: leftType == 'investe' }">助力
				</div>
			</div>
			<div class="navContent">
				<div class="contentList" v-if="leftType == 'vote'">
					<div class="column clear">
						<template v-for="item in countList">
							<div v-if="item.isDisabled" @click="countListEvt(item)" :class="{ active: item.isSelected }"
							     class="list fl">{{ item.value }}票
							</div>
							<div v-else class="list fl isDisabled">{{ item.value }}票</div>
						</template>
						<div class="list fl" :class="{ active: showTotalCount }" @click="loadMoreTicket">更多</div>
					</div>
					<div class="totalSlider clear" v-if="showTotalCount">
						<div class="firstText">{{ firstCount }}</div>
						<el-slider class="slider" v-model="totalCount" :min="firstCount" :max="totalList.vote"></el-slider>
						<div class="endText">{{ totalList.vote }}</div>
					</div>
					<div class="totalCount">剩余知票: {{ totalList.vote }}</div>
					<!--<div class="tips">(投票可以增加文章权重，使其获得更高的排名)</div>-->
					<div class="submitBox">
						<a href="javascript:;" class="submitBtn" @click="submitCountEvt">投票{{ countText }}</a>
					</div>
				</div>
				<div class="contentList" v-if="leftType == 'investe'">
					<div class="column clear">
						<template v-for="item in costList">
							<div v-if="item.isDisabled" @click="costListEvt(item)" :class="{ active: item.isSelected }"
							     class="list fl">{{ item.value }}
							</div>
							<div v-else class="list fl isDisabled">{{ item.value }}</div>
						</template>
						<div class="list fl" :class="{ active: showTotalCost }" @click="loadMoreCost">更多</div>
					</div>
					<div class="totalSlider clear" v-if="showTotalCost">
						<div class="firstText">{{ firstCost }}</div>
						<el-slider class="slider" v-model="totalCost" :min="firstCost" :max="totalList.bill"></el-slider>
						<div class="endText">{{ totalList.bill }}</div>
					</div>
					<div class="totalCount">剩余知力: {{ totalList.bill }}</div>
					<!--<div class="tips">(助力可以大幅度影响文章权重，与作者分享增值收益)</div>-->
					<div class="submitBox">
						<a href="javascript:;" class="submitBtn" @click="submitCostEvt">助力{{ costText }}</a>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import indexApi from '../../api/indexApi'

	export default {
		name: "commentDialog",
		props: ['typeData'],
		data() {
			return {
				leftType: '',
				totalList: {
					bill: 0,
					vote: 0
				},
				dataCloseVisible: true,
				dialogWidth: '400px',
				totalCount: 1,
				firstCount: 1,
				showTotalCount: false,
				showTotalCost: false,
				totalCost: 1,
				firstCost: 1,
				countText: '',
				costText: '',
				costList: [{
					value: 1,
					isDisabled: true,
					isSelected: false
				}, {
					value: 5,
					isDisabled: true,
					isSelected: false
				}, {
					value: 10,
					isDisabled: true,
					isSelected: false
				}, {
					value: 15,
					isDisabled: true,
					isSelected: false
				}, {
					value: 20,
					isDisabled: true,
					isSelected: false
				}, {
					value: 50,
					isDisabled: true,
					isSelected: false
				}, {
					value: 100,
					isDisabled: true,
					isSelected: false
				}],
				countList: [{
					value: 1,
					isDisabled: true,
					isSelected: false
				}, {
					value: 2,
					isDisabled: true,
					isSelected: false
				}, {
					value: 3,
					isDisabled: true,
					isSelected: false
				}, {
					value: 4,
					isDisabled: true,
					isSelected: false
				}, {
					value: 5,
					isDisabled: true,
					isSelected: false
				}, {
					value: 10,
					isDisabled: true,
					isSelected: false
				}, {
					value: 20,
					isDisabled: true,
					isSelected: false
				}]
			}
		},
		created() {
			/* 获取知票知力 */
			indexApi.accountList({
				userId: this.typeData.userId
			}).then(d => {
				if (d.code == '0') {
					if (d.data) {
						this.totalList.bill = d.data.bill - 0;
						this.totalList.vote = d.data.vote - 0;
					}
				} else {
					this.$showErrorMessage(d.reason)
				}
			}).catch(err => {
				this.$showErrorMessage(err)
			})
		},
		mounted() {
			this.leftType = this.typeData.type;

			//初始化是否可以点击
			this.countList.forEach(item => {
				if (item.value > this.typeData.vote) {
					item.isDisabled = false
				}
			});

			this.costList.forEach(item => {
				if (parseInt(item.value) > parseInt(this.typeData.bill)) {
					item.isDisabled = false
				}
			});
		},
		watch: {
			dataCloseVisible() {
				this.$emit('update:dataVisible', this.dataCloseVisible)
			},
			totalCount() {
				this.countText = (': ' + this.totalCount + '票');
			},
			totalCost() {
				this.costText = (': ' + this.totalCost);
			}
		},
		methods: {
			costListEvt(data) {
				this.showTotalCost = false;
				this.costText = (': ' + data.value);
				this.costList.forEach(item => {
					if (item.value == data.value) {
						item.isSelected = true;
					} else {
						item.isSelected = false;
					}
				})
			},
			countListEvt(data) {
				this.showTotalCount = false;
				this.countText = (': ' + data.value + '票');
				this.countList.forEach(item => {
					if (item.value == data.value) {
						item.isSelected = true;
					} else {
						item.isSelected = false;
					}
				})
			},
			navListEvt(flag) {
				if (flag == 'vote') {
					this.leftType = 'vote'
				} else {
					this.leftType = 'investe'
				}
			},
			loadMoreTicket() {
				this.showTotalCount = true;
				this.countText = (': ' + this.totalCount + '票');
				this.countList.forEach(item => {
					item.isSelected = false;
				})
			},
			loadMoreCost() {
				this.showTotalCost = true;
				this.costText = (': ' + this.totalCost);
				this.costList.forEach(item => {
					item.isSelected = false;
				})
			},
			submitCountEvt() {
				let params = {
					articleId: this.typeData.articleId,
					userId: this.typeData.userId
				};
				let filterData = this.countList.filter(item => {
					return item.isSelected == true
				});

				if (filterData.length > 0) {
					params = Object.assign({}, params, {
						ticketNum: filterData[0].value
					})
				} else {
					params = Object.assign({}, params, {
						ticketNum: this.totalCount
					})
				}

				indexApi.articleVote(params).then(d => {
					if (d.code == '0') {
						if (d.data) {
							this.$showSuccessMessage('投票成功!');
							this.$emit('updateVote', d.data);
							this.dataCloseVisible = false;
						}
					} else {
						this.$showErrorMessage(d.reason);
					}
				}).catch(err => {
					this.$showErrorMessage(err);
				})
			},
			submitCostEvt() {
				let params = {
					articleId: this.typeData.articleId,
					userId: this.typeData.userId
				};
				let filterData = this.costList.filter(item => {
					return item.isSelected == true
				});
				if (filterData.length > 0) {
					params = Object.assign({}, params, {
						investment: filterData[0].value
					})
				} else {
					params = Object.assign({}, params, {
						investment: this.totalCost
					})
				}

				indexApi.articleInvest(params).then(d => {
					if (d.code == '0') {
						if (d.data) {
							this.$showSuccessMessage('助力成功!');
							this.$emit('updateBill', d.data);
							this.dataCloseVisible = false;
						}
					} else {
						this.$showErrorMessage(d.reason);
					}
				}).catch(err => {
					this.$showErrorMessage(err);
				})
			}
		}
	}
</script>
<style>
	.dialogStyle .el-dialog__body {
		padding: 10px 20px 20px 20px;
	}
</style>
<style lang="less" scoped>
	.nacTabs {
		padding: 0 90px;
		.navList {
			font-size: 18px;
			color: #939393;
			padding-bottom: 5px;
			cursor: pointer;
		}
		.active {
			color: #4A505A;
			border-bottom: 2px solid #0686D8;
		}
	}

	.navContent {
		padding: 30px 0 0 0;
		.column {
			width: 100%;
			.list {
				width: 80px;
				line-height: 36px;
				text-align: center;
				background: #F8F7F7;
				margin: 0 12px 12px 0;
				border-radius: 2px;
				cursor: pointer;
			}
			.list:nth-child(4n) {
				margin-right: 0;
			}
			.isDisabled {
				background: #B5B8C1;
				color: #ffffff;
			}
			.active {
				background: #0686D8;
				color: #ffffff;
			}
		}
		.totalCount {
			line-height: 30px;
			font-size: 14px;
			color: #0686D8;
		}
		.totalSlider {
			display: flex;
			display: -webkit-flex;
			.slider {
				flex: 1;
			}
			.firstText {
				height: 38px;
				line-height: 38px;
				padding-right: 15px;
			}
			.endText {
				height: 38px;
				line-height: 38px;
				padding-left: 15px;
			}
		}
		.tips{
			line-height: 20px;
			margin-bottom: 20px;
		}
		.submitBox {
			width: 100%;
			.submitBtn {
				background: #0686D8;
				border-radius: 30px;
				display: block;
				line-height: 30px;
				font-size: 16px;
				color: #FFFFFF;
				text-align: center;
			}
		}
	}
</style>
