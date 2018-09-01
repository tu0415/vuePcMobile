<template>
	<div>
		<div class="login">
			<div class="loginTitle">会员登录</div>
			<div class="loginContent">
				<div class="telephone">
					<input type="text" class="telephoneInput" v-model="telephone" placeholder="手机号"/>
				</div>
				<div class="code clear">
					<input type="text" class="codeInput fl" v-model="code" placeholder="验证码"/>
					<span v-if="countDown" class="codeInfo fr" @click="getCodeEvt">{{ codeText }}</span>
					<span v-else class="codeInfo redColor fr">{{ timeSixty }}s</span>
				</div>
				<div class="loginBtnBox">
					<a href="javascript:;" @click="codeLoginEvt" class="loginBtn">登录</a>
				</div>
				<div class="serviceBox">
					<el-checkbox v-model="checkService"></el-checkbox>
					我已阅读并接受
					<a href="javascript:;" @click="goServiceEvt">《服务协议》</a>
				</div>
				<div class="weChatLogin">
					<a href="javascript:;" class="weChatloginBtn" @click="weChatloginEvt"><i class="icon"></i>微信登录</a>
					<a href="javascript:;" class="yoyowloginBtn" @click="yoyowloginEvt"><i class="icon"></i>YOYOW登录</a>
				</div>
			</div>
		</div>
		<div class="tipsContent">
			温馨提示: 若使用微信或YOYOW登录, 请允许浏览器弹框, 感谢您的配合!
		</div>
	</div>
</template>

<script>
	import indexApi from '../api/indexApi'
	import Utils from '../utils/format'
	import configUrl from '../config/config_url'
	let Base64 = require('js-base64').Base64;

	export default {
		name: "login",
		data() {
			return {
				telephone: '',
				code: '',
				codeText: '发送验证码',
				timeSixty: 60,
				countDown: true,
				checkService: true
			}
		},

		methods: {
			getCodeEvt() {
				let timer = null;
				if (this.telephone == '' || !(/^1[\d+]{10}$/.test(this.telephone))) {
					this.$showErrorMessage('请填写正确的手机号!')
					return false
				}
				if (this.countDown) {
					this.countDown = false;

					timer = window.setInterval(() => {
						this.timeSixty -= 1;
						if (this.timeSixty <= 0) {
							this.resetCodeEvt('overTimer', timer);
						}
					}, 1000);

					indexApi.getCode({
						telephone: this.telephone
					}).then(d => {
						if (d.code == '0') {
							this.$showSuccessMessage('验证码发送成功');
							if (this.timeSixty <= 0) {
								this.resetCodeEvt('successTimer', timer);
							}
						} else {
							this.$showErrorMessage(d.reason)
							this.resetCodeEvt('errorTimer', timer);
						}
					}).catch(err => {
						this.$showErrorMessage(err)
						this.resetCodeEvt('errorTimer', timer);
					})
				}
			},
			resetCodeEvt(type, timer) {
				this.timeSixty = 60;
				this.countDown = true;
				if (type == 'overTimer' || type == 'successTimer') {
					this.codeText = '发送验证码';
				} else if (type == 'errorTimer') {
					this.codeText = '重新发送';
				}
				window.clearInterval(timer)
			},
			codeLoginEvt() {
				if (this.telephone == '' || !(/^1[\d+]{10}$/.test(this.telephone))) {
					this.$showErrorMessage('请填写正确的手机号!')
					return false
				}
				if (this.code == '') {
					this.$showErrorMessage('验证码不能为空!')
					return false
				}
				if(!this.checkService){
					this.$showErrorMessage('请先阅读并接受服务协议!')
					return false
				}
				indexApi.login({
					mobile: this.telephone,
					code: this.code
				}).then(d => {
					if (d.code == '0') {
						this.$showSuccessMessage('登录成功!');
						if (d.data) {
							Utils.setCookie('cur_dt', Base64.encode(JSON.stringify({
								"id": d.data.id,
								"nickname": d.data.nickname,
								"picture": d.data.picture,
								"identification": d.data.identification,
								"status": d.data.isAuthor
							})), 1);
						} else {
							Utils.setCookie('cur_dt', Base64.encode(JSON.stringify({})), 1);
						}
						this.$router.push({name: "index"})
					} else {
						this.$showErrorMessage(d.reason)
					}
				}).catch(err => {
					this.$showErrorMessage(err)
				})
			},
			goServiceEvt(){
				this.$router.push({
					name: 'service'
				})
			},
			weChatloginEvt() {
				if(!this.checkService){
					this.$showErrorMessage('请先阅读并接受服务协议!')
					return false
				}
				indexApi.getWechatConfig().then(d =>{
					if(d.code == '0'){
						if(d.data){
							let l=(screen.availWidth-600)/2;
							let t=(screen.availHeight-520)/2;
							window.open("https://open.weixin.qq.com/connect/qrconnect?appid="+ d.data.appid +
								"&redirect_uri="+ encodeURIComponent(`${configUrl.web_url}/tip`) +
								"&response_type=code&scope=snsapi_login" +
								"&state="+ d.data.state +"#wechat_redirect", "微信登录", "height=520, width=600, top="+t+",left="+l+"");
						}
					}else {
						this.$showErrorMessage(d.reason)
					}
				}).catch(err => {
					this.$showErrorMessage(err)
				})
			},
			yoyowloginEvt(){
				if(!this.checkService){
					this.$showErrorMessage('请先阅读并接受服务协议!')
					return false
				}
		    indexApi.getYoyowConfig().then(d =>{
					if(d.code == '0'){
					    if(d.data){
					        let l=(screen.availWidth-600)/2;
					        let t=(screen.availHeight-520)/2;
					        window.open(d.data.authUrl);
					    }
					}else {
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
	.tipsContent{
		width: 400px;
		height: 20px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: 160px;
		text-align: center;
		transform: translate(-50%, -50%);
		font-size: 12px;
		color: #D0021B;
	}
	.login {
		padding: 30px;
		width: 330px;
		height: 300px;
		position: absolute;
		background: #fff;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -60%);
		.loginTitle {
			width: 100%;
			font-size: 20px;
			color: #4A505A;
			height: 30px;
			line-height: 30px;
			text-align: center;
		}
		.loginContent {
			margin-top: 40px;
			.telephone {
				height: 40px;
				border: 1px solid #BDC0C8;
				margin-bottom: 20px;
				padding: 0 10px;
				.telephoneInput {
					width: 100%;
					height: 40px;
					border: none;
					line-height: 40px;
					display: block;
					font-size: 14px;
					cursor: pointer;
				}
			}
			.code {
				height: 40px;
				border: 1px solid #BDC0C8;
				margin-bottom: 20px;
				padding-left: 10px;
				.codeInput {
					width: 60%;
					height: 40px;
					line-height: 40px;
					border: none;
					display: inline-block;
					font-size: 14px;
					cursor: pointer;
				}
				.codeInfo {
					height: 24px;
					line-height: 24px;
					display: inline-block;
					font-size: 14px;
					color: #3B84D1;
					border-left: 1px solid #BDC0C8;
					text-align: center;
					padding: 0 15px;
					margin: 8px 0;
					cursor: pointer;
				}
				.redColor {
					color: #ff0000;
				}
			}
			.loginBtnBox {
				width: 100%;
				height: 40px;
				margin-bottom: 10px;
				.loginBtn {
					width: 100%;
					display: block;
					background: #3B84D1;
					font-size: 14px;
					color: #FFFFFF;
					text-align: center;
					height: 40px;
					line-height: 40px;
				}
			}
			.serviceBox{
				margin-bottom: 20px;
				line-height: 20px;
			}
			.weChatLogin {
				width: 100%;
				height: 25px;
				text-align: center;
				.weChatloginBtn {
					display: inline-block;
					height: 20px;
					font-size: 14px;
					color: #BDC0C8;
					line-height: 20px;
					text-align: center;
					margin-right: 30px;
					.icon{
						background: url("../assets/images/loginWechat.svg") no-repeat center 0;
						background-size: 100%;
						width: 16px;
						height: 16px;
						display: inline-block;
						float: left;
						margin: 2px 5px 0 0;
					}
				}
				.yoyowloginBtn {
					display: inline-block;
					height: 20px;
					font-size: 14px;
					color: #BDC0C8;
					line-height: 20px;
					text-align: center;
					.icon{
						background: url("../assets/images/yoyow.svg") no-repeat center 0;
						background-size: 100%;
						width: 16px;
						height: 16px;
						display: inline-block;
						float: left;
						margin: 2px 5px 0 0;
					}
				}
			}
			.tipsContent{
				font-size: 12px;
				color: #D0021B;
			}
		}
	}
</style>
