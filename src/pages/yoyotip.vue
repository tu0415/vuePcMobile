<template>
	<div class="tips">
		YOYOW登录成功, 正在为你跳转, 请稍等!
	</div>
</template>

<script>
	import indexApi from '../api/indexApi'
	import Utils from '../utils/format'
	export default {
		name: "yoyotip",
		beforeRouteEnter(to, from, next){
			next(vm=>{
				if(vm.$route.query.sign){
					vm.getLoginInfo()
				}
			})
		},
		watch: {
			'$route'(to, from) {
				if(this.$route.query.sign) {
					this.getLoginInfo()
				}
			}
		},
		methods: {
			getLoginInfo(){
				indexApi.getYoyowLogin({
					time: this.$route.query.time,
					sign: this.$route.query.sign,
					yoyow: this.$route.query.yoyow
				}).then(d => {
					if(d.code == "1"){
						if(d.data){
							Utils.setCookie('fr_l', Base64.encode(JSON.stringify(d.data)), 1);
						}
						setTimeout(function () {
							window.opener.location.href = location.origin + '/bindPhone';
							window.close();
						}, 150);
					}else if(d.code == "0"){
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
						setTimeout(function () {
							window.opener.location.href = location.origin + '/index';
							window.close();
						}, 150);
					}else{
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
	.tips{
		width: 100%;
		height: 50px;
		line-height: 50px;
		color: #4a505a;
		font-size: 16px;
	}
</style>
