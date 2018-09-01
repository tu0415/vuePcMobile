<template>
	<div class="list">
		<div class="title">成为作者</div>
		<div class="authorList" v-if="isAuthor == '0'">
			<div class="authorContent clear">
				<span class="authorText fl">邀请码:</span>
				<input class="authorInput fl" type="text" v-model="inviteCode" />
			</div>
			<div class="authorOperator">
				<a href="javascript:;" class="authorBtn" @click="comingAuthorEvt">成为作者</a>
			</div>
		</div>
		<div class="authorList" v-if="isAuthor == '1'">
			<div class="hadAuthor"></div>
			<div class="hadAuthorText">恭喜你，你已成为作者，快点击右上角发表文章吧</div>
		</div>
	</div>
</template>

<script>
	import indexApi from '../../api/indexApi'
	import {mapState} from 'vuex'
	import Utils from '../../utils/format'
	import * as types from '../../store/types'
	let Base64 = require('js-base64').Base64;
	export default {
		name: "comimgAuthor",
		data(){
			return {
				inviteCode: '',
				isAuthor: ''
			}
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		created(){
			this.isAuthor = this.userInfo.status;
		},
		methods: {
			comingAuthorEvt(){
				indexApi.getComingAuthor({
					userId: this.userInfo.id,
					inviteCode: this.inviteCode
				}).then(d => {
					if(d.code == "0"){
						this.isAuthor = '1';
						this.$store.commit(types.USER_INFO, {
							"id": this.userInfo.id,
							"nickname": this.userInfo.nickname,
							"picture": this.userInfo.picture,
							"identification": this.userInfo.identification,
							"status": 1
						});
						indexApi.getMemberList({
							userId: this.userInfo.id
						}).then(d => {
							if(d.code == "0"){
								if(d.data){
									Utils.setCookie('cur_dt', Base64.encode(JSON.stringify({
										"id": d.data.id,
										"nickname": d.data.nickname,
										"picture": d.data.picture,
										"identification": this.userInfo.identification,
										"status": d.data.isAuthor
									})), 1);
								}else{
									Utils.setCookie('cur_dt', Base64.encode(JSON.stringify({})), 1);
								}
							}else{
								this.$showErrorMessage(d.reason)
							}
						}).catch(err => {
							this.$showErrorMessage(err)
						});
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
	.list {
		width: 100%;
		.title {
			width: 100%;
			font-size: 20px;
			color: #4A505A;
			padding-bottom: 20px;
			border-bottom: 1px solid #E7E7E7;
		}
		.authorList{
			.authorContent{
				margin-top: 15px;
			}
			.hadAuthor{
				margin-top: 60px;
				width: 100%;
				height: 180px;
				background: url("../../assets/images/hadAuthor.svg") no-repeat center 0;
			}
			.hadAuthorText{
				text-align: center;
				font-size: 14px;
				color: #848994;
				margin-top: 30px;
			}
			.authorText{
				display: inline-block;
				line-height: 28px;
				font-size: 14px;
				color: #4A505A;
				width: 70px;
			}
			.authorInput{
				width: 320px;
				line-height: 28px;
				border: 1px solid #BDC0C8;
				border-radius: 3px;
				padding: 0 5px;
			}
			.authorOperator{
				margin-top: 10px;
				.authorBtn{
					display: block;
					margin-left: 70px;
					width: 120px;
					background: #3B84D1;
					color: #ffffff;
					line-height: 30px;
					text-align: center;
					font-size: 14px;
				}
			}
		}
	}
</style>