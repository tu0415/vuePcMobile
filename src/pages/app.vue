<template>
	<div class="app">
		<div class="leftBg"></div>
		<div class="rightBg"></div>
		<div class="appContent">
			<div class="contentList fl">
				<div class="title">
					<p>三两知APP下载</p>
					<p>用区块链</p>
					<p>衡量知识的价值</p>
				</div>
				<div class="introduce">
					<p>Three Two Know App Download</p>
					<p>A blockchain based content platform</p>
				</div>
				<div class="code">
					<div class="left_btn">
						<a href="http://img.5kwords.com/forum/app/32know.apk" class="downloadAnd"></a>
						<a href="https://itunes.apple.com/cn/app/id1412628185?mt=8" class="downloadIos"></a>
					</div>
					<div class="right_code clear">
						<div class="andComingCode fl"></div>
						<div class="iosComingCode fl"></div>
					</div>
				</div>
			</div>
			<div class="phoneBg fl"></div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "app"
	}
</script>

<style lang="less" scoped>
	.app{
		margin: 0 auto;
		width: 1120px;
		.leftBg {
			position: absolute;
			left: -30px;
			bottom: 60px;
			background: url("../assets/images/BG-2.svg") no-repeat left 0;
			width: 400px;
			height: 250px;
		}
		.rightBg{
			position: absolute;
			right: 0;
			top: 60px;
			background: url("../assets/images/BG-1.svg") no-repeat right 0;
			width: 700px;
			height: 740px;
		}
		.appContent{
			margin: 190px 0 60px 0;
			height: 640px;
			z-index: 99;
			position: relative;
		}
		.phoneBg{
			background: url("../assets/images/iPhoneX.png") no-repeat center 0;
			width: 310px;
			height: 620px;
			margin-left: 39px;
		}
		.contentList{
			width: 654px;
			.title{
				width: 100%;
				p{
					font-size: 64px;
					color: #000000;
				}
			}
			.introduce{
				margin-top: 28px;
				width: 100%;
				p{
					font-size: 24px;
					color: #000000;
				}
			}
			.code{
				margin-top: 20px;
				.left_btn{
					width: 100%;
					a{
						width: 175px;
						height: 48px;
						line-height: 48px;
						display: inline-block;
					}
					.downloadAnd{
						background: url("../assets/images/android.svg") no-repeat center 0;
						background-size: 100%;
					}
					.downloadIos{
						margin-left: 30px;
						background: url("../assets/images/iPhone.svg") no-repeat center 0;
						background-size: 100%;
					}
				}
				.right_code{
					width: 100%;
					margin-top: 15px;
					.andComingCode{
						width: 175px;
						height: 175px;
						background: url("../assets/images/comingCode1.svg") no-repeat center 0;
					}
					.iosComingCode{
						margin-left: 30px;
						width: 175px;
						height: 175px;
						background: url("../assets/images/comingCode2.svg") no-repeat center 0;
					}
				}
			}
		}
	}
</style>
