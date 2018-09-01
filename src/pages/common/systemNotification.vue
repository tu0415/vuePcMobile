<template>
	<div class="list">
		<div class="title">评论</div>
		<div class="table" v-loading="loadingTable">
			<el-table :data="tableData" style="width: 100%">
				<el-table-column align="left" label="内容">
					<template slot-scope="scope">
						<div class="tableTitle">{{ scope.row.msgContent }}</div>
					</template>
				</el-table-column>
				<el-table-column align="center" label="助力时间">
					<template slot-scope="scope">
						{{ scope.row.releaseTime | formatTime }}
					</template>
				</el-table-column>
				<el-table-column label="操作" type="expand">
					<template slot-scope="scope">
						<div class="detail">{{ scope.row.msgContent }}</div>
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
	import indexApi from "../../api/indexApi";
	import Utils from '../../utils/format'
	import {mapState} from 'vuex'

	export default {
		name: "systemNotificationList",
		data() {
			return {
				tableData: [],
				loadingTable: false,
				pageMap: {
					pageOn: 1,
					pageSize: 10,
					total: 0
				}
			}
		},
		mounted() {
			this.getList(1)
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
		methods: {
			getList(page) {
				this.loadingTable = true;
				indexApi.getMessageList({
          pageOn: page || this.pageMap.pageOn,
					pageSize: this.pageMap.pageSize,
					type: 0,
					userId: this.userInfo.id
				}).then(d => {
					this.loadingTable = false;
					if (d.code == '0') {
						if (d.data && d.data.list && d.data.list.length) {
							this.tableData.splice(0)
							this.tableData = this.tableData.concat(d.data.list);
						} else {
							this.tableData.splice(0)
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
			.detail {
				text-align: center;
			}
			.pageBox {
				margin-top: 20px;
				text-align: right;
			}
			.tableTitle {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				height: 23px;
				cursor: pointer;
			}
		}
	}
</style>
