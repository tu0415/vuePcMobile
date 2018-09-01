import * as types from "./types";
import indexApi from '../api/indexApi'

const state = {
	selectMenuUrl: '',
	userInfo: {},
	voteMessage: false,
	systemMessage: false,
	commentMessage: false,
	billMessage: false
}

const mutations = {
	[types.SELECT_MENU_URL](state, value) {
		state.selectMenuUrl = value
	},
	[types.USER_INFO](state, value) {
		state.userInfo = value
	},
	[types.VOTE_MESSAGE](state, value) {
		state.voteMessage = value
	},
	[types.SYSTEM_MESSAGE](state, value) {
		state.systemMessage = value
	},
	[types.COMMENT_MESSAGE](state, value) {
		state.commentMessage = value
	},
	[types.BILL_MESSAGE](state, value) {
		state.billMessage = value
	}
}

const actions = {
	getRedMessage({commit}, data) {
		return new Promise((resolve, reject) => {
			indexApi.getMessage({
				userId: data
			}).then(d => {
				if (d.code == "0") {
					if (d.data && d.data.length) {
						d.data.forEach(item => {
							if (item.type == '0' && item.status == '1') {
								commit(types.SYSTEM_MESSAGE, true)
							}
							if (item.type == '1' && item.status == '1') {
								commit(types.COMMENT_MESSAGE, true)
							}
							if (item.type == '2' && item.status == '1') {
								commit(types.VOTE_MESSAGE, true)
							}
							if (item.type == '3' && item.status == '1') {
								commit(types.BILL_MESSAGE, true)
							}
						})
					}
					resolve(d)
				}
			}).catch(err => {
				reject(err)
			})
		})
	},
	getUserInfo({commit}, data){

	}
}

const getters = {}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
