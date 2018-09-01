<template>
	<div class="list">
		<div class="title">余额 <span class="fr countCost" v-show="!auditor">账户价值: <em class="countNumber">{{ walletData.cost }}</em></span>
		</div>
		<div class="contentList">
			<div class="totalCount">{{ walletData.bill }}</div>
			<div class="reward clear">
				<div class="rewardList fl">
					<div class="rewardListNumber">{{ walletData.authorReward | formatCost }}</div>
					<div class="rewardListText">作者奖励</div>
				</div>
				<div class="rewardList fl">
					<div class="rewardListNumber">{{ walletData.investReward | formatCost }}</div>
					<div class="rewardListText">助力回报</div>
				</div>
				<div class="rewardList fl">
					<div class="rewardListNumber">{{ walletData.otherReward | formatCost }}</div>
					<div class="rewardListText">其他奖励</div>
				</div>
			</div>
			<div class="targetList">
				<template v-for="item in targetArray">
					<a href="javascript:;" @click="changeTargetEvt(item)" class="tags" :class="{ active : item.isActive }">{{ item.name }}</a>
				</template>
			</div>
			<div class="table" v-loading="loadingTable">
				<el-table :data="tableData" style="width: 100%">
					<el-table-column align="center" label="封面" width="95">
						<template slot-scope="scope">
							<img v-if="scope.row.articleImage" style="width: 75px;height: 40px" :src="scope.row.articleImage" alt=""/>
						</template>
					</el-table-column>
					<el-table-column align="center" label="标题">
						<template slot-scope="scope">
							<div class="tableTitle" @click="jumpToDetail(scope.row)">{{ scope.row.articleTile }}</div>
						</template>
					</el-table-column>
					<el-table-column align="center" label="类别">
						<template slot-scope="scope">
							{{ scope.row.type | formatType }}
						</template>
					</el-table-column>
					<el-table-column align="left" label="对象" width="150">
						<template slot-scope="scope">
							<img v-if="scope.row.authorImage" style="width: 32px;height: 32px;border-radius: 50%;" :src="scope.row.authorImage" alt=""/>
							<span class="authorName">{{ scope.row.authorName }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="bill" align="center" label="金额">
						<template slot-scope="scope">
							<div v-if="type == '1'" class="blue">{{ scope.row.bill }}</div>
							<div v-if="type == '2'" class="orange">{{ scope.row.bill }}</div>
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
	import indexApi from "../../api/indexApi";
	import Utils from '../../utils/format'
	import {mapState} from 'vuex'

	export default {
		name: "balance",
		data() {
			return {
				tableData: [],
				targetArray: [{
					id: '1',
					name: '支出',
					isActive: true,
					type: '1'
				}, {
					id: '2',
					name: '收入',
					isActive: false,
					type: '2'
				}],
				type: '1',
				walletData: {
					authorReward: '',
					investReward: '',
					otherReward: '',
					cost: ''
				},
				pageMap: {
					pageOn: 1,
					pageSize: 10,
					total: 0
				},
				loadingTable: false,
        auditor:true
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
			},
			formatType(val) {
				if (!val) return false;
				switch (val) {
					case '00':
						return '助力支出';
          case '01':
            return '兑换邀请码';
          case '02':
            return '提币支出';
					case '10':
						return '注册奖励';
					case '11':
						return '签到奖励';
					case '12':
						return '审核奖励';
					case '13':
						return '文章收益';
					case '14':
						return '助力回报';
					case '15':
						return '分享奖励';
					case '16':
						return '邀请奖励';
          case '17':
            return '文章保底收益';
          case '20':
            return '文章删除退款';
				}
			},
      formatCost(val){
        if (!val){
          return val;
        }else{
          return ((val + 1000) / 10000).toFixed(2) + '万';
        }
      }
		},
		mounted() {
			this.getWalletData();
			this.getList(1, this.type);
			if(this.userInfo.id != 19){
			  this.auditor = false;
      }
		},
		methods: {
			getList(data, type) {
				this.loadingTable = true
				indexApi.getWalletFlow({
					type: type,
					userId: this.userInfo.id,
					pageOn: data || this.pageMap.pageOn,
					pageSize: this.pageMap.pageSize
				}).then(d => {
					this.loadingTable = false
					if (d.code == "0") {
						if (d.data && d.data.list && d.data.list.length) {
							this.tableData.splice(0)
							this.tableData = this.tableData.concat(d.data.list);
						} else {
							this.tableData.splice(0)
						}

						if (d.data) {
							this.pageMap.total = d.data.total
						}
					}
				}).catch(err => {
					this.loadingTable = false
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
			getWalletData() {
				indexApi.getWalletInfo({
					userId: this.userInfo.id
				}).then(d => {
					if (d.code == '0') {
						if (d.data) {
							this.walletData = Object.assign({}, d.data)
						}
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
			.countCost {
				font-size: 16px;
				color: #4A505A;
				.countNumber {
					color: #FE8E20;
					font-style: normal;
				}
			}
		}
		.contentList {
			margin-top: 20px;
			.totalCount {
				line-height: 50px;
				font-size: 36px;
				color: #4A505A;
			}
			.reward {
				margin-top: 20px;
				.rewardList {
					height: 50px;
					padding: 10px 18px;
					border: 1px solid #4A505A;
					border-radius: 5px;
					margin-right: 15px;
					.rewardListNumber {
						font-size: 20px;
						color: #4A505A;
						line-height: 28px;
						text-align: center;
					}
					.rewardListText {
						font-size: 14px;
						color: #939393;
						text-align: center;
						line-height: 20px;
					}
				}
			}
			.targetList {
				margin-top: 30px;
				.tags {
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
				.tags.active {
					background: #3B84D1;
					color: #FFFFFF;
					border: none;
					height: 30px;
					line-height: 30px;
				}
			}
			.table {
				margin-top: 20px;
				.orange{
					color: #FE8E20;
				}
				.blue{
					color: #3B84D1;
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
