<template>
	<div class="list">
		<div class="title">审查文章</div>
		<div class="table">
			<el-table :data="tableData" style="width: 100%">
				<el-table-column align="center" width="140" label="封面">
					<template slot-scope="scope">
						<img v-if="scope.row.imgUrl" style="width: 120px;height: 48px" :src="scope.row.imgUrl" alt=""/>
					</template>
				</el-table-column>
				<el-table-column align="center" label="标题">
					<template slot-scope="scope">
						<div class="tableTitle" @click="jumpToDetail(scope.row)">{{ scope.row.title }}</div>
					</template>
				</el-table-column>
				<el-table-column align="center" label="标记状态">
					<template slot-scope="scope">
						<div class="check" v-if="scope.row.status == '0'">未审查</div>
						<div class="through" v-if="scope.row.status == '1'">通过</div>
						<div class="unthrough" v-if="scope.row.status == '2'">不通过</div>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<div class="flag" v-if="scope.row.status == '0'" @click="checkArticleEvt(scope.row)">标记</div>
						<div v-else>-</div>
					</template>
				</el-table-column>
			</el-table>
			<div class="pageBox" v-if="tableData.length">
				<el-pagination
						layout="total, prev, pager, next, jumper"
						:total="pageMap.total"
						:page-size="pageMap.pageSize"
						:current-page.sync="pageMap.pageOn"
						@current-change="getList(pageMap.pageOn)">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import indexApi from '../../api/indexApi'
	import {mapState} from 'vuex'

	export default {
		name: "censorship",
		data() {
			return {
				tableData: [],
				pageMap: {
					pageOn: 1,
					pageSize: 10,
					total: 0
				}
			}
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		mounted() {
			this.getList(1)
		},
		methods: {
			checkArticleEvt(data) {
				this.$router.push({
					name: 'checkArticle',
					query: {
						articleId: data.articleId,
						id: data.id
					}
				})
			},
			getList(options) {
				indexApi.approveArticleList({
					pageOn: options || this.pageMap.pageOn,
					pageSize: this.pageMap.pageSize,
					userId: this.userInfo.id
				}).then(d => {
					if (d.code == '0') {
						if (d.data && d.data.list && d.data.list.length) {
							this.tableData.splice(0);
							this.tableData = this.tableData.concat(d.data.list);
						}
						if (d.data) {
							this.pageMap.total = d.data.total
						}
					} else {
						this.$showErrorMessage(d.reason)
					}
				}).catch(err => {
					this.$showErrorMessage(err)
				})
			},
			jumpToDetail(data) {
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
	.list {
		width: 100%;
		.title {
			width: 100%;
			font-size: 20px;
			color: #4A505A;
			padding-bottom: 20px;
			border-bottom: 1px solid #E7E7E7;
		}
		.table {
			margin-top: 20px;
			a {
				font-size: 12px;
			}
			.tableTitle {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				height: 23px;
				cursor: pointer;
			}
			.flag {
				cursor: pointer;
				color: #3B84D1;
				display: block
			}
			.check {
				color: #FC3D19;
			}
			.through {
				color: #4A505A;
			}
			.unthrough {
				color: #FE8E20;
			}
			.pageBox {
				margin-top: 20px;
				text-align: right;
			}
		}
	}
</style>
