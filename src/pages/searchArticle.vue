<template>
	<div class="index clear">
		<div class="leftContent fl">
			<div class="searchInfo fl">
				<input class="fl searchInput" type="text" v-model="searchInput"/>
				<a class="searchBtn fl" href="javascript:;" @click="searchInputEvt">站内搜索<img src="../assets/images/search_icon.svg"/></a>
			</div>
			<div class="pageContent fl">
				<div class="pageList fl" v-for="(item, index) in contentList" :key="index">
					<div class="imgBox fl" @click="goDetailEvt(item)">
						<img v-if="item.imgUri" :src="item.imgUri" alt=""/>
					</div>
					<div class="contentBox fl">
						<div class="contentTitle" @click="goDetailEvt(item)" v-html="item.title"></div>
						<div class="contentList" v-html="item.summary"></div>
						<div class="contentOperator">
							<div class="time">
								<img v-if="item.authorImgUri" :src="item.authorImgUri" class="user" alt=""/>
								<img v-else src="../assets/images/defaultImg.svg" class="user" alt=""/>
								<span class="message" @click="jumpToPersonalEvt(item)">{{ item.authorName }}</span> · {{ item.releaseTime | formatTime }}
							</div>
							<div class="info clear">
								<div class="infoList fl"><i class="totalIcon fl"></i><span class="total fl">{{ item.cost }}</span>
								</div>
								<div class="infoList fl"><i class="goodIcon fl"></i><span class="good fl">{{ item.ticketCnt }}</span>
								</div>
								<div class="infoList fl"><i class="readIcon fl"></i><span class="read fl">{{ item.visitCnt | formatNumber }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="pageContent fl" v-if="noFundData">
				<div class="noFund">没有搜索到相关结果</div>
			</div>
			<div class="loadingMore fl" v-if="noMoreData" @click="loadMoreEvt">浏览更多<i class="el-icon-arrow-down"></i>
			</div>

		</div>
		<div class="rightContent fr">
			<side-bar></side-bar>
		</div>
	</div>
</template>

<script>
	import Utils from '../utils/format'
	import sideBar from '../components/sideBar.vue'
	import indexApi from '../api/indexApi'

	export default {
		name: "searchArticle",
		data() {
			return {
				searchInput: '',
				contentList: [],
				pageMap: {
					pageOn: "1",
					pageSize: 20
				},
				noMoreData: false,
				noFundData: false
			}
		},
		mounted() {
			this.searchInput = sessionStorage.getItem('keyWord') || '';
			this.getDefaultArticle(this.searchInput);
		},
		methods: {
			getDefaultArticle(keyWord) {
				this.getArticleListEvt({
					pageSize: this.pageMap.pageSize,
					keyword: keyWord,
					pageOn: "1",
					type: "1"
				}, d => {
					if (d.code == "0") {
						if (d.data && d.data.list && d.data.list.length) {
							this.noFundData = false;
							this.contentList.splice(0)
							d.data.list.forEach(item => {
								if (item.title && item.title.length > 0) {
									item.title = this.searchKeyEvt(this.searchInput, item.title)
								}
								if (item.summary && item.summary.length > 115) {
									item.summary = item.summary.slice(0, 115) + '...';
								}
							});
							this.contentList = this.contentList.concat(d.data.list)

							if (d.data.pages <= d.data.pageNum) {
								this.noMoreData = false;
							} else {
								this.noMoreData = true;
								this.pageMap.pageOn = d.data.pageNum + 1
							}
						} else {
							this.contentList.splice(0)
							this.noMoreData = false;
							this.noFundData = true;
						}
					} else {
						this.$showErrorMessage(d.reason)
					}
				});
			},
			jumpToPersonalEvt(data) {
				this.$router.push({
					name: 'personalIndex',
					query: {
						id: data.authorId
					}
				})
			},
			searchKeyEvt(key, html) {
				return html.replace(new RegExp(key, "g"), "<u class='searchKey'>" + key + "</u>")
			},
			searchInputEvt() {
				this.getDefaultArticle(this.searchInput);
			},
			getArticleListEvt(options, callBack) {
				indexApi.articleList(options)
					.then(d => {
						callBack && callBack(d)
					})
					.catch(err => {
						this.$showErrorMessage(err)
					})
			},
			loadMoreEvt() {
				this.getArticleListEvt({
					pageOn: this.pageMap.pageOn,
					pageSize: this.pageMap.pageSize,
					keyword: this.searchInput,
					type: "1"
				}, d => {
					if (d.code == 0) {
						if (d.data && d.data.list && d.data.list.length) {
							d.data.list.forEach(item => {
								if (item.title && item.title.length > 0) {
									item.title = this.searchKeyEvt(this.searchInput, item.title)
								}
								if (item.summary && item.summary.length > 115) {
									item.summary = item.summary.slice(0, 115) + '...';
								}
							});
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
			goDetailEvt(data) {
				if (!data.id) return false;

				this.$router.push({
					name: "detail",
					query: {
						id: data.id
					}
				})
			}
		},
		components: {
			sideBar
		},
		filters: {
			formatNumber(val) {
				if (!val) return val;

				if (val < 1000) {
					return val
				} else {
					return ((val + 1000) / 10000).toFixed(1) + '万';
				}
			},
			formatTime(val) {
				if (!val) return val;

				return Utils.getDateDiff(parseInt(val))
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
			.searchInfo {
				margin-bottom: 20px;
				line-height: 50px;
				.searchInput {
					line-height: 50px;
					border: none;
					width: 590px;
					padding: 0 10px;
					font-size: 18px;
					color: #4A505A;
				}
				.searchBtn {
					width: 180px;
					background: #3B84D1;
					color: #ffffff;
					font-size: 18px;
					cursor: pointer;
					text-align: center;
					display: inline-block;
					img {
						margin: 15px 0 0 10px;
						border: none;
						outline: none;
					}
				}
			}
			.pageContent {
				background: #fff;
				margin-bottom: 10px;
				.noFund {
					width: 770px;
					padding: 15px 10px;
					text-align: center;
					font-size: 16px;
				}
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
						position: relative;
						.contentTitle {
							line-height: 24px;
							font-size: 18px;
							color: #4A505A;
							word-break: break-all;
							cursor: pointer;
						}
						.contentTitle:hover {
							color: #3B84D1;
						}
						.contentList {
							margin-top: 10px;
							font-size: 13px;
							color: #848994;
							height: 56px;
							word-break: break-all;
							line-height: 18px;
						}
						.contentOperator {
							margin-top: 5px;
							height: 25px;
							position: absolute;
							bottom: 2px;
							width: 100%;
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
								line-height: 25px;
								.infoList {
									margin-left: 10px;
									span {
										display: inline-block;
										color: #848994;
										font-size: 13px;
										cursor: pointer;
										margin-left: 3px;
									}
									.totalIcon {
										width: 20px;
										height: 20px;
										display: inline-block;
										margin-top: 2px;
										background: url("../assets/images/copy.svg") no-repeat 0 center;
										background-size: 100%;
									}
									.goodIcon {
										width: 20px;
										height: 20px;
										display: inline-block;
										margin-top: 2px;
										background: url("../assets/images/good.svg") no-repeat 0 center;
									}
									.readIcon {
										width: 20px;
										height: 20px;
										display: inline-block;
										margin-top: 2px;
										background: url("../assets/images/read.svg") no-repeat 0 center;
									}
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
		}
	}
</style>
