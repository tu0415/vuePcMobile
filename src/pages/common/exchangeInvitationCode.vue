<template>
	<div class="list">
		<div class="title">兑换邀请码</div>
		<div class="invitationCode clear">
			<template v-for="item in list">
				<div class="invitationCodeBox fl">
					<div class="invitationCodeList">
						<div class="text">{{ item.code }}</div>
						<div class="billText">复制分享</div>
					</div>
					<div class="skinCover" v-if="item.status == '2'">
						<div class="hadUse">已使用</div>
					</div>
				</div>
			</template>
			<template v-for="n in exchangeableNum">
				<div class="invitationCodeBox fl">
					<div class="invitationCodeList" @click="invitationCodeEvt">
						<div class="text">邀请码</div>
						<div class="billText">需<span class="number">{{ exchangeBill }}</span>个知力兑换</div>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
	import indexApi from '../../api/indexApi'
	import {mapState} from 'vuex'
	export default {
		name: "exchangeInvitationCode",
		data(){
			return {
				exchangeableNum: 0,
				exchangeBill: 0,
				list: []
			}
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		created(){
			this.getList();
		},
		methods: {
			getList(){
				indexApi.getInviteCodeList({
					mid: this.userInfo.id
				}).then(d => {
					if(d.code == "0"){
						if(d.data){
							this.exchangeBill = d.data.exchangeBill;
							this.exchangeableNum = d.data.exchangeableNum;
							if(d.data.list){
								this.list = d.data.list;
							}
						}
					}else{
						this.$showErrorMessage(d.reason)
					}
				}).catch(err => {
					this.$showErrorMessage(err)
				})
			},
			invitationCodeEvt(){
				this.$confirm(`将要扣除你${this.exchangeBill}的个知力购买邀请码`, '确定购买邀请码？', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					indexApi.getExchange({
						mid: this.userInfo.id
					}).then(d => {
						if(d.code == "0"){
							this.exchangeableNum -= 1;
							if(d.data){
								this.list.push({
									code: d.data,
									status: 1,
									useId: this.userInfo.id,
								})
							}
						}else{
							this.$showErrorMessage(d.reason)
						}
					}).catch(err => {
						this.$showErrorMessage(err)
					})
				}).catch(() => {
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.list {
		width: 100%;
		.title {
			width: 100%;
			font-size: 20px;
			color: #4A505A;
			padding-bottom: 20px;
			border-bottom: 1px solid #E7E7E7;
		}
		.invitationCodeBox{
			width: 233px;
			height: 121px;
			margin-top: 30px;
			margin-right: 68px;
			position: relative;
			.skinCover{
				width: 100%;
				height: 100%;
				background: url("../../assets/images/skinCover.svg") no-repeat center 0;
				position: absolute;
				top: 0;
				left: 0;
				.hadUse{
					width: 100%;
					margin-top: 40px;
					font-size: 33px;
					color: #FFFFFF;
					text-align: center;
				}
			}
			.invitationCodeList{
				background: url("../../assets/images/borad.svg") no-repeat center 0;
				width: 100%;
				height: 100%;
				cursor: pointer;
				.text{
					line-height: 30px;
					font-size: 33px;
					color: #4A505A;
					text-align: center;
					padding-top: 22px;
				}
				.billText{
					text-align: center;
					font-size: 14px;
					color: #4A505A;
					line-height: 30px;
					margin-top: 31px;
					.number{
						color: #FF7F18;
						display: inline-block;
					}
				}
			}
		}
		.invitationCodeBox:nth-child(3n){
			margin-right: 0;
		}
	}
</style>