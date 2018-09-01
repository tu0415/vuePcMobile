<template>
	<div class="list">
		<div class="title">浏览历史</div>
		<div class="table" v-loading="loadingTable">
			<el-table :data="tableData" style="width: 100%">
				<el-table-column align="center" label="封面" width="95">
					<template slot-scope="scope">
						<img v-if="scope.row.imgUri" style="width: 75px;height: 40px" :src="scope.row.imgUri" alt=""/>
					</template>
				</el-table-column>
				<el-table-column align="center" label="标题">
					<template slot-scope="scope">
						<div class="tableTitle" @click="jumpToDetail(scope.row)">{{ scope.row.title }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="visitCnt" align="center" label="浏览量"></el-table-column>
				<el-table-column prop="commentCnt" align="center" label="评论"></el-table-column>
				<el-table-column prop="ticketCnt" align="center" label="投票数"></el-table-column>
				<el-table-column prop="cost" align="center" label="助力"></el-table-column>
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
		name: "lookHistory",
		data() {
			return {
				tableData: [],
				pageMap: {
					pageOn: 1,
					pageSize: 10,
					total: 0
				},
				loadingTable: false
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
			getList(data) {
				this.loadingTable = true;
				indexApi.browseHistory({
					userId: this.userInfo.id,
					pageSize: this.pageMap.pageSize,
					pageOn: data || this.pageMap.pageOn
				}).then(d => {
					this.loadingTable = false;
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
					this.loadingTable = false;
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
			.tableTitle {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				height: 23px;
				cursor: pointer;
			}
			.pageBox {
				margin-top: 20px;
				text-align: right;
			}
		}
	}
</style>
