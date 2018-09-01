import Util from './index'
import configUrl from '../config/config_url'

export default {
  /* 获取token */
  async getToken(){
    const result = await Util.post(`/oauth/token${configUrl.token_url}`)
    return result
  },
  /* 首页 */
  async articleList(data){
    const result = await Util.post('/forum/web/article/list', data)
    return result
  },
  /* 详情 */
  async detailList(data){
    const result = await Util.get(`/forum/web/article/${data.userId}_${data.id}.json`)
    return result
  },
  /* 获取验证码 */
  async getCode(data){
    const result = await Util.get(`/forum/web/login/sms/${data.telephone}`)
    return result
  },
  /* 登录 */
  async login(data){
    const result = await Util.post('/forum/web/login/check', data)
    return result
  },
  /* 投票 */
  async articleVote(data){
    const result = await Util.post('/forum/web/article/vote', data)
    return result
  },
  /* 助力 */
  async articleInvest(data){
    const result = await Util.post('/forum/web/article/invest', data)
    return result
  },
  /* 发表文章 */
  async articleAdd(data){
    const result = await Util.post('/forum/web/article/add', data)
    return result
  },
  /* 快讯列表 */
  async flashList(data){
    const result = await Util.post('/forum/web/news/flash/list', data)
    return result
  },
  /* 审查文章列表 */
  async approveArticleList(data){
    const result = await Util.post('/forum/web/approve/article/list', data)
    return result
  },
  /* 获取标签列表 */
  async tagList(){
    const result = await Util.get('/forum/web/tag/list')
    return result
  },
  /* 审查文章 */
  async approveArticle(data){
    const result = await Util.post('/forum/web/approve/article', data)
    return result
  },
  /* 获取用户信息 */
  async getMemberList(data){
    const result = await Util.get(`/forum/web/member/${data.userId}`)
    return result
  },
  /* 更新用户信息 */
  async updateMember(data){
    const result = await Util.post('/forum/web/member/update', data)
    return result
  },
  /* 获取历史记录 */
  async browseHistory(data){
    const result = await Util.get(`/forum/web/article/browse/history/${data.userId}/${data.pageOn}/${data.pageSize}`)
    return result
  },
  /* 获取收藏列表 */
  async collectList(data){
    const result = await Util.post('/forum/web/collect/list', data)
    return result
  },
  /* 取消收藏列表 */
  async delCollect(data){
    const result = await Util.post('/forum/web/collect/del', data)
    return result
  },
  /* 关注我的 */
  async fansList(data){
    const result = await Util.post('/forum/web/follow/fans/list', data)
    return result
  },
  /* 关注 */
  async followAdd(data){
    const result = await Util.post('/forum/web/follow/add', data)
    return result
  },
  /* 我的关注 */
  async followList(data){
    const result = await Util.post('/forum/web/follow/list', data)
    return result
  },
  /* 我的关注 */
  async delFollow(data){
    const result = await Util.post('/forum/web/follow/del', data)
    return result
  },
  /* 获取文章列表 */
  async getArticleList(data){
    const result = await Util.post('/forum/web/article/list', data)
    return result
  },
  /* 获取钱包信息 */
  async getWalletInfo(data){
    const result = await Util.get(`/forum/web/wallet/${data.userId}/info`)
    return result
  },
  /* 钱包流水记录 */
  async getWalletFlow(data){
    const result = await Util.post('/forum/web/wallet/flow', data)
    return result
  },
  /* 消息通知列表 */
  async getMessage(data){
    const result = await Util.get(`/forum/web/message/mark/status/${data.userId}.json`)
    return result
  },
  /* 消息通知列表 */
  async getMessageList(data){
    const result = await Util.post('/forum/web/message/list.json', data)
    return result
  },
  /* 评论列表 */
  async commentList(data){
    const result = await Util.post('/forum/web/comment/list', data)
    return result
  },
  /* 发布评论 */
  async commentAdd(data){
    const result = await Util.post('/forum/web/comment/add', data)
    return result
  },
  /* 获取知票知力 */
  async accountList(data){
    const result = await Util.get(`/forum/web/member/account/${data.userId}`)
    return result
  },
  /* 举报接口 */
  async getComplain(data){
    const result = await Util.post('/forum/web/report/complain', data)
    return result
  },
  /* 删除文章 */
  async deleteArticle(data){
    const result = await Util.post('/forum/web/article/del', data)
    return result
  },
  /* 删除文章 */
  async editArticle(data){
    const result = await Util.post('/forum/web/article/edit', data)
    return result
  },
  /* 查询原因列表 */
  async getReason(data){
    const result = await Util.get(`/forum/reason/${data.type}/list`)
    return result
  },
  /* 获取会员详情 */
  async getMember(data){
	  if(data.userId){
		  const result = await Util.get(`/forum/web/member/info/${data.userId},${data.authorId}`)
		  return result
	  }else{
		  const result = await Util.get(`/forum/web/member/info/${data.authorId}`)
		  return result
	  }
  },
  /* 获取投票历史记录 */
  async getLogList(data){
    const result = await Util.post('/forum/web/article/vote/log/list', data)
    return result
  },
  /* 获取关注状态 */
  async getStatusList(data){
    const result = await Util.post('/forum/web/follow/status', data)
    return result
  },
  /* 已读消息 */
  async getMessageMark(data){
    const result = await Util.get(`/forum/web/message/mark/type/${data.type}/${data.userId}/${data.mark}.json`)
    return result
  },
  /* 文章操作记录 */
  async getArticleRecord(data){
    const result = await Util.get(`/forum/web/article/record/${data.userId}_${data.articleId}.json`)
    return result
  },
  /* 成为作者 */
  async getComingAuthor(data){
    const result = await Util.get(`/forum/web/member/convert/author/${data.userId}/${data.inviteCode}`)
    return result
  },
  /* 兑换邀请码 */
  async getExchange(data){
    const result = await Util.post('/forum/web/invite/code/exchange', data)
    return result
  },
  /* 兑换邀请码列表 */
  async getInviteCodeList(data){
    const result = await Util.get(`/forum/web/invite/code/${data.mid}`)
    return result
  },
  /* 获取配置文件 */
  async getWechatConfig(){
    const result = await Util.get('/forum/web/login/wechat/config')
    return result
  },
  /* 获取YOYOW登陆URL */
  async getYoyowConfig(){
    const result = await Util.get('/forum/web/login/yoyow/config')
    return result
  },

  /* 获取YOYOW登陆URL */
  async getYoyowLogin(data){
    const result = await Util.get('/forum/web/login/yoyow', data)
    return result
  },

  /* 微信登录 */
  async getWechatLogin(data){
    const result = await Util.post('/forum/web/login/wechat', data)
    return result
  },
  /* 手机号码验证 */
  async getVerifyCode(data){
    const result = await Util.get(`/forum/web/login/verify/code/${data.mobile}/${data.code}`)
    return result
  },
  /* 绑定手机号码 */
  async getBindWechat(data){
    const result = await Util.post('/forum/web/member/bind/user', data)
    return result
  },
  /* 绑定手机号码 */
  async getNoticeAgreement(data){
    const result = await Util.get(`/forum/notice/agreement/${data.type}/${data.suffix}`)
    return result
  },
  /* 发送钱包验证短信 */
  async getWalletCode(data){
    const result = await Util.get(`/forum/web/wallet/sms/${data.phone}`)
    return result
  },
  /* 解除yoyow账号绑定 */
  async untieYoyowAccount(data){
    const result = await Util.post('/forum/web/wallet/untie/yoyow/', data)
    return result
  },
  /* 更新账户交易密码 */
  async updateTransactionPassword(data){
    const result = await Util.post('/forum/web/wallet/update/password', data)
    return result
  },
  /* 提取KFC代币 */
  async drawingKFC(data){
    const result = await Util.post('/forum/web/wallet/drawing/kfc', data)
    return result
  },
  /* 加载图片验证码JS */
  async getVerifyJsUrl(){
    const result = await Util.post('/forum/web/login/captcha')
    return result
  },
  /* 校验图片验证码 */
  async verifyImageCode(data){
    const result = await Util.get('/forum/web/wallet/captcha/verify/${data.ticket}')
    return result
  },
  /* 邀请好友 */
  async register(data){
    const result = await Util.post('/forum/web/member/register', data)
    return result
  },
  /* 红包接口 随机红包 */
  async randomRedPacket(data){
    const result = await Util.get(`/forum/web/packet/random/${data.mid}`)
    return result
  },
}
