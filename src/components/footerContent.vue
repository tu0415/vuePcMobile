<template>
	<div class="footer">
		<div class="content">
      <p class="fl">
        友情链接: <a href="https://www.feixiaohao.com">非小号 </a>&nbsp;&nbsp;&nbsp;<a href="https://www.jinse.com">金色财经</a>&nbsp;&nbsp;&nbsp;<a href="http://www.qianba.com">博链财经 </a>&nbsp;&nbsp;&nbsp;<a href="www.block360.pro">布洛克财经</a>&nbsp;&nbsp;&nbsp;<a href="https://www.odaily.com"> odaily星球日报</a>&nbsp;&nbsp;&nbsp;<a href="http://www.zncaijing.com">锌财经</a>&nbsp;&nbsp;&nbsp;<a href="https://www.tuoluocaijing.cn">陀螺财经</a>&nbsp;&nbsp;&nbsp;<a href="http://www.xhcjtv.com">嘻哈财经</a>
      </p>
      <p class="fl">
        深圳市三两知科技有限公司 © 2017 - 2021 All Rights Reserved | 粤ICP备17078071号-2
      </p>
			<div class="navList fr">
				<a href="javascript:;" @click="goServiceEvt"><i class="el-icon-document serviceList"></i>服务协议</a>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		methods: {
			goServiceEvt(){
				this.$router.push({
					name: 'service'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.footer {
		position: absolute;
		width: 100%;
		height: 120px;
		line-height: 60px;
		bottom: 0;
		background: #252A2E;
		.content {
			width: 1120px;
			margin: 0 auto;
			height: 100%;
			p {
				font-size: 16px;
				color: #FFFFFF;
        a {
          color: #ffffff;
        }
        a:hover {
          text-decoration: underline;
          color: #3b84d1;
        }
			}
			.navList{
				height: 60px;
				a{
					font-size: 16px;
					color: #FFFFFF;
					cursor: pointer;
					.serviceList{
						margin-right: 5px;
					}
				}
				a:hover{
					text-decoration: underline;
					color: #3B84D1;
				}
			}
		}
	}
</style>
