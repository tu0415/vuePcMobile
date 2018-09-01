<template>
	<div class="sideBar">
		<div class="sideBarTitle">推荐文章</div>
		<div class="sideBarList">
			<template v-for="(item, index) in sideBarData">
				<div class="list clear" v-if="index == 0">
					<div class="sideBarImage">
						<img v-if="item.imgUri" :src="item.imgUri" alt="" class="firstListImage"/>
					</div>
					<template v-if="item.title && item.title.length > 28">
						<div class="firstContentBox" @click="goDetailEvt(item)">
							{{ item.title.slice(0, 28) }}...
						</div>
					</template>
					<template v-else>
						<div class="firstContentBox" @click="goDetailEvt(item)">
							{{ item.title }}
						</div>
					</template>
				</div>
				<div class="list clear" @click="goDetailEvt(item)" v-else>
					<div class="imageBox fl">
						<img v-if="item.imgUri" :src="item.imgUri" alt="" class="listImage"/>
					</div>
					<template v-if="item.title && item.title.length > 21">
						<div class="contentBox fl" @click="goDetailEvt(item)">
							{{ item.title.slice(0, 21) }}...
						</div>
					</template>
					<template v-else>
						<div class="contentBox fl" @click="goDetailEvt(item)">
							{{ item.title }}
						</div>
					</template>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
	import indexApi from '../api/indexApi'
  import {mapState} from 'vuex'

	export default {
		name: "sideBar",
		props: ['listData'],
		data() {
			return {
				sideBarData: []
			}
		},
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
		mounted() {
			this.getRecommonArticle();
		},
		methods: {
			getRecommonArticle() {
				this.getArticleListEvt({
					pageSize: "10",
					pageOn: "1",
					type: "0",
          userId: this.userInfo.id
        }, d => {
					if (d.code == 0) {
						if (d.data && d.data.list && d.data.list.length) {
							this.sideBarData = this.sideBarData.concat(d.data.list)
						}
					} else {
						this.$showErrorMessage(d.reason)
					}
				})
			},
			getArticleListEvt(options, callBack) {
				indexApi.articleList(options)
					.then(d => {
						callBack && callBack(d)
					})
					.catch(err => {
						this.$showErrorMessage(err)
					})
			},
			goDetailEvt(data) {
				if (!data.id) return false;
				this.$router.push({
					name: "detail",
					query: {
						id: data.id
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.sideBar {
		margin: 20px;
    padding-bottom: 140px;
		.sideBarTitle {
			font-size: 18px;
			color: #4A505A;
			height: 25px;
			line-height: 25px;
			padding-left: 35px;
			background: url("../assets/images/recomand.svg") no-repeat 0 0;
		}
		.sideBarList {
			.noCommand {
				line-height: 30px;
				text-align: center;
				margin-top: 20px;
				font-size: 14px;
				color: #4A505A;
			}
			.list {
				margin-top: 18px;
				position: relative;
				width: 100%;
				cursor: pointer;
				.sideBarImage {
					margin-top: 18px;
					height: 150px;
					width: 100%;
					.firstListImage {
						height: 150px;
						width: 100%;
						outline: none;
					}
				}
				.firstContentBox {
					position: absolute;
					bottom: 0;
					left: 0;
					padding: 4px 10px;
					width: 250px;
					font-size: 16px;
					color: #FFFFFF;
					background: rgba(0, 0, 0, .5);
				}
				.firstContentBox:hover {
					text-decoration: underline;
				}
				.imageBox {
					width: 75px;
					height: 48px;
					img {
						width: 100%;
						height: 48px;
						outline: none;
					}
				}
				.contentBox {
					width: 185px;
					margin: 5px 0 5px 10px;
					font-size: 14px;
					height: 38px;
				}
				.contentBox:hover {
					color: #3B84D1;
				}
			}
		}
	}
</style>
