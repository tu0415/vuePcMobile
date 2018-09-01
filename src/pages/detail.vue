<template>
	<div class="detail clear">
		<div class="leftContent fl">
			<div class="leftBar fl">
				<left-bar
						v-on:leftType="leftTypeEvt"
						:article.sync="contentData"
						:totalRead.sync="totalVote"
						:totalInveste.sync="totalBill"
						:voteStatus.sync="voteStatus"
						:billStatus.sync="billStatus"
				></left-bar>
			</div>
			<div class="centerDetail fl" v-if="contentData.title">
				<div class="pageContent">
					<div class="title" v-html="contentData.title"></div>
					<div class="subTitle clear">
						<div class="leftImage fl">
							<img v-if="contentData.authorImgUri" :src="contentData.authorImgUri" alt=""/>
							<img v-else src="../assets/images/defaultImg.svg" alt=""/>
						</div>
						<div class="leftSub fl">
							<div class="name" @click="jumpToPersonalEvt(contentData)">{{ contentData.authorName }}</div>
							<div class="date">{{ contentData.releaseTime | formatTime }}</div>
						</div>
						<div class="rightSub fr">
							<span class="total clear"><span class="totalNumber fr">{{ contentData.cost | formatCost }}</span><i class="totalIcon fr"></i>
							</span>
							<div class="time">{{ parseInt(contentData.endTime) | formatDate }}</div>
						</div>
					</div>
          <!-- <div class="content" v-childImg v-html="contentData.content"></div> -->
					<div class="content" v-html="contentData.content"></div>
					<div class="operatorList">
						<div class="total clear">
							<span class="totalCount fl">阅读 {{ contentData.visitCnt | formatNumber }}</span>
							<a href="javascript:;" class="complaint fr" @click="complainArticleEvt(contentData)">
								<i class="icon"></i><span>内容投诉</span>
							</a>
						</div>
						<div class="tags clear">
							<template v-if="contentData.tags && contentData.tags.length">
								<template v-for="item in contentData.tags">
									<a class="tagsList fl" href="javascript:;" @click="tagArticleEvt(item)">{{ item.name }}</a>
								</template>
							</template>
						</div>
						<div class="totalList">
							<a href="javascript:;" class="totalRead" @click="showCommentEvt('vote', voteStatus)">
								<template v-if="voteStatus == '1'">
									<img src="../assets/images/vote_pre.svg"/>
								</template>
								<template v-else>
									<img src="../assets/images/vote_def.svg"/>
								</template>
								{{ totalVote }}
							</a>
							<a href="javascript:;" class="totalInveste" @click="showCommentEvt('investe', billStatus)">
								<template v-if="billStatus == '1'">
									<img src="../assets/images/invest_pre.svg"/>
								</template>
								<template v-else>
									<img src="../assets/images/investe.svg"/>
								</template>
								{{ totalBill }}
							</a>
						</div>
					</div>
				</div>
				<div class="deploy">
					<div class="deployTitle">发表评论</div>
					<div class="fillContent">
						<el-input type="textarea" :disabled="!userInfo.id" class="textArea" v-model="comment"></el-input>
						<span class="loginTips" v-if="!userInfo.id">请先<a href="javascript:;" @click="jumpToLoginEvt">登录</a>后参与评论</span>
					</div>
					<div class="deployContent clear">
						<a href="javascript:;" class="deployBtn fr" @click="deployCommentEvt">发布</a>
					</div>
				</div>
				<div class="deployList" v-if="commentData.length">
					<div class="deployListTitle">最新评论</div>
					<template v-for="item in commentData">
						<div class="deployListContent">
							<div class="deployListInfo clear">
								<div class="leftImage fl">
									<template v-if="item.criticImgUri">
										<img :src="item.criticImgUri" alt=""/>
									</template>
									<template v-else>
										<img src="../assets/images/defaultImg.svg" alt=""/>
									</template>
								</div>
								<div class="leftSub fl">
									<div class="name">{{ item.criticName }}</div>
									<div class="date">{{ item.releaseTime | formatTime }}</div>
								</div>
								<div class="rightSub fr">
									<div class="deployListInveste" @click="complainCommentEvt(item)"></div>
								</div>
							</div>
							<div class="deployListMessage">
								{{ item.content }}
							</div>
						</div>
					</template>
					<div class="pageBox">
						<el-pagination
								layout="total, prev, pager, next, jumper"
								:total="pageMap.total"
								:page-size="pageMap.pageSize"
								:current-page.sync="pageMap.pageOn"
								@current-change="getPageList(pageMap.pageOn)">
						</el-pagination>
					</div>
				</div>
			</div>
		</div>
		<div class="rightContent fr">
			<side-bar></side-bar>
		</div>
		<comment-dialog v-if="showVisible" v-on:updateBill="updateBillEvt" v-on:updateVote="updateVoteEvt"
		                :typeData.sync="leftTypeData" :dataVisible.sync="showVisible"></comment-dialog>
		<complain-dialog v-if="showComplainVisible" :complainData.sync="complainData"
		                 :dataVisible.sync="showComplainVisible"></complain-dialog>
	</div>
</template>

<script>
import { mapState } from "vuex";
import sideBar from "../components/sideBar.vue";
import leftBar from "../components/leftBar.vue";
import commentDialog from "../pages/common/commentDialog";
import complainDialog from "../pages/common/complainDialog";
import indexApi from "../api/indexApi";
import Utils from "../utils/format";

export default {
    name: "detail",
    data() {
        return {
            leftTypeData: {},
            contentData: {},
            commentData: [],
            complainData: {},
            comment: "",
            totalVote: "",
            totalBill: "",
            voteStatus: 0,
            billStatus: 0,
            showVisible: false,
            showComplainVisible: false,
            pageMap: {
                total: 0,
                pageSize: 10,
                pageOn: 1
            }
        };
    },
    computed: {
        ...mapState(["userInfo"])
    },
    mounted() {
        this.initEvt();
    },
    watch: {
        $route(to, from) {
            this.initEvt();
        }
    },
    methods: {
        isLogin() {
            let userInfo = this.userInfo;
            if (userInfo && userInfo.id) {
                return userInfo.id;
            } else {
                return "";
            }
        },
        initEvt() {
            let id = this.$route.query.id;
            let userId = this.isLogin() || 0;

            if (!id) {
                this.$showErrorMessage("文章Id不存在");
                return false;
            }

            this.getDetail({
                id: id,
                userId: userId
            });
            this.getCommentList({
                articleId: id,
                pageOn: 1
            });

            this.getStatus({
                id: id,
                userId: userId
            });
        },
        getPageList(page) {
            let id = this.$route.query.id;
            this.getCommentList({
                articleId: id,
                pageOn: page
            });
        },
        getStatus(options) {
            indexApi
                .getArticleRecord({
                    articleId: options.id,
                    userId: options.userId
                })
                .then(d => {
                    if (d.code == "0") {
                        if (d.data) {
                            this.totalVote = d.data.voteCount;
                            this.totalBill = d.data.investCount;
                            this.voteStatus = d.data.voteStatus;
                            this.billStatus = d.data.inverstStatus;
                        }
                    } else {
                        this.$showErrorMessage(d);
                    }
                })
                .catch(err => {
                    this.$showErrorMessage(err);
                });
        },
        getDetail(options) {
            indexApi
                .detailList({
                    id: options.id,
                    userId: options.userId
                })
                .then(d => {
                    if (d.code == "0") {
                        if (d.data) {
                            this.contentData = d.data;
                        }
                    } else {
                        this.$showErrorMessage(d);
                    }
                })
                .catch(err => {
                    this.$showErrorMessage(err);
                });
        },
        complainArticleEvt(data) {
            if (!this.isLogin()) {
                this.$showLoginMessage();
                return false;
            }
            this.complainData = {
                reportType: 3,
                type: 0,
                mid: this.isLogin(),
                reportId: data.id
            };
            this.showComplainVisible = true;
        },
        complainCommentEvt(data) {
            if (!this.isLogin()) {
                this.$showLoginMessage();
                return false;
            }
            this.complainData = {
                reportType: 4,
                type: 1,
                mid: this.isLogin(),
                reportId: data.id
            };
            this.showComplainVisible = true;
        },
        getCommentList(options) {
            indexApi
                .commentList({
                    articleId: options.articleId,
                    pageOn: options.pageOn,
                    pageSize: this.pageMap.pageSize
                })
                .then(d => {
                    if (d.code == "0") {
                        if (d.data && d.data.list && d.data.list.length) {
                            this.commentData.splice(0);
                            this.commentData = this.commentData.concat(
                                d.data.list
                            );
                        }
                        if (d.data) {
                            this.pageMap = Object.assign({}, this.pageMap, {
                                pageOn: d.data.pageNum,
                                total: d.data.total
                            });
                        }
                    } else {
                        this.$showErrorMessage(d.reason);
                    }
                })
                .catch(err => {
                    this.$showErrorMessage(err);
                });
        },
        tagArticleEvt(data) {
            window.open(
                location.origin +
                    "/tagArticle?tagId=" +
                    data.id +
                    "&tagName=" +
                    data.name
            );
        },
        getArticleListEvt(options, callBack) {
            indexApi
                .articleList(options)
                .then(d => {
                    callBack && callBack(d);
                })
                .catch(err => {
                    this.$showErrorMessage(err);
                });
        },
        showCommentEvt(type, status) {
            if (!this.isLogin()) {
                this.$showLoginMessage();
                return false;
            }
            if (status == 1) {
                this.$showErrorMessage("已经投过了!");
                return false;
            }
            this.leftTypeData = {
                type: type,
                userId: this.isLogin(),
                articleId: this.$route.query.id
            };
            this.showVisible = true;
        },
        leftTypeEvt(type) {
            this.showCommentEvt(type);
        },
        updateBillEvt(data) {
            this.totalBill = data.articleCost;
            this.billStatus = "1";
        },
        updateVoteEvt(data) {
            this.totalVote = data.articleTicketCnt;
            this.voteStatus = "1";
        },
        deployCommentEvt() {
            if (!this.isLogin()) {
                this.$showLoginMessage("请先登录");
                return false;
            }
            if (!this.comment) {
                this.$showErrorMessage("请输入评论内容");
                return false;
            }

            indexApi
                .commentAdd({
                    userId: this.isLogin(),
                    articleId: this.$route.query.id,
                    content: this.comment
                })
                .then(d => {
                    if (d.code == "0") {
                        this.comment = "";
                        this.$showSuccessMessage("评论成功!");
                        this.getCommentList({
                            articleId: this.$route.query.id,
                            pageOn: 1
                        });
                    } else {
                        this.$showErrorMessage(d.reason);
                    }
                })
                .catch(err => {
                    this.$showErrorMessage(err);
                });
        },
        jumpToLoginEvt() {
            this.$router.push({
                path: "login"
            });
        },
        jumpToPersonalEvt(data) {
            this.$router.push({
                name: "personalIndex",
                query: {
                    id: data.authorId
                }
            });
        }
    },
    directives: {
        childImg: {
            bind(el, binding) {
                setTimeout(function() {
                    let pWidth = 630;
                    if (el.querySelectorAll("img")) {
                        el.querySelectorAll("img").forEach(img => {
                            let width = img.width;
                            let height = img.height;
                            if (width > pWidth) {
                                img.style.width = pWidth + "px";
                                img.style.height =
                                    parseInt(height * pWidth / width) + "px";
                            } else {
                                img.style.width = img.width + "px";
                                img.style.height = img.height + "px";
                            }
                        });
                    }
                    if (el.querySelectorAll("iframe")) {
                        el.querySelectorAll("iframe").forEach(iframe => {
                            let width = iframe.offsetWidth;
                            let height = iframe.offsetHeight;
                            iframe.style.width = pWidth + "px";
                            iframe.style.height =
                                parseInt(height * pWidth / width) + "px";
                        });
                    }
                    if (el.querySelectorAll("a")) {
                        el.querySelectorAll("a").forEach(a => {
                            a.setAttribute("href", "javascript:;");
                        });
                    }
                }, 100);
            }
        }
    },
    filters: {
        formatDate(val) {
            let time = new Date().getTime();
            let valList = Math.ceil((val - time) / (24 * 60 * 60 * 1000));

            if (time >= val) {
                return "【已获得知力】";
            } else {
                return valList + "天后待获知力";
            }
        },
        formatTime(val) {
            if (!val) return val;

            return Utils.formatDate(parseInt(val), "MM-dd hh:mm");
        },
        formatNumber(val) {
            if (!val) return val;

            if (val < 1000) {
                return val;
            } else {
                return ((val + 1000) / 10000).toFixed(1) + "万";
            }
        },
        formatCost(val) {
            if (!val) {
                return val;
            } else {
                return ((val + 1000) / 10000).toFixed(2) + "万";
            }
        }
    },
    components: {
        sideBar,
        leftBar,
        commentDialog,
        complainDialog
    }
};
</script>

<style>
.fillContent textarea {
    height: 165px;
    width: 100%;
    background: #f8f8f8;
    border: 1px solid #e7e7e7;
    resize: none;
    font-size: 16px;
    color: #4a505a;
}

.content img,
.content iframe {
    margin: 5px auto 5px auto;
    border: none;
    outline: none;
    display: block;
    max-width: 100%;
}
</style>
<style lang="less" scoped>
.detail {
    margin: 0 auto;
    width: 1120px;
    padding: 80px 0;
    padding-bottom: 140px;
    .leftContent {
        width: 790px;
        .leftBar {
            width: 100px;
        }
        .centerDetail {
            width: 630px;
            margin-left: 25px;
            .pageContent {
                width: 100%;
                background: #ffffff;
                padding: 25px 15px;
                .title {
                    font-size: 24px;
                    color: #4a505a;
                    line-height: 30px;
                }
                .subTitle {
                    width: 100%;
                    padding: 20px 0;
                    border-bottom: 1px solid #e7e7e7;
                    .leftImage {
                        width: 40px;
                        height: 40px;
                        margin-right: 6px;
                        img {
                            display: block;
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                            outline: none;
                        }
                    }
                    .leftSub {
                        .name {
                            line-height: 25px;
                            text-align: left;
                            color: #4a505a;
                            font-size: 13px;
                            cursor: pointer;
                        }
                        .name:hover {
                            color: #3b84d1;
                            text-decoration: underline;
                        }
                        .date {
                            line-height: 15px;
                            text-align: left;
                            color: #939393;
                            font-size: 12px;
                        }
                    }
                    .rightSub {
                        .total {
                            line-height: 25px;
                            .totalNumber {
                                text-align: right;
                                color: #4a505a;
                                font-size: 13px;
                                margin-left: 3px;
                            }
                            .totalIcon {
                                width: 20px;
                                height: 20px;
                                display: inline-block;
                                margin-top: 2px;
                                background: url("../assets/images/copy.svg")
                                    no-repeat 0 center;
                                background-size: 100%;
                            }
                        }
                        .time {
                            line-height: 15px;
                            text-align: right;
                            color: #939393;
                            font-size: 12px;
                        }
                    }
                }
                .content {
                    width: 100%;
                    margin-top: 15px;
                    font-size: 16px;
                    color: #4a4a4a;
                    line-height: 26px;
                    word-break: break-all;
                }
                .operatorList {
                    width: 100%;
                    margin-top: 35px;
                    .total {
                        line-height: 25px;
                        .totalCount {
                            font-size: 16px;
                            color: #939393;
                            display: inline-block;
                        }
                        .complaint {
                            display: inline-block;
                            border-radius: 100px;
                            font-size: 13px;
                            background: #f5f3f3;
                            color: #4a505a;
                            height: 25px;
                            text-align: center;
                            line-height: 25px;
                            padding: 0 7px;
                            .icon {
                                float: left;
                                display: inline-block;
                                width: 17px;
                                height: 17px;
                                margin: 4px 5px 0 0;
                                background: url("../assets/images/complaint.svg")
                                    no-repeat 0 0;
                            }
                            span {
                                float: left;
                                height: 25px;
                                display: inline-block;
                            }
                        }
                    }
                    .tags {
                        margin-top: 35px;
                        width: 100%;
                        .tagsList {
                            background: #f5f3f3;
                            display: inline-block;
                            text-align: center;
                            font-size: 14px;
                            color: #4a505a;
                            margin: 0 15px 15px 0;
                            width: 85px;
                            height: 30px;
                            line-height: 30px;
                            border-radius: 15px;
                        }
                    }
                    .totalList {
                        width: 100%;
                        margin-top: 50px;
                        text-align: center;
                        .totalRead {
                            font-size: 14px;
                            color: #848994;
                            display: inline-block;
                            text-align: center;
                            cursor: pointer;
                            line-height: 25px;
                            img {
                                display: block;
                                width: 49px;
                                height: 49px;
                                border: none;
                            }
                        }
                        .totalInveste {
                            font-size: 14px;
                            color: #848994;
                            display: inline-block;
                            text-align: center;
                            cursor: pointer;
                            line-height: 25px;
                            margin-left: 15px;
                            img {
                                display: block;
                                width: 49px;
                                height: 49px;
                                border: none;
                            }
                        }
                    }
                }
            }
            .deploy {
                margin-top: 15px;
                width: 100%;
                background: #ffffff;
                padding: 25px 15px;
                .deployTitle {
                    width: 100%;
                    height: 24px;
                    line-height: 24px;
                    text-align: center;
                    font-size: 17px;
                    color: #4a505a;
                }
                .fillContent {
                    width: 100%;
                    height: 165px;
                    margin-top: 15px;
                    position: relative;
                    .loginTips {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        color: #9b9b9b;
                        font-size: 14px;
                        a {
                            padding: 0 5px;
                            color: #5670bf;
                        }
                    }
                }
                .deployContent {
                    width: 100%;
                    margin-top: 15px;
                    .deployBtn {
                        width: 60px;
                        display: block;
                        border: 1px solid #3b84d1;
                        font-size: 16px;
                        color: #3b84d1;
                        height: 30px;
                        text-align: center;
                        line-height: 30px;
                    }
                }
            }
            .deployList {
                margin-top: 15px;
                width: 100%;
                background: #ffffff;
                padding: 25px 15px;
                .deployListTitle {
                    width: 100%;
                    height: 24px;
                    line-height: 24px;
                    text-align: center;
                    font-size: 17px;
                    color: #4a505a;
                }
                .deployListContent {
                    margin-top: 15px;
                    width: 100%;
                    .deployListInfo {
                        .leftImage {
                            width: 40px;
                            height: 40px;
                            margin-right: 6px;
                            img {
                                border-radius: 50%;
                                display: block;
                                width: 100%;
                                height: 100%;
                                outline: none;
                            }
                        }
                        .leftSub {
                            .name {
                                line-height: 25px;
                                text-align: left;
                                color: #4a505a;
                                font-size: 13px;
                            }
                            .date {
                                line-height: 15px;
                                text-align: left;
                                color: #939393;
                                font-size: 12px;
                            }
                        }
                        .rightSub {
                            .deployListInveste {
                                width: 20px;
                                height: 20px;
                                background: url("../assets/images/complaint.svg")
                                    no-repeat 0 0;
                                cursor: pointer;
                            }
                        }
                    }
                    .deployListMessage {
                        padding-left: 46px;
                        line-height: 25px;
                        font-size: 16px;
                        color: #4a505a;
                        margin-top: 8px;
                        word-break: break-all;
                    }
                }
                .pageBox {
                    text-align: right;
                    margin-top: 15px;
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
