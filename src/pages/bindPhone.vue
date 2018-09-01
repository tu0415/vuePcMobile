<template>
	<div class="login">
		<div class="loginTitle">绑定手机号</div>
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
				<a href="javascript:;" @click="codeLoginEvt" class="loginBtn">绑定</a>
			</div>
			<div class="weChatLogin">
				<span class="orangeColor">提示: 不绑定手机号无法登录</span>
			</div>
		</div>
	</div>
</template>

<script>
	import indexApi from '../api/indexApi'
	import Utils from '../utils/format'
	let Base64 = require('js-base64').Base64;

	export default {
		name: "bindPhone",
		data() {
			return {
				telephone: '',
				code: '',
				codeText: '发送验证码',
				timeSixty: 60,
				countDown: true
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
				indexApi.getVerifyCode({
					mobile: this.telephone,
					code: this.code
				}).then(d => {
					if (d.code == '0') {
						let objectData = Utils.getCookie('fr_l') ? JSON.parse(Base64.decode(Utils.getCookie('fr_l'))) : {};
						indexApi.getBindWechat({
							mobile: this.telephone,
							nickname: objectData.nickname,
							wechat: objectData.wechat,
							picture: objectData.picture,
							yoyow: objectData.yoyow,
							type: objectData.type
						}).then(d => {
							if(d.code == "0"){
								this.$showSuccessMessage('绑定手机号成功!');
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
							}else{
								this.$showErrorMessage(d.reason)
							}
						}).catch(err => {
							this.$showErrorMessage(err)
						})
					} else {
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
	.login {
		padding: 25px;
		width: 300px;
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
				margin-bottom: 30px;
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
			.weChatLogin {
				width: 100%;
				height: 25px;
				.orangeColor{
					line-height: 25px;
					display: block;
					text-align: center;
					font-size: 14px;
					height: 25px;
					margin: 0 auto;
					color: #FE8E20;
				}
			}
		}
	}
</style>
