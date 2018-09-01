<template>
	<div class="index clear">
		<div class="leftContent fl">
			<div class="pageInfo clear" v-if="type == 1">
				<img class="image fl" src="../assets/images/userName.svg" alt=""/>
				<div class="userName fl">{{ memberList.nickname }}的文章</div>
				<template v-if="memberList.isFollow == '0'">
					<a href="javascript:;" class="follow fr" @click="toFollowEvt">关注</a>
				</template>
				<template v-if="memberList.isFollow == '1'">
					<a href="javascript:;" class="look fr" @click="cancelFollowEvt">已关注</a>
				</template>
				<template v-if="memberList.isFollow == '3'">
					<a href="javascript:;" class="look fr" @click="cancelFollowEvt">相互关注</a>
				</template>
			</div>
			<div class="pageInfo clear" v-if="type == 2">
				<div class="userName" v-if="memberList.isFollow == null">我关注的人</div>
				<div class="userName" v-else>他关注的人</div>
			</div>
			<div class="pageInfo clear" v-if="type == 3">
				<div class="userName" v-if="memberList.isFollow == null">关注我的人</div>
				<div class="userName" v-else>关注他的人</div>
			</div>
			<personalArticle v-if="type == 1" :params.sync="paramsId"></personalArticle>
			<personalToLook v-if="type == 2" :params.sync="paramsId"></personalToLook>
			<personalLookMe v-if="type == 3" :params.sync="paramsId"></personalLookMe>
		</div>
		<div class="rightContent fr">
			<div class="pageData">
				<div class="logo">
					<img class="userLogo" v-if="memberList.picture" :src="memberList.picture" alt=""/>
					<img class="userLogo" v-else src="../assets/images/defaultImg.svg" alt=""/>
					<div class="userName">{{ memberList.nickname }}</div>
					<div class="summary">{{ memberList.summary }}</div>
				</div>
				<div class="list clear">
					<div class="listContent fl">
						<div class="name" v-if="memberList.isFollow == null">我的文章数</div>
						<div class="name" v-else>他的文章数</div>
						<div class="number" @click="changeListEvt('1')">{{ memberList.articleTotal }}</div>
					</div>
					<div class="listContent fl">
						<div class="name" v-if="memberList.isFollow == null">我关注的人</div>
						<div class="name" v-else>他关注的人</div>
						<div class="number" @click="changeListEvt('2')">{{ memberList.followTotal }}</div>
					</div>
					<div class="listContent fl">
						<div class="name" v-if="memberList.isFollow == null">关注我的人</div>
						<div class="name" v-else>关注他的人</div>
						<div class="number" @click="changeListEvt('3')">{{ memberList.fansTotal }}</div>
					</div>
				</div>
				<div class="total clear">
					<div class="listContent fl">
						<div class="name">{{ memberList.voteTotal }}</div>
						<div class="number">获得的投票</div>
					</div>
					<div class="listContent fl">
						<div class="name">{{ memberList.investTotal | formatCost }}</div>
						<div class="number">获得的知力</div>
					</div>
					<div class="listContent fl">
						<div class="name">{{ memberList.rewardTotal | formatCost }}</div>
						<div class="number">获得的助力</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import sideBar from '../components/sideBar.vue'
	import personalArticle from './common/personalArticle'
	import personalToLook from './common/personalToLook'
	import personalLookMe from './common/personalLookMe'
	import indexApi from '../api/indexApi'
	import {mapState} from 'vuex'

	export default {
		name: "index",
		data() {
			return {
				paramsId: '',
				memberList: {},
				type: 1
			}
		},
		mounted() {
			if (this.$route.query.id) {
				this.paramsId = this.$route.query.id
				this.getMemberInfo(this.$route.query.id);
			} else {
				this.$showErrorMessage('查询参数有误!')
			}
		},
		watch: {
			'$route'(to, from) {
				if (this.$route.query.id) {
					this.paramsId = this.$route.query.id
					this.getMemberInfo(this.$route.query.id);
				} else {
					this.$showErrorMessage('查询参数有误!')
				}
			}
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		methods: {
			getMemberInfo(data) {
				if (data) {
					indexApi.getMember({
						authorId: data,
						userId: data == this.userInfo.id ? '' : this.userInfo.id
					}).then(d => {
						if (d.code == '0') {
							if (d.data) {
								this.memberList = Object.assign({}, d.data);
							}
						} else {
							this.$showErrorMessage(d.reason)
						}
					}).catch(err => {
						this.$showErrorMessage(err)
					})
				} else {
					this.$showErrorMessage('查询参数有误!')
				}
			},
			toFollowEvt() {
				if (!this.userInfo.id) {
					this.$showLoginMessage();
					return false
				}
				indexApi.followAdd({
					type: "0",
					id: this.paramsId,
					userId: this.userInfo.id
				}).then(d => {
					if (d.code == '0') {
						this.$showSuccessMessage('关注成功!')
						this.memberList.isFollow = '1';
					} else {
						this.$showErrorMessage(d.reason)
					}
				}).catch(err => {
					this.$showErrorMessage(err)
				})
			},
			cancelFollowEvt() {
				if (!this.userInfo.id) {
					this.$showLoginMessage();
					return false
				}
				indexApi.delFollow({
					type: "0",
					id: this.paramsId,
					userId: this.userInfo.id
				}).then(d => {
					if (d.code == '0') {
						this.$showSuccessMessage('取消关注成功!')
						this.memberList.isFollow = '0';
					} else {
						this.$showErrorMessage(d.reason)
					}
				}).catch(err => {
					this.$showErrorMessage(err)
				})
			},
			changeListEvt(data) {
				this.type = data
			}
		},
		components: {
			sideBar,
			personalArticle,
			personalToLook,
			personalLookMe
		},
    filters: {
      formatCost(val){
        if (!val){
          return val;
        }else{
          return ((val + 1000) / 10000).toFixed(2) + '万';
        }
      }
    }
	}
</script>

<style lang="less" scoped>
	.index {
		margin: 0 auto;
		width: 1120px;
		padding: 80px 0;
    padding-bottom: 140px;
		.leftContent {
			width: 790px;
			.pageInfo {
				padding: 0 20px;
				line-height: 50px;
				background: #ffffff;
				margin-bottom: 10px;
				.image {
					width: 22px;
					height: 22px;
					border: none;
					outline: none;
					margin-top: 13px;
					margin-right: 15px;
				}
				.userName {
					font-size: 18px;
					color: #4A505A;
				}
				.look {
					background: #FFFFFF;
					border: 1px solid #B5B8C1;
					border-radius: 20px;
					height: 24px;
					text-align: center;
					line-height: 26px;
					font-size: 12px;
					margin-top: 12px;
					color: #939393;
					cursor: pointer;
					width: 65px;
				}
				.follow {
					border-radius: 20px;
					display: inline-block;
					font-size: 12px;
					text-align: center;
					cursor: pointer;
					height: 26px;
					line-height: 26px;
					margin-top: 12px;
					background: #0686D8;
					color: #ffffff;
					width: 65px;
				}
			}
			.pageContent {
				background: #fff;
				margin-bottom: 10px;
				.pageList {
					margin: 20px 20px 0 20px;
					padding-bottom: 20px;
					border-bottom: 1px solid #E7E7E7;
					.imgBox {
						width: 225px;
						height: 145px;
						cursor: pointer;
						img {
							width: 100%;
							height: 100%;
							outline: none;
						}
					}
					.contentBox {
						height: 145px;
						width: 505px;
						margin-left: 20px;
						.contentTitle {
							line-height: 25px;
							font-size: 18px;
							color: #4A505A;
							cursor: pointer;
						}
						.contentTitle:hover {
							color: #3B84D1;
						}
						.contentList {
							margin-top: 10px;
							font-size: 13px;
							color: #848994;
							height: 80px;
							line-height: 20px;
							overflow: hidden;
							text-overflow: ellipsis;
							-webkit-line-clamp: 4;
							display: -webkit-box;
							-webkit-box-orient: vertical;
						}
						.contentOperator {
							margin-top: 5px;
							height: 25px;
							.time {
								float: left;
								line-height: 25px;
								color: #848994;
								font-size: 13px;
								cursor: pointer;
								.user {
									height: 25px;
									width: 25px;
									outline: none;
									border-radius: 50%;
									margin-right: 5px;
								}
								.message {
									display: inline-block;
								}
								.message:hover {
									color: #3B84D1;
									text-decoration: underline;
								}
							}
							.info {
								float: right;
								span {
									display: inline-block;
									line-height: 25px;
									color: #848994;
									font-size: 13px;
									cursor: pointer;
									margin-left: 15px;
									float: left;
								}
								.totalIcon {
									padding: 4px 12px;
									background: url("../assets/images/copy.svg") no-repeat 0 center;
									background-size: 100%;
								}
								.goodIcon {
									padding: 4px 12px;
									background: url("../assets/images/good.svg") no-repeat 0 center;
								}
								.readIcon {
									padding: 4px 12px;
									background: url("../assets/images/read.svg") no-repeat 0 center;
								}
							}
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
		}
		.rightContent {
			width: 310px;
			background: #fff;
			.pageData {
				padding: 20px;
				background: #ffffff;
				.logo {
					text-align: center;
					padding-bottom: 20px;
					.userLogo {
						width: 80px;
						height: 80px;
						border-radius: 50%;
					}
					.userName {
						margin-top: 20px;
						font-size: 20px;
						color: #4A505A;
						line-height: 30px;
					}
					.summary {
						font-size: 12px;
						color: #C2C4CA;
					}
				}
				.list {
					border-top: 1px solid #E7E7E7;
					padding: 20px 0;
					text-align: center;
					.listContent {
						margin: 0 15px;
						.name {
							font-size: 12px;
							color: #939393;
						}
						.number {
							margin-top: 5px;
							font-size: 16px;
							color: #4A505A;
							cursor: pointer;
						}
					}
				}
				.total {
					border-top: 1px solid #E7E7E7;
					padding-top: 20px;
					text-align: center;
					.listContent {
						padding: 10px 11px 10px 10px;
						border: 1px solid #B5B8C1;
						border-radius: 5px;
						margin-right: 10px;
						.name {
							font-size: 16px;
							color: #4A505A;
						}
						.number {
							margin-top: 5px;
							font-size: 12px;
							color: #939393;
						}
					}
					.listContent:last-child {
						margin-right: 0;
					}
				}
			}
		}
	}
</style>
