<template>
	<div class="header">
		<div class="content clear">
			<div class="logo fl"></div>
			<div class="operator fr">
				<a class="publish fr" href="javascript:;" v-if="userInfo.status == '1'" @click="publishArticleEvt">发表文章</a>
				<span class="hasLoginContent fr" v-if="userInfo && userInfo.id">
					<el-dropdown class="fl">
						<a class="messageInfo el-dropdown-link"><i :class="{ redIcon: totalMessage }"></i></a>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item>
								<router-link :to="'/systemInformation?listId=1'">
								    <img class="image" src="../assets/images/commentMessage.svg" alt=""/>评论<i :class="{ redIcon: commentMessage }"></i>
								</router-link>
							</el-dropdown-item>
						    <el-dropdown-item>
						        <router-link :to="'/systemInformation?listId=2'">
						            <img class="image" src="../assets/images/voteMessage.svg" alt=""/>投票<i :class="{ redIcon: voteMessage }"></i>
						        </router-link>
						    </el-dropdown-item>
						    <el-dropdown-item>
						        <router-link :to="'/systemInformation?listId=3'">
						            <img class="image" src="../assets/images/investmentMessage.svg" alt=""/>助力<i :class="{ redIcon: billMessage }"></i>
						        </router-link>
						    </el-dropdown-item>
						    <el-dropdown-item>
						        <router-link :to="'/systemInformation?listId=0'">
						            <img class="image" src="../assets/images/systemMessage.svg" alt=""/>系统消息<i :class="{ redIcon: systemMessage }"></i>
						        </router-link>
						    </el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<el-dropdown class="fl">
						<a href="javascript:;" class="el-dropdown-link userName fl">
							<template v-if="userInfo.picture">
							    <img :src="userInfo.picture"/>
							</template>
							<template v-else>
							    <img src="../assets/images/defaultImg.svg"/>
							</template>
							<template v-if="userInfo.nickname.length > 4">
								{{ userInfo.nickname.slice(0, 4) }}..
							</template>
							<template v-else>
								{{ userInfo.nickname}}
							</template>
						</a>
						<el-dropdown-menu slot="dropdown">
						    <el-dropdown-item>
						        <router-link :to="'/personal'"><img class="image" src="../assets/images/personalData.svg" alt=""/>个人中心</router-link>
						    </el-dropdown-item>
						    <el-dropdown-item>
						        <a href="javascript:;" @click="logoutEvt"><img class="image" src="../assets/images/logout.svg" alt=""/>退出</a>
						    </el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
                </span>
				<span class="loginContent fr" v-else>
		            <router-link :to="'/login'">登录</router-link>
		        </span>
				<span class="searchContent fr">
		            <input type="text" placeholder="输入搜索关键词..." v-model="searchVal" @keyup.enter="searchContentEvt" class="search"/>
		            <span class="searchBtn" @click="searchContentEvt"></span>
		        </span>
			</div>
			<div class="nav fr">
				<ul class="navList">
					<li v-for="(item, index) in navList" :key="index">
						<a href="javascript:;" @click="changeTabsEvt(item)" :class="{ active: item.active }">{{item.name }}</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import Utils from '../utils/format'
	import {mapState} from 'vuex'

	export default {
		data() {
			return {
				navList: [{
					name: '首页',
					id: 'index',
					url: 'index'
				}, {
					name: '快讯',
					id: 'flash',
					url: 'flash'
				}, {
					name: '视频',
					id: 'videoIndex',
					url: 'videoIndex'
				}, {
					name: '知库',
					id: 'wallet',
					url: 'wallet'
				}, {
					name: 'APP',
					id: 'app',
					url: 'app'
				}
				// , {
				// 	name: '关于我们',
				// 	id: 'about',
				// 	url: 'about'
				// }
				],
				searchVal: ''
			}
		},
		computed: {
			...mapState([
				'userInfo',
				'voteMessage',
				'systemMessage',
				'commentMessage',
				'billMessage'
			]),
			totalMessage() {
				return this.billMessage || this.voteMessage || this.systemMessage || this.commentMessage
			}
		},
		created() {
			/* 初始化路由 */
			this.setSelectedUrl(location.pathname);

			if (this.userInfo.id) {
				this.getMessagelist();
			}
		},
		watch: {
			/* 路由切换 */
			'$route'(to, from) {
				this.setSelectedUrl(to.path)
			}
		},
		methods: {
			getMessagelist() {
				this.$store.dispatch("getRedMessage", this.userInfo.id)
			},
			publishArticleEvt() {
				if (!this.userInfo.id) {
					this.$showLoginMessage()
					return false
				}
				this.$router.push({
					name: 'publishArticle'
				})
			},
			changeTabsEvt(data) {
				if (data.url == 'wallet' && !this.userInfo.id) {
					this.$showLoginMessage()
					return false
				}

				this.$router.push({
					name: data.url
				})
			},
			logoutEvt() {
				Utils.deleteCookie('cur_dt');
				location.reload();
			},
			searchContentEvt() {
				if (!this.searchVal) {
					return false
				}
				sessionStorage.setItem('keyWord', this.searchVal);
				window.open(location.origin + '/searchArticle');
				this.searchVal = '';
			},
			setSelectedUrl(currentPath) {
				if (/^\/$/.test(currentPath)) {
					this.navList.forEach(item => {
						if (item.id == 'index') {
							this.$set(item, 'active', true)
						} else {
							this.$set(item, 'active', false)
						}
					})
				} else {
					this.navList.forEach(item => {
						if (currentPath.indexOf(item.url) > -1) {
							this.$set(item, 'active', true)
						} else {
							this.$set(item, 'active', false)
						}
					})
				}
			}
		}
	}
</script>
<style>
	.el-dropdown-menu {
		padding: 0;
		margin: 0;
		font-size: 12px;
		border: none;
	}

	.el-dropdown-menu a {
		color: #4A505A;
		display: block;
		position: relative;
	}

	.el-dropdown-menu .image {
		width: 18px;
		height: 18px;
		display: inline-block;
		outline: none;
		margin: 9px 10px 9px 0;
	}

	.el-dropdown-menu .redIcon {
		width: 4px;
		height: 4px;
		display: inline-block;
		background: #D0021B;
		border-radius: 100%;
		position: absolute;
		top: 10px;
	}
</style>
<style lang="less" scoped>
	.header {
		width: 100%;
		height: 60px;
		background-color: #fff;
		position: fixed;
		z-index: 999;
		.content {
			width: 1120px;
			margin: 0 auto;
			height: 100%;
			.logo {
				background: url("../assets/images/logo.svg") no-repeat center center;
				width: 130px;
				height: 33px;
				margin-top: 13px;
			}
			.nav {
				height: 100%;
				margin-right: 15px;
				ul {
					height: 100%;
					li {
						float: left;
						height: 100%;
						a {
							padding-top: 17px;
							height: 26px;
							display: inline-block;
							line-height: 26px;
							text-align: center;
							color: #4A505A;
							font-size: 16px;
							margin: 0 12px;
						}
						a.active {
							color: #3B84D1;
							padding-top: 15px;
							border-top: 2px solid #3B84D1;
						}
						a:hover {
							color: #3B84D1;
							padding-top: 15px;
							border-top: 2px solid #3B84D1;
						}
					}
				}
			}
			.operator {
				height: 100%;
				.searchContent {
					display: inline-block;
					margin-top: 17px;
					height: 26px;
					.search {
						margin-top: 3px;
						height: 20px;
						line-height: 20px;
						border: none;
						border-bottom: 1px solid #E7E7E7;
						font-size: 14px;
						color: #4A4A4A;
						width: 140px;
					}
					.searchBtn {
						display: inline-block;
						height: 26px;
						width: 26px;
						float: right;
						background: url("../assets/images/search.svg") no-repeat right 0;
						cursor: pointer;
					}
					.search:focus {
						border-bottom: 1px solid #3B84D1;
					}
				}
				.publish {
					margin-left: 20px;
					height: 30px;
					width: 90px;
					display: inline-block;
					background: #3B84D1;
					border-radius: 40px;
					font-size: 14px;
					text-align: center;
					line-height: 30px;
					color: #FFFFFF;
					margin-top: 15px;
				}
				.loginContent {
					margin-top: 17px;
					margin-left: 16px;
					display: inline-block;
					position: relative;
					height: 26px;
					padding-left: 28px;
					background: url("../assets/images/user.svg") no-repeat 0 0;
					a {
						font-size: 14px;
						color: #4A4A4A;
						height: 26px;
						display: inline-block;
						line-height: 26px;
						text-align: center;
						padding-right: 6px;
					}
				}
				.hasLoginContent {
					margin-top: 17px;
					margin-left: 16px;
					display: inline-block;
					position: relative;
					height: 26px;
					cursor: pointer;
					.messageInfo {
						display: inline-block;
						margin-top: 5px;
						margin-right: 10px;
						width: 16px;
						height: 16px;
						background: url("../assets/images/message.svg") no-repeat 0 0;
						position: relative;
						.redIcon {
							width: 4px;
							height: 4px;
							display: inline-block;
							background: #D0021B;
							border-radius: 100%;
							position: absolute;
							top: -1px;
							right: -1px;
						}
					}
					.userName {
						font-size: 14px;
						color: #4A4A4A;
						height: 26px;
						display: inline-block;
						line-height: 26px;
						text-align: center;
						padding-right: 6px;
						padding-left: 6px;
						img {
							width: 20px;
							height: 20px;
							border: none;
							display: inline-block;
							margin-top: 3px;
							border-radius: 50%;
						}
					}
				}
			}
		}
	}
</style>
