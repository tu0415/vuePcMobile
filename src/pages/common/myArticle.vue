<template>
	<div class="list">
		<div class="title">我的文章</div>
		<div class="tabList">
			<template v-for="item in targetList">
				<a href="javascript:;" @click="changeTargetEvt(item)" class="target"
				   :class="{ active : item.isActive }">{{ item.name }}</a>
			</template>
		</div>
		<div class="table" v-loading="loadingTable">
			<el-table :data="tableData" style="width: 100%">
				<el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
				<el-table-column align="center" label="标题">
					<template slot-scope="scope">
						<div class="tableTitle" @click="jumpToDetail(scope.row)">{{ scope.row.title }}</div>
					</template>
				</el-table-column>
				<el-table-column align="center" label="浏览量" width="70">
					<template slot-scope="scope">
						<div v-if="scope.row.status == 1">{{ scope.row.visitCnt }}</div>
						<div v-else>-</div>
					</template>
				</el-table-column>
				<el-table-column prop="commentCnt" align="center" label="评论" width="70">
					<template slot-scope="scope">
						<div v-if="scope.row.status == 1">{{ scope.row.commentCnt }}</div>
						<div v-else>-</div>
					</template>
				</el-table-column>
				<el-table-column prop="ticketCnt" align="center" label="投票数" width="70">
					<template slot-scope="scope">
						<div v-if="scope.row.status == 1">{{ scope.row.ticketCnt }}</div>
						<div v-else>-</div>
					</template>
				</el-table-column>
				<el-table-column prop="cost" align="center" label="助力" width="90">
					<template slot-scope="scope">
						<div v-if="scope.row.status == 1">{{ scope.row.cost }}</div>
						<div v-else>-</div>
					</template>
				</el-table-column>
				<el-table-column align="center" label="状态" width="70">
					<template slot-scope="scope">
						<div v-if="scope.row.status == 1">已发布</div>
						<div v-if="scope.row.status == 2" class="orange">待审核</div>
						<div v-if="scope.row.status == 3" class="red">未通过</div>
						<div v-if="scope.row.status == 4" class="edit">草稿</div>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<div v-if="scope.row.status == 1 && scope.row.releaseTime > new Date().getTime() - 6 * 60 * 60 * 1000">
              <a href="javascript:;" class="edit" @click="editArticleEvt(scope.row)">再次编辑</a>
            </div>
						<div v-if="scope.row.status == 2">-</div>
						<div v-if="scope.row.status == 3">
							<a href="javascript:;" class="delete" @click="deleteArticleEvt(scope.row)">删除</a>
						</div>
						<div v-if="scope.row.status == 4">
							<a href="javascript:;" class="edit" @click="editArticleEvt(scope.row)">编辑</a>
							<a href="javascript:;" class="delete" @click="deleteArticleEvt(scope.row)">删除</a>
						</div>
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
	import {mapState} from 'vuex'

	export default {
		name: "myArticle",
		data() {
			return {
				type: '0',
				pageMap: {
					pageOn: 1,
					pageSize: 10,
					total: 0
				},
				targetList: [{
					id: '0',
					isActive: true,
					type: '0',
					name: '全部'
				}, {
					id: '1',
					isActive: false,
					type: '1',
					name: '已发布'
				}, {
					id: '2',
					isActive: false,
					type: '2',
					name: '待审核'
				}, {
					id: '3',
					isActive: false,
					type: '3',
					name: '未通过'
				}, {
					id: '4',
					isActive: false,
					type: '4',
					name: '草稿'
				}],
				tableData: [],
				loadingTable: false
			}
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		mounted() {
			this.getList(1, this.type)
		},
		methods: {
			getList(data, type) {
				this.loadingTable = true;
				indexApi.getArticleList({
					findStatus: type,
					authorId: this.userInfo.id,
					userId: this.userInfo.id,
					pageSize: this.pageMap.pageSize,
					pageOn: data || this.pageMap.pageOn
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
				this.targetList.forEach(item => {
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
			deleteArticleEvt(data) {
				indexApi.deleteArticle({
					articleId: data.id,
					userId: this.userInfo.id
				}).then(d => {
					this.loadingTable = false;
					if (d.code == '0') {
						this.$showSuccessMessage('删除文章成功!')
						this.getList(1, this.type)
					} else {
						this.$showErrorMessage(d.reason)
					}
				}).catch(err => {
					this.$showErrorMessage(err)
				})
			},
			editArticleEvt(data) {
				this.$router.push({
					name: 'publishArticle',
					query: {
						id: data.id
					}
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
			a {
				display: inline-block;
				font-size: 12px;
			}
			.tableTitle {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				height: 23px;
				cursor: pointer;
			}
			.delete {
				color: #002000;
			}
			.edit {
				color: #3B84D1;
			}
			.orange{
				color: #FE8E20;
			}
			.red{
				color: #FC3D19;
			}
			.pageBox {
				margin-top: 20px;
				text-align: right;
			}
		}
	}
</style>
