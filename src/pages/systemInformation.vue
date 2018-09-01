<template>
	<div class="systemInformation clear">
		<div class="leftContent fl">
			<template v-for="item in tabList">
				<div class="tabs clear" @click="changeTabListEvt(item.id)" :class="{ active : item.id == listId }">
					<template v-if="item.id == listId">
						<img class="image fl" :src="item.src_hover" alt=""/>
					</template>
					<template v-else>
						<img class="image fl" :src="item.src" alt=""/>
					</template>
					<span class="name fl">{{ item.name }}<i class="icon" v-if="item.showIcon"></i></span>
				</div>
			</template>
		</div>
		<div class="rightContent fl">
			<commentList v-if="listId == '1'"></commentList>
			<voteList v-if="listId == '2'"></voteList>
			<investmentList v-if="listId == '3'"></investmentList>
			<systemNotification v-if="listId == '0'"></systemNotification>
		</div>
	</div>
</template>

<script>
	import commentList from './common/commentList'
	import voteList from './common/voteList'
	import investmentList from './common/investmentList'
	import systemNotification from './common/systemNotification'
	import {mapState} from 'vuex'
	import * as types from '../store/types'
	import indexApi from '../api/indexApi'

	export default {
		name: "systemInformation",
		data() {
			return {
				listId: '1',
				tabList: [{
					name: '评论',
					src: require('../assets/images/commentMessage.svg'),
					src_hover: require('../assets/images/commentMessage_hover.svg'),
					id: '1',
					showIcon: false
				}, {
					name: '投票',
					src: require('../assets/images/voteMessage.svg'),
					src_hover: require('../assets/images/voteMessage_hover.svg'),
					id: '2',
					showIcon: false
				}, {
					name: '助力',
					src: require('../assets/images/investmentMessage.svg'),
					src_hover: require('../assets/images/investmentMessage_hover.svg'),
					id: '3',
					showIcon: false
				}, {
					name: '系统通知',
					src: require('../assets/images/systemMessage.svg'),
					src_hover: require('../assets/images/systemMessage_hover.svg'),
					id: '0',
					showIcon: false
				}]
			}
		},
		watch: {
			'$route'(to, from) {
				this.getStatus()
				this.getRouteParams()
			}
		},
		created() {
			this.getStatus()
			this.getRouteParams()
		},
		computed: {
			...mapState([
				'userInfo',
				'voteMessage',
				'systemMessage',
				'commentMessage',
				'billMessage'
			])
		},
		components: {
			commentList,
			voteList,
			investmentList,
			systemNotification
		},
		methods: {
			getStatus() {
				this.$store.dispatch("getRedMessage", this.userInfo.id).then(d => {
					this.initEvt()
				}).catch(err => {
					this.$showErrorMessage(err)
				})
			},
			getRouteParams() {
				if (this.$route.query.listId) {
					this.listId = this.$route.query.listId;
					this.changeTabListEvt(this.listId)
				}
			},
			initEvt() {
				this.tabList.forEach(item => {
					if (item.id == '0' && this.systemMessage) {
						item.showIcon = true
					}
					if (item.id == '1' && this.commentMessage) {
						item.showIcon = true
					}
					if (item.id == '2' && this.voteMessage) {
						item.showIcon = true
					}
					if (item.id == '3' && this.billMessage) {
						item.showIcon = true
					}
				})
			},
			initPointer(id) {
				this.tabList.forEach(item => {
					if (item.id == id) {
						this.$set(item, 'showIcon', false)
					}
				})

				if (id == '0') {
					this.$store.commit(types.SYSTEM_MESSAGE, false)
				}
				if (id == '1') {
					this.$store.commit(types.COMMENT_MESSAGE, false)
				}
				if (id == '2') {
					this.$store.commit(types.VOTE_MESSAGE, false)
				}
				if (id == '3') {
					this.$store.commit(types.BILL_MESSAGE, false)
				}
			},
			setHadReadEvt(id) {
				indexApi.getMessageMark({
					type: id,
					userId: this.userInfo.id,
					mark: 1
				}).then(d => {
					if (d.code == '0') {
						this.initPointer(id);
					}
				}).catch(err => {
					this.$showErrorMessage(err)
				})
			},
			changeTabListEvt(id) {
				this.listId = id;
				this.setHadReadEvt(id);
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
	.systemInformation {
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
					position: relative;
				}
				.icon {
					width: 4px;
					height: 4px;
					display: inline-block;
					background: #D0021B;
					border-radius: 100%;
					position: absolute;
					top: 2px;
					right: -3px;
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
