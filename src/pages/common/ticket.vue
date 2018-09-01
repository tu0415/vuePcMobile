<template>
	<div class="list">
		<div class="title">知票</div>
		<div class="contentList">
			<div class="totalTicket">{{ userVote }}票</div>
			<div class="table">
				<el-table :data="tableData" style="width: 100%">
					<el-table-column align="center" width="95" label="封面">
						<template slot-scope="scope">
							<img v-if="scope.row.imgUri" style="width: 75px;height: 40px" :src="scope.row.imgUri" alt=""/>
						</template>
					</el-table-column>
					<el-table-column align="center" label="标题">
						<template slot-scope="scope">
							<div class="tableTitle" @click="jumpToDetail(scope.row)">{{ scope.row.title }}</div>
						</template>
					</el-table-column>
					<el-table-column align="left" label="对象" width="150">
						<template slot-scope="scope">
							<img v-if="scope.row.authorImgUri" style="width: 32px;height: 32px;border-radius: 50%;" :src="scope.row.authorImgUri" alt=""/>
							<span class="authorName">{{ scope.row.authorName }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="vote" align="center" label="票数">
						<template slot-scope="scope">
							<div class="orange">{{ scope.row.vote }}</div>
						</template>
					</el-table-column>
					<el-table-column align="center" label="时间">
						<template slot-scope="scope">
							{{ scope.row.ctime | formatTime }}
						</template>
					</el-table-column>
				</el-table>

				<div class="pageBox" v-if="tableData.length">
					<el-pagination
							layout="total, prev, pager, next, jumper"
							:total="pageMap.total"
							:page-size="pageMap.pageSize"
							:current-page.sync="pageMap.pageOn"
							@current-change="getList(pageMap.pageOn, type)">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import indexApi from '../../api/indexApi'
	import Utils from '../../utils/format'
	import {mapState} from 'vuex'

	export default {
		name: "ticket",
		data() {
			return {
				tableData: [],
				userVote: '',
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
		filters: {
			formatTime(val) {
				if (!val) return false;
				return Utils.formatDate(val, 'yyyy-MM-dd hh:mm:ss')
			}
		},
		mounted() {
			this.getList(1)
		},
		methods: {
			getList(options) {
				indexApi.getLogList({
					pageOn: options || this.pageMap.pageOn,
					pageSize: this.pageMap.pageSize,
					userId: this.userInfo.id
				}).then(d => {
					if (d.code == '0') {
						this.userVote = d.data.userVote;
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
		.contentList {
			margin-top: 20px;
			.totalTicket {
				line-height: 50px;
				font-size: 36px;
				color: #4A505A;
			}
			.table {
				margin-top: 20px;
				.orange{
					color: #FE8E20;
				}
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
				.authorName {
					line-height: 32px;
				}
			}
		}
	}
</style>
