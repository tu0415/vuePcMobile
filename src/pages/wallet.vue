<template>
	<div class="wallet clear">
		<div class="leftContent fl">
			<template v-for="item in tabList">
				<div class="tabs clear" @click="changeTabListEvt(item)" :class="{ active : item.id == listId }">
					<template v-if="item.id == listId">
						<img class="image fl" :src="item.src_hover" alt=""/>
					</template>
					<template v-else>
						<img class="image fl" :src="item.src" alt=""/>
					</template>
					<span class="name fl">{{ item.name }}</span>
				</div>
			</template>
		</div>
		<div class="rightContent fl">
			<balance v-if="listId == 1"></balance>
			<ticket v-if="listId == 2"></ticket>
			<censorship v-if="listId == 3"></censorship>
			<exchangeInvitationCode  v-if="listId == 4"></exchangeInvitationCode>
			<purchase v-if="listId == 5"></purchase>
			<forward v-if="listId == 6"></forward>
		</div>
	</div>
</template>

<script>
	import balance from './common/balance'
	import ticket from './common/ticket'
	import censorship from './common/censorship'
	import purchase from './common/purchase'
	import forward from './common/forward'
	import exchangeInvitationCode from './common/exchangeInvitationCode'
	import {mapState} from 'vuex'

	export default {
		name: "wallet",
		data() {
			return {
				listId: 1,
				tabList: [{
					name: '余额',
					src: require('../assets/images/balance.svg'),
					src_hover: require('../assets/images/balance_hover.svg'),
					id: '1'
				}, {
					name: '知票',
					src: require('../assets/images/ticket.svg'),
					src_hover: require('../assets/images/ticket_hover.svg'),
					id: '2'
				}, {
					name: '审查文章',
					src: require('../assets/images/checkArticle.svg'),
					src_hover: require('../assets/images/checkArticle_hover.svg'),
					id: '3'
				}, {
					name: '兑换邀请码',
					src: require('../assets/images/exchangeInvitationCode.svg'),
					src_hover: require('../assets/images/exchangeInvitationCode_hover.svg'),
					id: '4'
				}
				// , {
				// 	name: '购买知力',
				// 	src: require('../assets/images/purchase.svg'),
				// 	src_hover: require('../assets/images/purchase_hover.svg'),
				// 	id: '5'
				// }, {
				// 	name: '提币',
				// 	src: require('../assets/images/forward.svg'),
				// 	src_hover: require('../assets/images/forward_hover.svg'),
				// 	id: '6'
				// }
				],
        auditor : true
			}
		},
		components: {
			balance,
			ticket,
			censorship,
			purchase,
			forward,
			exchangeInvitationCode
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		watch: {
			'$route'(to, from) {
				this.getRouteParams()
			}
		},
		created() {
			this.getRouteParams();
		},
		methods: {
			getRouteParams() {
				if(this.userInfo.status == '0'){
					this.tabList.splice(3, 1)
				}
				if (this.$route.query.id) {
					this.listId = this.$route.query.id
				}
        if(this.userInfo.id != 74){
          this.tabList.push({
            	name: '购买知力',
            	src: require('../assets/images/purchase.svg'),
            	src_hover: require('../assets/images/purchase_hover.svg'),
            	id: '5'
            });
          this.tabList.push({
            name: '提币',
            	src: require('../assets/images/forward.svg'),
            	src_hover: require('../assets/images/forward_hover.svg'),
            	id: '6'
          });
        }
			},
			changeTabListEvt(data) {
				this.listId = data.id
			}
		}
	}
</script>
<style>
	.table th {
		padding: 6px 0;
		font-size: 12px;
		color: #4A505A;
	}
</style>
<style lang="less" scoped>
	.wallet {
		margin: 0 auto;
		width: 1120px;
		padding: 80px 0;
    padding-bottom: 140px;
		.leftContent {
			background: #F5F3F3;
			width: 205px;
			min-height: 790px;
			.tabs {
				padding: 0 0 0 50px;
				height: 50px;
				cursor: pointer;
				.image {
					width: 18px;
					height: 18px;
					outline: none;
					display: inline-block;
					margin: 16px 0;
				}
				.name {
					display: inline-block;
					font-size: 16px;
					color: #4A505A;
					height: 22px;
					margin: 14px 0 14px 15px;
				}
			}
			.tabs.active {
				background: #fff;
				border-left: 2px solid #3B84D1;
				padding: 0 0 0 48px;
				.name {
					color: #3B84D1;
				}
			}
		}
		.rightContent {
			background: #fff;
			padding: 40px;
			width: 835px;
			min-height: 710px;
		}
	}
</style>
