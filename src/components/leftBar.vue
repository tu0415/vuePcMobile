<template>
	<div class="leftSideBar">
		<div class="share">
			<div class="shareTitle">分享到</div>
			<div class="list">
				<div class="listWeChat">
					<a href="javascript:;">微信
						<div class="qrCodeContent">
							<span class="qrCode fl"><qrCode :cls="qrCls" :size="size" :value="qrText"></qrCode></span>
							<span class="qrCodeText fr">打开微信“扫一扫”，打开网页后点击屏幕右上角“分享”按钮</span>
							<i class="icon"></i>
						</div>
					</a>
				</div>
				<div class="listQQ">
					<a href="javascript:;" @click="shareList('qq')">QQ</a>
				</div>
				<div class="listWeiBo">
					<a href="javascript:;" @click="shareList('sina')">微博</a>
				</div>
			</div>
		</div>
		<div class="operator">
			<div class="good">
				<a href="javascript:;" @click="showCommentEvt('vote', voteStatus)" class="voteBox">
					<template v-if="voteStatus == '1'">
						<img src="../assets/images/vote_pre.svg"/>
					</template>
					<template v-else>
						<img src="../assets/images/vote_def.svg"/>
					</template>
					{{ totalRead }}</a>
			</div>
			<div class="read">
				<a href="javascript:;" @click="showCommentEvt('investe', billStatus)">
					<template v-if="billStatus == '1'">
						<img src="../assets/images/invest_pre.svg"/>
					</template>
					<template v-else>
						<img src="../assets/images/investe.svg"/>
					</template>
					{{ totalInveste }}
				</a>
			</div>
		</div>
	</div>
</template>

<script>
	import qrCode from 'v-qrcode'
	import {mapState} from 'vuex'

	export default {
		name: "leftBar",
		data() {
			return {
				codeContent: '',
				qrText: '',
				size: 100,
				qrCls: ''
			}
		},
		components: {
			qrCode
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		watch: {
			article(val) {
				this.articleList = val;
				this.initEvt();
			}
		},
		mounted() {
			this.articleList = this.article;
			this.initEvt();
		},
		props: ['article', 'totalRead', 'totalInveste', 'voteStatus', 'billStatus'],
		methods: {
			initEvt() {
				let userId = this.userInfo.id || 0;
				let articleId = this.articleList.id;
				this.qrText = `${location.origin}/cms_page/detail_share_content/${articleId}/${userId}`;
			},
			showCommentEvt(type, status) {
				if (status == 1) {
					this.$showErrorMessage('已经投过了!')
					return false;
				}
				this.$emit('leftType', type);
			},
			shareList(type) {
				let url = '';
				switch (type) {
					case "sina":
						url = "http://service.weibo.com/share/share.php?title=" +
							this.articleList.title +
							'&url=' + window.location.href;
						window.open(url);
						break;
					case "qq":
						url = 'http://connect.qq.com/widget/shareqq/index.html??summary=' +
							this.articleList.title +
							'&url=' + window.location.href;
						window.open(url);
						break;
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	.leftSideBar {
		width: 100%;
		.share {
			background: #ffffff;
			padding: 15px 0;
			.shareTitle {
				padding-left: 15px;
				font-size: 14px;
				color: #4A505A;
				line-height: 20px;
			}
			.list {
				padding-left: 20px;
				.listWeChat {
					margin-top: 20px;
					line-height: 25px;
					a {
						background: url("../assets/images/weChat.svg") no-repeat 0 0;
						font-size: 14px;
						color: #848994;
						display: block;
						padding-left: 30px;
						position: relative;
						.qrCodeContent {
							width: 250px;
							height: 110px;
							position: absolute;
							left: 95px;
							top: 50%;
							background: #ffffff;
							box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.20);
							box-sizing: border-box;
							padding: 5px;
							transform: translate(0, -50%);
							display: none;
							.qrCode {
								width: 108px;
								display: inline-block;
							}
							.qrCodeText {
								width: 125px;
								display: inline-block;
								font-size: 12px;
								margin-top: 12px;
								color: #000;
							}
							.icon:after {
								content: '';
								position: absolute;
								top: 50%;
								left: -10px;
								border-top: 10px solid transparent;
								border-right: 10px solid #FFFFFF;
								border-bottom: 10px solid transparent;
								transform: translate(0, -50%);
							}
						}
					}
					a:hover {
						background: url("../assets/images/weixin_hover.svg") no-repeat 0 0;
						color: #2CC701;
						.qrCodeContent {
							display: block;
							color: #848994;
						}
					}
				}
				.listQQ {
					margin-top: 20px;
					line-height: 25px;
					a {
						background: url("../assets/images/QQ.svg") no-repeat 0 0;
						font-size: 14px;
						color: #848994;
						display: block;
						padding-left: 30px;
					}
					a:hover {
						background: url("../assets/images/qq_hover.svg") no-repeat 0 0;
						color: #4BB1EE;
					}
				}
				.listWeiBo {
					margin-top: 20px;
					line-height: 25px;
					a {
						background: url("../assets/images/weiBo.svg") no-repeat 0 0;
						font-size: 14px;
						color: #848994;
						display: block;
						padding-left: 30px;
					}
					a:hover {
						background: url("../assets/images/weibo_hover.svg") no-repeat 0 0;
						color: #DB231A;
					}
				}
			}
		}
		.operator {
			background: #ffffff;
			margin-top: 20px;
			padding: 15px;
			.good {
				width: 100%;
				a {
					font-size: 14px;
					color: #848994;
					display: block;
					text-align: center;
					cursor: pointer;
					line-height: 25px;
					img {
						display: block;
						width: 49px;
						height: 49px;
						margin-left: 10px;
						border: none;
					}
				}
			}
			.read {
				margin-top: 20px;
				width: 100%;
				a {
					font-size: 14px;
					color: #848994;
					display: block;
					text-align: center;
					cursor: pointer;
					line-height: 25px;
					img {
						display: block;
						width: 49px;
						height: 49px;
						margin-left: 10px;
						border: none;
					}
				}
			}
		}
	}
</style>
