<template>
	<div class="list">
		<div class="title">我的关注</div>
		<div class="tabList">
			<template v-for="item in targetArray">
				<a href="javascript:;" @click="changeTargetEvt(item)" class="target" :class="{ active : item.isActive }">{{ item.name }}</a>
			</template>
		</div>
		<div class="tabContent" v-loading="loadingContent">
			<template v-for="item in listContent">
				<div class="tabContentList clear">
					<div class="leftImage fl" v-if="type == '0'">
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
						<a v-if="item.bothStatus == '0'" class="hadFollow" @click="cancelFollowEvt(item)"
						   href="javascript:;">已关注</a>
						<a v-if="item.bothStatus == '1'" class="hadFollow" @click="cancelFollowEvt(item)"
						   href="javascript:;">互相关注</a>
						<a v-if="item.bothStatus == '2'" class="follow" @click="toFollowEvt(item)" href="javascript:;">关注</a>
					</div>
				</div>
			</template>
			<div class="pageBox" v-if="listContent.length">
				<el-pagination
						layout="total, prev, pager, next, jumper"
						:total="pageMap.total"
						:page-size="pageMap.pageSize"
						:current-page.sync="pageMap.pageOn"
						@current-change="getAuthorList(pageMap.pageOn, type)">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import indexApi from "../../api/indexApi";
	import {mapState} from 'vuex'

	export default {
		name: "myLook",
		data() {
			return {
				listContent: [],
				pageMap: {
					pageOn: 1,
					pageSize: 10,
					total: 0
				},
				targetArray: [{
					id: '0',
					name: '作者',
					isActive: true,
					type: '0'
				}, {
					id: '1',
					name: '标签',
					isActive: false,
					type: '1'
				}],
				type: '0',
				loadingContent: false
			}
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		mounted() {
			this.getAuthorList(1, this.type);
		},
		methods: {
			cancelFollowEvt(data) {
				let type = this.type;
				indexApi.delFollow({
					type: type,
					id: data.id,
					userId: this.userInfo.id
				}).then(d => {
					if (d.code == '0') {
						this.$showSuccessMessage('取消关注成功!')
						this.listContent.forEach(item => {
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
				let type = this.type;
				indexApi.followAdd({
					type: type,
					id: data.id,
					userId: this.userInfo.id
				}).then(d => {
					if (d.code == '0') {
						this.$showSuccessMessage('关注成功!')
						if (d.data) {
							this.listContent.forEach(item => {
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
			},
			getAuthorList(data, type) {
				this.loadingContent = true
				indexApi.followList({
					type: type,
					showUserId: this.userInfo.id,
					userId: this.userInfo.id,
					pageSize: this.pageMap.pageSize,
					pageOn: data || this.pageMap.pageOn
				}).then(d => {
					this.loadingContent = false
					if (d.code == '0') {
						if (d.data && d.data.list && d.data.list.length) {
							this.listContent.splice(0)
							this.listContent = this.listContent.concat(d.data.list);
						} else {
							this.listContent.splice(0)
						}
						if (d.data) {
							this.pageMap.total = d.data.total
						}
					} else {
						this.$showErrorMessage(d.reason)
					}
				}).catch(err => {
					this.loadingContent = false
					this.$showErrorMessage(err)
				})
			},
			changeTargetEvt(data) {
				this.targetArray.forEach(item => {
					if (item.id == data.id) {
						item.isActive = true;
						this.type = data.type;
						this.pageMap = {
							pageOn: 1,
							pageSize: 10,
							total: 0
						};
						this.getAuthorList(1, data.type);
					} else {
						item.isActive = false;
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.list {
		width: 100%;
		.title {
			width: 100%;
			font-size: 20px;
			color: #4A505A;
			padding-bottom: 20px;
			border-bottom: 1px solid #E7E7E7;
		}
		.tabList {
			padding: 20px 0;
			.target {
				display: inline-block;
				font-size: 14px;
				color: #4A505A;
				text-align: center;
				height: 28px;
				line-height: 28px;
				width: 70px;
				border: 1px solid #4A505A;
				border-radius: 3px;
				margin-right: 20px;
			}
			.target.active {
				background: #3B84D1;
				color: #FFFFFF;
				border: none;
				height: 30px;
				line-height: 30px;
			}
		}
		.tabContent {
			border-top: 1px solid #E7E7E7;
			.tabContentList {
				padding: 15px 0;
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
			.pageBox {
				margin-top: 20px;
				text-align: right;
			}
		}
	}
</style>
