<template>
  <div id="content">
    <div data-v-e458b9ac="" class="main view">
      <div data-v-e458b9ac="">
        <div data-v-e458b9ac="" class="title">
          三两知用户使用手册
        </div>
        <div data-v-e458b9ac="" class="second_title">
          <div data-v-e458b9ac="" class="imageBox">
            <img data-v-e458b9ac="" src="http://img.5kwords.com/forum/11/0/e3439f27359549628b6c1597daa727b8.png" alt="" class="icon_tx" />
          </div>
          <div data-v-e458b9ac="" class="contentBox">
            <div data-v-e458b9ac="" class="author">
              三两知-漫画
            </div>
            <div data-v-e458b9ac="" class="sortDate">
              08-23 11:22
            </div>
          </div>
          <div data-v-e458b9ac="" class="resultBox">
            <span data-v-e458b9ac="" class="totalIncome clear"><span data-v-e458b9ac="" class="copyText">47246.48</span><i data-v-e458b9ac="" class="copyIcon"></i></span>
            <div data-v-e458b9ac="" class="sorttime">
              4天后待获知力
            </div>
          </div>
        </div>
        <div data-v-e458b9ac="" class="content g-article-content">
          <p><img src="http://img.5kwords.com/forum/11/1/74e3074fd449421291cf47b109fef94b.jpg" /></p>
        </div>
        <div data-v-e458b9ac="" class="bottom clear">
          <span data-v-e458b9ac="" class="read float-left">阅读 236</span>
          <span data-v-e458b9ac="" class="comlaint float-right"><img data-v-e458b9ac="" src="../../assets/images/comlaint.svg" alt="" /><span data-v-e458b9ac="">内容投诉</span></span>
        </div>
        <div data-v-e458b9ac="" class="tags clear">
          <span data-v-e458b9ac="" class="float-left">链圈</span>
          <span data-v-e458b9ac="" class="float-left">币圈</span>
          <span data-v-e458b9ac="" class="float-left">区块链应用</span>
          <span data-v-e458b9ac="" class="float-left">区块链创业</span>
          <span data-v-e458b9ac="" class="float-left">区块链</span>
          <span data-v-e458b9ac="" class="float-left">三两知</span>
        </div>
        <div data-v-e458b9ac="" class="down_load">
          <div data-v-e458b9ac="" class="left">
            <div data-v-e458b9ac="" class="logo"></div>
          </div>
          <div data-v-e458b9ac="" class="down_btn">
            立即打开
          </div>
        </div>
      </div>
      <!---->
      <!---->
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import indexApi from '../../api/indexApi'
  import Utils from '../../utils/format'

  export default {
    name: "detail",
    data() {
      return {
        leftTypeData: {},
        contentData: {},
        commentData: [],
        complainData: {},
        comment: '',
        totalVote: '',
        totalBill: '',
        voteStatus: 0,
        billStatus: 0,
        showVisible: false,
        showComplainVisible: false,
        pageMap: {
          total: 0,
          pageSize: 10,
          pageOn: 1
        }
      }
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    mounted() {
      document.querySelector("html").style.fontSize =
        window.screen.height / 3 + "px";
      indexApi.getVerifyJsUrl().then(d => {
        if (d.code == '0') {
          this.creatScript(d.data.url);
        }else{
          this.$showErrorMessage(d.reason);
        }
      }).catch(err => {
        this.$showErrorMessage(err)
      });
    },
    methods: {
      isLogin() {
        let userInfo = this.userInfo;
        if (userInfo && userInfo.id) {
          return userInfo.id
        } else {
          return ''
        }
      },
      initEvt() {
        let id = this.$route.query.id;
        let userId = this.isLogin() || 0;

        if(!id){
          this.$showErrorMessage('文章Id不存在');
          return false
        }

        this.getDetail({
          id: id,
          userId: userId
        })
        this.getCommentList({
          articleId: id,
          pageOn: 1
        });

        this.getStatus({
          id: id,
          userId: userId
        });
      },
      getPageList(page){
        let id = this.$route.query.id;
        this.getCommentList({
          articleId: id,
          pageOn: page
        });
      },
      getStatus(options) {
        indexApi.getArticleRecord({
          articleId: options.id,
          userId: options.userId
        }).then(d => {
          if (d.code == "0") {
            if (d.data) {
              this.totalVote = d.data.voteCount;
              this.totalBill = d.data.investCount;
              this.voteStatus = d.data.voteStatus;
              this.billStatus = d.data.inverstStatus;
            }
          } else {
            this.$showErrorMessage(d)
          }
        }).catch(err => {
          this.$showErrorMessage(err)
        })
      },
      getDetail(options) {
        indexApi.detailList({
          id: options.id,
          userId: options.userId
        }).then(d => {
          if (d.code == "0") {
            if (d.data) {
              this.contentData = d.data
            }
          } else {
            this.$showErrorMessage(d)
          }
        }).catch(err => {
          this.$showErrorMessage(err)
        })
      },
      complainArticleEvt(data) {
        if (!this.isLogin()) {
          this.$showLoginMessage()
          return false
        }
        this.complainData = {
          reportType: 3,
          type: 0,
          mid: this.isLogin(),
          reportId: data.id,
        }
        this.showComplainVisible = true
      },
      complainCommentEvt(data) {
        if (!this.isLogin()) {
          this.$showLoginMessage()
          return false
        }
        this.complainData = {
          reportType: 4,
          type: 1,
          mid: this.isLogin(),
          reportId: data.id,
        }
        this.showComplainVisible = true
      },
      getCommentList(options) {
        indexApi.commentList({
          articleId: options.articleId,
          pageOn: options.pageOn,
          pageSize: this.pageMap.pageSize
        }).then(d => {
          if (d.code == "0") {
            if (d.data && d.data.list && d.data.list.length) {
              this.commentData.splice(0)
              this.commentData = this.commentData.concat(d.data.list)
            }
            if(d.data){
              this.pageMap = Object.assign({}, this.pageMap, {
                pageOn: d.data.pageNum,
                total: d.data.total
              })
            }
          } else {
            this.$showErrorMessage(d.reason)
          }
        }).catch(err => {
          this.$showErrorMessage(err)
        })
      },
      tagArticleEvt(data) {
        window.open(location.origin + '/tagArticle?tagId=' + data.id + '&tagName=' + data.name);
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
      showCommentEvt(type, status) {
        if (!this.isLogin()) {
          this.$showLoginMessage()
          return false
        }
        if (status == 1) {
          this.$showErrorMessage('已经投过了!')
          return false;
        }
        this.leftTypeData = {
          type: type,
          userId: this.isLogin(),
          articleId: this.$route.query.id
        };
        this.showVisible = true
      },
      leftTypeEvt(type) {
        this.showCommentEvt(type);
      },
      updateBillEvt(data) {
        this.totalBill = data.articleCost;
        this.billStatus = '1';
      },
      updateVoteEvt(data) {
        this.totalVote = data.articleTicketCnt;
        this.voteStatus = '1';
      },
      deployCommentEvt() {
        if (!this.isLogin()) {
          this.$showLoginMessage('请先登录')
          return false
        }
        if (!this.comment) {
          this.$showErrorMessage('请输入评论内容');
          return false
        }

        indexApi.commentAdd({
          userId: this.isLogin(),
          articleId: this.$route.query.id,
          content: this.comment
        }).then(d => {
          if (d.code == "0") {
            this.comment = '';
            this.$showSuccessMessage('评论成功!');
            this.getCommentList({
              articleId: this.$route.query.id,
              pageOn: 1
            });
          } else {
            this.$showErrorMessage(d.reason)
          }
        }).catch(err => {
          this.$showErrorMessage(err)
        })
      },
      jumpToLoginEvt() {
        this.$router.push({
          path: 'login'
        })
      },
      jumpToPersonalEvt(data) {
        this.$router.push({
          name: 'personalIndex',
          query: {
            id: data.authorId
          }
        })
      }
    },
  }
</script>

<style>
  *, :after, :before {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  #content {
    overflow: hidden;
  }
  div {
    display: block;
  }
  .clear {
    zoom: 1;
  }
  .main .title[data-v-e458b9ac] {
    margin: .15rem .2rem 0;
    text-align: left;
    font-size: .22rem;
    color: #4a505a;
    letter-spacing: .016rem;
    font-weight: 600;
    word-break: break-all;
  }
  .main .second_title[data-v-e458b9ac] {
    margin: .21rem .2rem 0;
    text-align: left;
    diaplay: flex;
    display: -webkit-flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
  .main .second_title .resultBox .totalIncome .copyIcon[data-v-e458b9ac] {
    height: .16rem;
    width: .16rem;
    display: inline-block;
    background: url(../../assets/images/copy.svg) no-repeat 50%;
    background-size: 100%;
    float: right;
  }
  .main .content[data-v-e458b9ac] {
    width: 100%;
    padding: .2rem .2rem 0;
    font-size: .16rem;
    color: #4a505a;
    letter-spacing: .012rem;
    line-height: .3rem;
    word-break: break-all;
    font-weight: 400;
    font-family: Arial,Helvetica,sans-serif;
  }
  .main .bottom[data-v-e458b9ac] {
    padding: .3rem .2rem .16rem;
  }
  .main .tags[data-v-e458b9ac] {
    padding: .16rem .2rem .7rem;
    text-align: left;
    font-size: .14rem;
    color: #4a505a;
    letter-spacing: 1px;
    box-sizing: border-box;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }
  .main .down_load[data-v-e458b9ac] {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: .52rem;
    background: url(../../assets/images/bottom_bg.png) no-repeat 50%;
    background-size: 100% 100%;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }
  .main .down_load .left[data-v-e458b9ac] {
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
  }
  .main .down_load .left .logo[data-v-e458b9ac] {
    margin-left: .15rem;
    margin-right: .05rem;
    width: 2.4rem;
    height: .4rem;
    background: url(../../assets/images/share_logo.svg) no-repeat 50%;
    background-size: 100% 100%;
  }
  .main .down_load .down_btn[data-v-e458b9ac] {
    width: .9rem;
    height: .28rem;
    border-radius: .2rem;
    background: #fff;
    color: #1e1e1e;
    text-align: center;
    line-height: .28rem;
    margin-right: .15rem;
    font-size: .12rem;
  }
  .main .second_title[data-v-e458b9ac] {
    margin: .21rem .2rem 0;
    text-align: left;
    diaplay: flex;
    display: -webkit-flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
  .main .second_title .imageBox img[data-v-e458b9ac] {
    width: 100%;
    height: 100%;
    outline: none;
    border-radius: 50%;
  }
  .main .bottom .comlaint img[data-v-e458b9ac] {
    width: .15rem;
    height: .15rem;
    outline: none;
    border: none;
    margin: .02rem .03rem 0 0;
  }


</style>
