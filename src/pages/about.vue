<template>
	<div class="about">
		<div class="banner">
			<img class="bannerBg" src="../assets/images/banner.png"/>
			<div class="bannerBox">
				<div class="bannerText">三两知 - 用区块链衡量知识的价值</div>
				<div class="bannerBtn" @click="goToWhiteBookEvt">查看三两知白皮书</div>
        <div class="bannerBtn" @click="goToWhiteBookEnEvt">show 32 Know White Paper</div>
			</div>
		</div>
		<div class="introduce">
			<div class="topIntro clear">
				<img class="nameBg fl" src="../assets/images/32know_name.svg"/>
				<div class="nameBox fr">
					<div class="title">三两知的名称</div>
					<div class="text">源于“竹外桃花三两枝，春江水暖鸭先知”，其专注于区块链垂直领域，秉承区块链社区共识理念，搭建去中心化内容社区，努力为区块链爱好者提供客观、科学、有洞察的区块链内容信息服务。</div>
				</div>
			</div>
			<div class="centerIntro clear">
				<div class="positionBox fl">
					<div class="title">在区块链行业</div>
					<div class="text">逐渐崛起的时代中，三两知将抢先布局卡位，成为区块链领域专业的信息聚合社群，并通过提供加密货币的奖励机制，吸引更多优质自产内容反哺平台，实现自身健康社区生态体系的搭建。</div>
				</div>
				<img class="positionBg fr" src="../assets/images/32know_position.svg"/>
			</div>
			<div class="bottomIntro clear">
				<img class="tableBg fl" src="../assets/images/32know_table.svg"/>
				<div class="tableBox fr">
					<div class="title">三两知是国内</div>
					<div class="text">首个尝试准确、透明地为无数对社区做出积极贡献的个人提供回报的区块链垂直内容平台。</div>
				</div>
			</div>
			<div class="concat">
				<div class="title">联系我们<i class="line"></i></div>
				<div class="text">微信公众号：三两知财讯</div>
				<div class="text">微博：三两知财讯</div>
				<div class="text">客服QQ：3434445021</div>
				<div class="text">Telegram：PM_32know</div>
				<div class="text">联系方式：0755-26552301(分机号：2039)</div>
			</div>
			<img class="bottomBg" src="../assets/images/bottomBg.png"/>
		</div>
	</div>
</template>

<script>
	export default {
		name: "about",
		methods: {
			goToWhiteBookEvt(){
				this.$router.push({
					name: 'whiteBook'
				})
			},
      goToWhiteBookEnEvt(){
        this.$router.push({
          name: 'whiteBookEn'
        })
      }
		}
	}
</script>

<style lang="less" scoped>
	.about {
		padding: 60px 0 60px 0;
    padding-bottom: 120px;
		.banner{
			position: relative;
			height: 738px;
			.bannerBg{
				position: absolute;
				left: 0;
				top: 0;
				z-index: 1;
				width: 100%;
				height: 738px;
			}
			.bannerBox{
				position: absolute;
				top: 50%;
				left: 50%;
				z-index: 2;
				transform: translate(-50%, -50%);
				width: 878px;
				.bannerText{
					line-height: 67px;
					font-size: 48px;
					color: #FFFFFF;
					text-align: center;
				}
				.bannerBtn{
					width: 395px;
					line-height: 75px;
					background: #1E88F5;
					border-radius: 5px;
					font-size: 26px;
					color: #FFFFFF;
					text-align: center;
					cursor: pointer;
					letter-spacing: 1.3px;
					margin: 70px auto 0 auto;
				}
			}
		}
		.introduce{
			background: #ffffff;
			padding-bottom: 60px;
			position: relative;
			.topIntro{
				width: 1100px;
				margin: 0 auto;
				padding-top: 180px;
				.nameBg{
					width: 460px;
					height: 335px;
					border: none;
					outline: none;
				}
				.nameBox{
					width: 560px;
					margin-top: 50px;
					.title{
						font-size: 36px;
						color: #3B84D1;
					}
					.text{
						font-size: 24px;
						color: #4A505A;
						letter-spacing: 1.2px;
						line-height: 39px;
						margin-top: 8px;
					}
				}
			}
			.centerIntro{
				width: 1100px;
				margin: 0 auto;
				padding-top: 180px;
				.positionBg{
					width: 500px;
					height: 286px;
					border: none;
					outline: none;
				}
				.positionBox{
					width: 540px;
					margin-top: 40px;
					.title{
						font-size: 36px;
						color: #3B84D1;
					}
					.text{
						font-size: 24px;
						color: #4A505A;
						letter-spacing: 1.2px;
						line-height: 39px;
						margin-top: 8px;
					}
				}
			}
			.bottomIntro{
				width: 1100px;
				margin: 0 auto;
				padding: 180px 0 146px 0;
				.tableBg{
					width: 450px;
					height: 300px;
					border: none;
					outline: none;
				}
				.tableBox{
					width: 560px;
					margin-top: 65px;
					.title{
						font-size: 36px;
						color: #3B84D1;
					}
					.text{
						font-size: 24px;
						color: #4A505A;
						letter-spacing: 1.2px;
						line-height: 39px;
						margin-top: 8px;
					}
				}
			}
			.concat{
				width: 1100px;
				height: 190px;
				padding: 30px 0 30px 60px;
				margin: 0 auto;
				background: #FFFFFF;
				border: 1px solid #E7E7E7;
				.title{
					font-size: 16px;
					color: #3B84D1;
					margin-bottom: 17px;
					position: relative;
					.line{
						width: 950px;
						display: inline-block;
						position: absolute;
						left: 81px;
						top: 11px;
						background: #E7E7E7;
						height: 1px;
					}
				}
				.text{
					font-size: 14px;
					color: #4A505A;
					line-height: 30px;
				}
			}
			.bottomBg{
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 498px;
			}
		}
	}
</style>
