import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
import * as types from '../store/types'
import Utils from '../utils/format'
import NProgress from 'nprogress'

import index from '@/pages/index'
import detail from '@/pages/detail'
import flash from '@/pages/flash'
import personal from '@/pages/personal'
import login from '@/pages/login'
import systemInformation from '@/pages/systemInformation'
import wallet from '@/pages/wallet'
import publishArticle from '@/pages/publishArticle'
import checkArticle from '@/pages/checkArticle'
import searchArticle from '@/pages/searchArticle'
import tagArticle from '@/pages/tagArticle'
import personalIndex from '@/pages/personalIndex'
import app from '@/pages/app'
import videoIndex from '@/pages/videoIndex'
import bindPhone from '@/pages/bindPhone'
import tip from '@/pages/tip'
import yoyotip from '@/pages/yoyotip'
import about from '@/pages/about'
import whiteBook from '@/pages/whiteBook'
import whiteBookEn from '@/pages/whiteBook_en'
import service from '@/pages/service'
import shareInviteFriends from '@/pages/cms_page/share_invite_friends'
import registerRedPacket from '@/pages/cms_page/register_red_packet'
import openRedPacket from '@/pages/cms_page/open_red_packet'
import detalShareContent from '@/pages/cms_page/detail_share_content'

NProgress.configure({easing: 'ease', speed: 400});
NProgress.configure({showSpinner: false});
Vue.use(Router)

let Base64 = require('js-base64').Base64;

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'default',
      component: index
    }, {
      path: '/login',
      name: 'login',
      component: login
    }, {
      path: '/bindPhone',
      name: 'bindPhone',
      component: bindPhone
    }, {
      path: '/index',
      name: 'index',
      component: index
    }, {
      path: '/detail',
      name: 'detail',
      component: detail
    }, {
      path: '/videoIndex',
      name: 'videoIndex',
      component: videoIndex
    }, {
      path: '/app',
      name: 'app',
      component: app
    }, {
      path: '/about',
      name: 'about',
      component: about
    }, {
      path: '/whiteBook',
      name: 'whiteBook',
      component: whiteBook
    }, {
      path: '/whiteBook_en',
      name: 'whiteBookEn',
      component: whiteBookEn
    }, {
      path: '/service',
      name: 'service',
      component: service
    }, {
      path: '/flash',
      name: 'flash',
      component: flash
    }, {
      path: '/tip',
      name: 'tip',
      component: tip,
      meta:{
        hide: true
      }
    },  {
      path: '/yoyotip',
      name: 'yoyotip',
      component: yoyotip,
      meta:{
        hide: true
      }
    }, {
      path: '/searchArticle',
      name: 'searchArticle',
      component: searchArticle
    }, {
      path: '/tagArticle',
      name: 'tagArticle',
      component: tagArticle
    }, {
      path: '/personal',
      name: 'personal',
      component: personal,
      meta: {
        requireAuth: true
      }
    }, {
      path: '/systemInformation',
      name: 'systemInformation',
      component: systemInformation,
      meta: {
        requireAuth: true
      }
    }, {
      path: '/wallet',
      name: 'wallet',
      component: wallet,
      meta: {
        requireAuth: true
      }
    }, {
      path: '/publishArticle',
      name: 'publishArticle',
      component: publishArticle,
      meta: {
        requireAuth: true
      }
    }, {
      path: '/checkArticle',
      name: 'checkArticle',
      component: checkArticle,
      meta: {
        requireAuth: true
      }
    }, {
      path: '/personalIndex',
      name: 'personalIndex',
      component: personalIndex
    }, {
      path: '/cms_page/share_invite_friends/:userId',
      name: 'shareInviteFriends',
      component: shareInviteFriends,
      props: true,
      meta: {
        hide: true,
        title: '邀请好友'
      }
    }, {
      path: '/cms_page/register_red_packet',
      name: 'registerRedPacket',
      component: registerRedPacket,
      props: true,
      meta: {
        hide: true,
        title: '领取注册红包'
      }
    }, {
      path: '/cms_page/open_red_packet',
      name: 'openRedPacket',
      component: openRedPacket,
      props: true,
      meta: {
        hide: true,
        title: '红包'
      }
    }, {
      path: '/cms_page/detail_share_content',
      name: 'detalShareContent',
      component: detalShareContent,
      props: true,
      meta: {
        hide: true,
        title: '文章详情'
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  let userInfo = Utils.getCookie('cur_dt') ? JSON.parse(Base64.decode(Utils.getCookie('cur_dt'))) : {};

  if (userInfo && userInfo.id) {
    store.commit(types.USER_INFO, userInfo);
  } else {
    store.commit(types.USER_INFO, {})
    if (to.meta.requireAuth) {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  }

  window.scrollTo(0, 0)
  NProgress.start();
  next()
});

router.afterEach(() => {
  NProgress.done();
});

export default router
