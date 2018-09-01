<template>
	<div class="service">
		<div class="serviceBox" v-html="content"></div>
	</div>
</template>

<script>
	import indexApi from '../api/indexApi'
	export default {
		name: "service",
		data(){
			return {
				content: ''
			}
		},
		mounted(){
			this.getServiceList()
		},
		methods: {
			getServiceList(){
				indexApi.getNoticeAgreement({
					type: 3,
					suffix: 'SSSS'
				}).then(d => {
					if(d.code == '0'){
						if(d.data){
							let content = d.data.content.replace(/SSSS/g, '<br/><p style="margin-bottom: 15px;"></p>')
							this.content = content;
						}
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
	.service{
		margin: 0 auto;
		width: 1120px;
		padding: 80px 0;
    padding-bottom: 140px;
		.serviceBox{
			background: #ffffff;
			padding: 20px;
			font-size: 16px;
			line-height: 26px;
			color: #4A4A4A;
		}
	}
</style>
