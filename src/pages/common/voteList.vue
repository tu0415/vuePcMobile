<template>
	<div class="list">
		<div class="title">投票</div>
		<div class="tabList">
			<template v-for="item in targetArray">
				<a href="javascript:;" @click="changeTargetEvt(item)" class="target" :class="{ active : item.isActive }">{{ item.name }}</a>
			</template>
		</div>
		<div class="table" v-loading="loadingTable">
			<el-table :data="tableData" style="width: 100%">
				<el-table-column align="center" width="95" label="封面">
					<template slot-scope="scope">
						<img v-if="scope.row.articleImgUrl" style="width: 75px;height: 40px" :src="scope.row.articleImgUrl" alt=""/>
					</template>
				</el-table-column>
				<el-table-column align="center" label="标题">
					<template slot-scope="scope">
						<div class="tableTitle" @click="jumpToDetail(scope.row)">{{ scope.row.articleTitle }}</div>
					</template>
				</el-table-column>
				<el-table-column v-if="type == '1'" label="投票者" align="left" width="150">
					<template slot-scope="scope">
						<img v-if="scope.row.criticImgUrl" style="width: 32px;height: 32px;border-radius: 50%;" :src="scope.row.criticImgUrl" alt=""/>
						<span class="authorName">{{ scope.row.criticName }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="投票数">
					<template slot-scope="scope">
						<div v-if="scope.row.msgContent"><span class="blue">{{ scope.row.msgContent }}</span>票</div>
					</template>
				</el-table-column>
				<el-table-column align="center" label="投票时间">
					<template slot-scope="scope">
						{{ scope.row.releaseTime | formatTime }}
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
</template>

<script>
	import indexApi from "../../api/indexApi";
	import Utils from '../../utils/format'
	import {mapState} from 'vuex'

	export default {
		name: "voteList",
		data() {
			return {
				targetArray: [{
					id: '0',
					isActive: true,
					name: '我投出的',
					type: '0'
				}, {
					id: '1',
					isActive: false,
					name: '我收到的',
					type: '1'
				}],
				type: '0',
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
			this.getList(1, this.type)
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
			getList(page, type) {
				this.loadingTable = true;
				indexApi.getMessageList({
          pageOn: page || this.pageMap.pageOn,
					pageSize: this.pageMap.pageSize,
					type: 2,
					actionType: type,
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
			},
			changeTargetEvt(data) {
				this.targetArray.forEach(item => {
					if (item.id == data.id) {
						item.isActive = true;
						this.type = data.type;
						this.pageMap = {
							pageOn: 1,
							pageSize: 10,
							total: 0
						};
						this.getList(1, data.type);
					} else {
						item.isActive = false;
					}
				})
			},
			jumpToDetail(data) {
				if (!data.id) return false;

				this.$router.push({
					name: "detail",
					query: {
						id: data.articleId
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
		.tabList {
			padding: 20px 0 0 0;
			.target {
				display: inline-block;
				font-size: 14px;
				color: #4A505A;
				text-align: center;
				height: 28px;
				line-height: 28px;
				width: 70px;
				border: 1px solid #4A505A;
				border-radius: 3px;
				margin-right: 20px;
			}
			.target.active {
				background: #3B84D1;
				color: #FFFFFF;
				border: none;
				height: 30px;
				line-height: 30px;
			}
		}
		.table {
			margin-top: 20px;
			.blue{
				color: #3B84D1;
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
			.authorName {
				line-height: 32px;
			}
		}
	}
</style>
