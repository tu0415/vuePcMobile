<template>
	<div class="personal clear">
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
			<personalData v-if="listId == 1"></personalData>
			<myArticle v-if="listId == 2"></myArticle>
			<myLook v-if="listId == 3"></myLook>
			<lookMe v-if="listId == 4"></lookMe>
			<myCollection v-if="listId == 5"></myCollection>
			<lookHistory v-if="listId == 6"></lookHistory>
			<comimgAuthor v-if="listId == 7"></comimgAuthor>
		</div>
	</div>
</template>

<script>
	import personalData from './common/personalData'
	import myArticle from './common/myArticle'
	import myLook from './common/myLook'
	import lookMe from './common/lookMe'
	import myCollection from './common/myCollection'
	import lookHistory from './common/lookHistory'
	import comimgAuthor from './common/comimgAuthor'

	import {mapState} from 'vuex'

	export default {
		name: "personal",
		data() {
			return {
				listId: 1,
				tabList: [{
					name: '个人资料',
					src: require('../assets/images/personalData.svg'),
					src_hover: require('../assets/images/personalData_hover.svg'),
					id: '1'
				}, {
					name: '我的文章',
					src: require('../assets/images/myArticle.svg'),
					src_hover: require('../assets/images/myArticle_hover.svg'),
					id: '2'
				}, {
					name: '我的关注',
					src: require('../assets/images/myAttention.svg'),
					src_hover: require('../assets/images/myAttention_hover.svg'),
					id: '3'
				}, {
					name: '关注我的',
					src: require('../assets/images/payAttention.svg'),
					src_hover: require('../assets/images/payAttention_hover.svg'),
					id: '4'
				}, {
					name: '我的收藏',
					src: require('../assets/images/collection.svg'),
					src_hover: require('../assets/images/collection_hover.svg'),
					id: '5'
				}, {
					name: '浏览历史',
					src: require('../assets/images/history.svg'),
					src_hover: require('../assets/images/history_hover.svg'),
					id: '6'
				}, {
					name: '成为作者',
					src: require('../assets/images/comingAuthor.svg'),
					src_hover: require('../assets/images/comingAuthor_hover.svg'),
					id: '7'
				}]
			}
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
		mounted() {
			this.getRouteParams();
		},
		components: {
			personalData,
			myArticle,
			myLook,
			lookMe,
			myCollection,
			lookHistory,
			comimgAuthor
		},
		methods: {
			getRouteParams() {
				if (this.$route.query.id) {
					this.listId = this.$route.query.id
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
	.personal {
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
