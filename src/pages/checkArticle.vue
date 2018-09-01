<template>
	<div class="checkArticle clear">
		<div class="leftContent fl">
			<div class="operator">
				<div class="good">
					<a href="javascript:;" @click="approveArticle(true)">通过</a>
				</div>
				<div class="read">
					<a href="javascript:;" @click="approveArticle(false)">不通过</a>
				</div>
			</div>
		</div>
		<div class="rightContent fr">
			<div class="pageContent">
				<div class="title" v-html="contentData.title"></div>
				<div class="subTitle clear">
					<div class="leftImage fl">
						<img v-if="contentData.authorImgUri" :src="contentData.authorImgUri" alt=""/>
						<img v-else src="../assets/images/defaultImg.svg" alt=""/>
					</div>
					<div class="leftSub fl">
						<div class="name" @click="jumpToPersonalEvt(contentData)">{{ contentData.authorName }}</div>
					</div>
					<div class="rightSub fr">
						<div class="date">{{ contentData.releaseTime | formatTime }}</div>
					</div>
				</div>
        <!-- <div class="content" v-childImg v-html="contentData.content"></div> -->
				<div class="content" v-html="contentData.content"></div>
				<div class="operatorList">
					<div class="tags clear">
						<template v-if="contentData.tags && contentData.tags.length">
							<template v-for="item in contentData.tags">
								<a class="tagsList fl" href="javascript:;"  @click="tagArticleEvt(item)">{{ item.name }}</a>
							</template>
						</template>
					</div>
				</div>
			</div>
		</div>
		<unthrough-dialog v-if="showVisible" :listData.sync="paramsList"
		                  :dataVisible.sync="showVisible"></unthrough-dialog>
	</div>
</template>

<script>
	import indexApi from '../api/indexApi'
	import Utils from '../utils/format'
	import unthroughDialog from '../pages/common/unthroughDialog'
	import {mapState} from 'vuex'

	export default {
		name: "checkArticle",
		data() {
			return {
				contentData: {},
				paramsList: {
					articleId: '',
					id: ''
				},
				showVisible: false
			}
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		filters: {
			formatTime(val) {
				if (!val) return val;

				return Utils.formatDate(parseInt(val), 'MM-dd hh:mm')
			}
		},
		components: {
			unthroughDialog
		},
		mounted() {
			this.paramsList.articleId = this.$route.query.articleId;
			this.paramsList.id = this.$route.query.id;

			indexApi.detailList({
				id: this.paramsList.articleId,
				userId: this.userInfo.id || 0
			}).then(d => {
				if (d.code == "0") {
					if (d.data) {
						this.contentData = d.data
					}
				} else {
					this.$showErrorMessage(d)
				}
			}).catch(err => {
				this.$showErrorMessage(err)
			})
		},
		directives: {
			childImg: {
				bind(el, binding) {
					setTimeout(function(){
						let pWidth = 940;
						if(el.querySelectorAll("img")){
							el.querySelectorAll("img").forEach(img => {
								let width = img.width;
								let height = img.height;
								if(width > pWidth){
									img.style.width = pWidth + 'px';
									img.style.height = parseInt((height * pWidth) / width) + "px";
								}else{
									img.style.width = img.width + "px"
									img.style.height = img.height + "px"
								}
							})
						}
						if(el.querySelectorAll("iframe")){
							el.querySelectorAll("iframe").forEach(iframe => {
								let width = iframe.offsetWidth;
								let height = iframe.offsetHeight;
								iframe.style.width = pWidth + 'px';
								iframe.style.height = parseInt((height * pWidth) / width)+ "px";
							})
						}
						if(el.querySelectorAll("a")){
							el.querySelectorAll("a").forEach(a => {
								a.setAttribute('href', 'javascript:;')
							})
						}
					}, 100)
				}
			}
		},
		methods: {
			approveArticle(flag) {
				if (flag) {
					indexApi.approveArticle({
						id: this.paramsList.id,
						userId: this.userInfo.id || 0,
						status: 1,
						content: ''
					}).then(d => {
						if (d.code == '0') {
							this.$showSuccessMessage('审查通过!');
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
				} else {
					this.showVisible = true
				}
			},
			tagArticleEvt(data) {
				window.open(location.origin + '/tagArticle?tagId=' + data.id + '&tagName=' + data.name);
			},
			jumpToPersonalEvt(data) {
				this.$router.push({
					name: 'personalIndex',
					query: {
						id: data.authorId
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.checkArticle {
		margin: 0 auto;
		width: 1120px;
		padding: 80px 0;
    padding-bottom: 140px;
		.leftContent {
			width: 160px;
			.operator {
				background: #ffffff;
				padding: 30px;
				.good {
					width: 100%;
					a {
						background: url("../assets/images/through.svg") no-repeat center 0;
						font-size: 14px;
						color: #848994;
						display: block;
						padding-top: 60px;
						height: 25px;
						line-height: 25px;
						width: 55px;
						margin: 0 auto;
						text-align: center;
						cursor: pointer;
					}
				}
				.read {
					margin-top: 30px;
					width: 100%;
					a {
						background: url("../assets/images/unthrough.svg") no-repeat center 0;
						font-size: 14px;
						color: #848994;
						width: 55px;
						display: block;
						padding-top: 60px;
						height: 25px;
						line-height: 25px;
						text-align: center;
						margin: 0 auto;
						cursor: pointer;
					}
				}
			}
		}
		.rightContent {
			width: 940px;
			.pageContent {
				width: 100%;
				background: #ffffff;
				padding: 25px 15px;
				.title {
					font-size: 24px;
					color: #4A505A;
					line-height: 30px;
				}
				.subTitle {
					width: 100%;
					padding: 10px 0;
					border-bottom: 1px solid #E7E7E7;
					.leftImage {
						width: 30px;
						height: 30px;
						margin-right: 6px;
						img {
							display: block;
							width: 100%;
							height: 100%;
							outline: none;
							border-radius: 50%;
						}
					}
					.leftSub {
						.name {
							line-height: 30px;
							text-align: left;
							color: #4A505A;
							font-size: 13px;
							cursor: pointer;
						}
						.name:hover{
							color: #3b84d1;
							text-decoration: underline;
						}
					}
					.rightSub {
						.date {
							line-height: 30px;
							text-align: left;
							color: #939393;
							font-size: 12px;
						}
					}
				}
				.content {
					margin-top: 15px;
					font-size: 16px;
					color: #4A4A4A;
					line-height: 26px;
					.imageContent {
						width: 100%;
						border: none;
						outline: none;
						height: 400px;
						margin-bottom: 15px;
					}
				}
				.operatorList {
					width: 100%;
					margin-top: 35px;
					.total {
						line-height: 25px;
						.totalCount {
							font-size: 16px;
							color: #939393;
							display: inline-block;
						}
						.complaint {
							display: inline-block;
							border-radius: 100px;
							font-size: 13px;
							background: #F5F3F3;
							color: #4A505A;
							height: 25px;
							text-align: center;
							line-height: 25px;
							padding: 0 7px;
							.icon {
								float: left;
								display: inline-block;
								width: 17px;
								height: 17px;
								margin: 4px 5px 0 0;
								background: url("../assets/images/complaint.svg") no-repeat 0 0;
							}
							span {
								float: left;
								height: 25px;
								display: inline-block;
							}
						}
					}
					.tags {
						margin-top: 35px;
						width: 100%;
						.tagsList {
							background: #F5F3F3;
							display: inline-block;
							text-align: center;
							font-size: 14px;
							color: #4A505A;
							margin: 0 15px 15px 0;
							width: 85px;
							height: 30px;
							line-height: 30px;
							border-radius: 15px;
						}
					}
				}
			}
		}
	}
</style>
