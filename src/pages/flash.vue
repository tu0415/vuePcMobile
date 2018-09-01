<template>
	<div class="flash clear">
		<div class="leftContent fl">
			<template v-for="item in flashContent">
				<div class="flashList">
					<div class="title">{{ item.time }} {{ item.time | formatDay }}</div>
					<div class="list">
						<template v-for="itemList in item.list">
							<div class="listContent clear">
								<div class="time fl">{{ itemList.releaseTime | formatDate }}</div>
								<div class="iconCircle fl"></div>
								<div class="iconLine"></div>
								<div class="content fl"><span class="listTitle">[{{ itemList.title }}]</span> {{ itemList.content }}</div>
							</div>
						</template>
					</div>
				</div>
			</template>
		</div>
		<div class="rightContent fr">
			<side-bar></side-bar>
		</div>
	</div>
</template>

<script>
	import sideBar from '../components/sideBar.vue'
	import indexApi from '../api/indexApi'
	import Utils from '../utils/format'

	export default {
		name: "flash",
		data() {
			return {
				flashContent: [],
				pageMap: {
					pageOn: 1,
					pageSize: 20
				}
			}
		},
		mounted() {
			this.getList();
		},
		methods: {
			getList() {
				indexApi.flashList({
					searchTime: Utils.formatDate(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss')
				}).then(d => {
					if (d.code == "0") {
						if (d.data) {
							this.flashContent.splice(0);
							if (d.data.list && d.data.list.length) {
								this.flashContent.push({
									time: Utils.formatDate((new Date(d.data.searchTime)).getTime(), 'yyyy-MM-dd'),
									list: d.data.list
								})
							}
							if (d.data.beforeDateList && d.data.beforeDateList.length) {
								this.flashContent.push({
									time: Utils.formatDate((new Date(d.data.searchTime).getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
									list: d.data.beforeDateList
								})
							}
						}
					} else {
						this.$showErrorMessage(d.reason)
					}
				}).catch(err => {
					this.$showErrorMessage(err)
				})
			}
		},
		filters: {
			formatDate(val) {
				if (!val) return false;

				return Utils.formatDate(parseInt(val), 'hh:mm:ss')
			},
			formatDay(val) {
				if (!val) return false;

				let day = (new Date(val)).getDay();
				let weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

				return weeks[day]
			}
		},
		components: {
			sideBar
		}
	}
</script>

<style lang="less" scoped>
	.flash {
		margin: 0 auto;
		width: 1120px;
		padding: 80px 0;
    padding-bottom: 140px;
		.leftContent {
			width: 790px;
			background: #fff;
			.flashList {
				width: 100%;
				.title {
					padding: 0 20px;
					background: #F7F7F7;
					height: 30px;
					line-height: 30px;
					font-size: 15px;
					color: #888888;
				}
				.list {
					padding: 25px 20px;
					background: #ffffff;
					.listContent {
						position: relative;
						width: 100%;
						height: 100%;
						display: flex;
						display: -webkit-flex;
						padding-bottom: 30px;
						.time {
							width: 50px;
							font-size: 12px;
							color: #888888;
							line-height: 25px;
						}
						.content {
							font-size: 16px;
							color: #4A505A;
							line-height: 25px;
							flex: 1;
							-webkit-flex: 1;
							.listTitle{
								display: inline-block;
								font-weight: bold;
							}
						}
						.iconCircle {
							border: 1px solid rgba(160, 160, 168, 0.35);
							border-radius: 100px;
							width: 7px;
							height: 7px;
							margin: 8px 12px 0 10px;
							background: #ffffff;
						}
						.iconLine {
							display: block;
							position: absolute;
							left: 64px;
							top: 16px;
							height: 100%;
							border-right: 1px solid rgba(160, 160, 168, 0.35);;
							content: ' ';
						}
					}
					.listContent:last-child {
						.iconLine {
							display: none;
							padding-bottom: 0;
						}
					}
				}
			}
		}
		.rightContent {
			width: 310px;
			background: #fff;
		}
	}
</style>
