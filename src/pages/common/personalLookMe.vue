<template>
	<div>
		<div class="pageContent fl">
			<div class="pageList clear" v-for="(item, index) in contentList" :key="index">
				<div class="leftImage fl">
					<template v-if="item.imgUrl">
						<img :src="item.imgUrl" alt=""/>
					</template>
					<template v-else>
						<img src="../../assets/images/defaultImg.svg" alt=""/>
					</template>
				</div>
				<div class="leftSub fl" v-if="item.summary">
					<div class="name">{{ item.title }}</div>
					<div class="date">{{ item.summary }}</div>
				</div>
				<div class="leftSub fl" v-else>
					<div class="name noDescription">{{ item.title }}</div>
				</div>
				<div class="rightSub fr">
					<a v-if="item.bothStatus == '0'" @click="cancelFollowEvt(item)" href="javascript:;">已关注</a>
					<a v-if="item.bothStatus == '1'" @click="cancelFollowEvt(item)" href="javascript:;">相互关注</a>
					<a v-if="item.bothStatus == '2'" class="follow" @click="toFollowEvt(item)"
					   href="javascript:;">关注</a>
				</div>
			</div>
		</div>
		<div class="loadingMore fl" v-if="noMoreData" @click="loadMoreEvt">浏览更多<i class="el-icon-arrow-down"></i></div>
	</div>
</template>

<script>
	import Utils from '../../utils/format'
	import indexApi from '../../api/indexApi'
	import {mapState} from 'vuex'

	export default {
		props: ['params'],
		name: "personalLookMe",
		data() {
			return {
				pageMap: {
					pageOn: "1",
					pageSize: 20
				},
				paramsId: '',
				contentList: [],
				noMoreData: false
			}
		},
		filters: {
			formatNumber(val) {
				if (!val) return val;

				if (val < 1000) {
					return val
				} else {
					return ((val + 1000) / 10000).toFixed(1) + '万';
				}
			}
		},
		mounted() {
			if (this.params) {
				this.paramsId = this.params;
				this.getFansList(this.params)
			}
		},
		watch: {
			'params'(newVal) {
				this.paramsId = newVal;
				this.getFansList(newVal)
			}
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		methods: {
			getFansList(data) {
				this.getFansListEvt({
					showUserId: data,
					userId: this.userInfo.id,
					pageSize: this.pageMap.pageSize,
					pageOn: this.pageMap.pageOn
				}, d => {
					if (d.code == '0') {
						if (d.data && d.data.list && d.data.list.length) {
							this.contentList.splice(0)
							this.contentList = this.contentList.concat(d.data.list);

							if (d.data.pages <= d.data.pageNum) {
								this.noMoreData = false;
							} else {
								this.noMoreData = true;
								this.pageMap.pageOn = d.data.pageNum + 1
							}
						}
					} else {
						this.$showErrorMessage(d.reason)
					}
				})
			},
			getFansListEvt(options, callBack) {
				indexApi.fansList(options)
					.then(d => {
						callBack && callBack(d)
					})
					.catch(err => {
						this.$showErrorMessage(err)
					})
			},
			loadMoreEvt() {
				this.getFansListEvt({
					pageOn: this.pageMap.pageOn,
					pageSize: this.pageMap.pageSize,
					showUserId: this.paramsId,
					userId: this.userInfo.id
				}, d => {
					if (d.code == "0") {
						if (d.data && d.data.list && d.data.list.length) {
							this.contentList = this.contentList.concat(d.data.list)
							this.pageMap.pageOn = d.data.pageNum + 1;

							if (d.data.pages <= d.data.pageNum) {
								this.noMoreData = false;
							} else {
								this.noMoreData = true;
								this.pageMap.pageOn = d.data.pageNum + 1
							}
						}
					} else {
						this.$showErrorMessage(d.reason)
					}
				})
			},
			cancelFollowEvt(data) {
				if (!this.userInfo.id) {
					this.$showLoginMessage();
					return false
				}
				indexApi.delFollow({
					type: "0",
					id: data.id,
					userId: this.userInfo.id
				}).then(d => {
					if (d.code == '0') {
						this.$showSuccessMessage('取消关注成功!')
						this.contentList.forEach(item => {
							if (item.id == data.id) {
								this.$set(item, 'bothStatus', '2');
							}
						})
					} else {
						this.$showErrorMessage(d.reason)
					}
				}).catch(err => {
					this.$showErrorMessage(err)
				})
			},
			toFollowEvt(data) {
				if (!this.userInfo.id) {
					this.$showLoginMessage();
					return false
				}
				indexApi.followAdd({
					type: "0",
					id: data.id,
					userId: this.userInfo.id
				}).then(d => {
					if (d.code == '0') {
						this.$showSuccessMessage('关注成功!')
						if (d.data) {
							this.contentList.forEach(item => {
								if (item.id == data.id) {
									this.$set(item, 'bothStatus', d.data.bothStatus);
								}
							})
						}
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
	.pageContent {
		width: 100%;
		background: #fff;
		margin-bottom: 10px;
		.pageList {
			padding: 20px;
			border-bottom: 1px solid #E7E7E7;
			.leftImage {
				width: 40px;
				height: 40px;
				margin-right: 6px;
				img {
					display: block;
					width: 100%;
					height: 100%;
					border-radius: 50%;
					outline: none;
				}
			}
			.leftSub {
				.name {
					line-height: 25px;
					text-align: left;
					color: #4A505A;
					font-size: 13px;
				}
				.noDescription {
					line-height: 40px;
					text-align: left;
					color: #4A505A;
					font-size: 13px;
				}
				.date {
					line-height: 15px;
					text-align: left;
					font-size: 12px;
					color: #C2C4CA;
				}
			}
			.rightSub {
				margin-top: 3px;
				a {
					border: 1px solid #B5B8C1;
					background: #FFFFFF;
					border-radius: 100px;
					display: inline-block;
					font-size: 13px;
					color: #939393;
					width: 85px;
					text-align: center;
					height: 30px;
					cursor: pointer;
					line-height: 32px;
				}
				.follow {
					border: none;
					height: 30px;
					line-height: 30px;
					background: #0686D8;
					border-radius: 100px;
					color: #ffffff;
				}
			}
		}
		.pageList:last-child {
			border-bottom: none;
		}
	}

	.loadingMore {
		width: 100%;
		font-size: 14px;
		line-height: 50px;
		text-align: center;
		background: #fff;
		cursor: pointer;
		color: rgb(86, 112, 192);
	}
</style>
