import Vue from 'vue'
import Axios from 'axios'
import indexApi from "../indexApi";
import Utils from "../../utils/format";

const globalConfig = {
	headers: {
		post: {
			'Content-Type': 'application/json; charset=UTF-8'
		},
		get: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
	},
	xsrfCookieName: 'U_TOKEN',
	xsrfHeaderName: 'X_TOKEN',
	timeout: 30000
}

Object.assign(Axios.defaults, globalConfig)
Axios.interceptors.request.use(config => {
	let userInfo = Utils.getCookie('cur_dt') ? JSON.parse(Base64.decode(Utils.getCookie('cur_dt'))) : {};
	if (config.url.indexOf('/oauth/token') > -1) {
		config.headers.Authorization = 'Basic YXBpOnNlY3JldA=='
	} else {
		let token = sessionStorage.getItem('token');

		if (token) {
			token = JSON.parse(token);
			config.headers.Authorization = 'Bearer ' + token.access_token
		}
	}
	if (userInfo && userInfo.identification) {
		config.headers.identification = userInfo.identification;
	} else {
		config.headers.identification = null;
	}
	return config
}, error => Promise.reject(error))
Axios.interceptors.response.use(res => res, handleAllException)

function handleAllException(err) {
	let data = null;

	if (err.response) {
		data = err.response.data

		if (err.response.status === 401) {
			return getTokenEvt()
				.then(function (value) {
					sessionStorage.setItem('token', JSON.stringify(value));
					return Axios(err.config);
				})
				.catch(function (error) {
					return Promise.reject(error)
				});
		}
	}

	return Promise.reject(data)
}

function getTokenEvt() {
	return new Promise((resolve, reject) => {
		indexApi.getToken()
			.then(d => {
				resolve(d)
			}).catch(err => {
			reject({})
		})
	})
}

function getResponseData(res) {
	return res.data
}

export default {
	post(url, data = {}, options = {}) {
		return Axios({
			method: 'post',
			url,
			data: data || {},
		}).then(getResponseData)
	},
	get(url, params = {}, options = {}) {
		return Axios({
			method: 'get',
			url,
			params: params || {},
		}).then(getResponseData)
	}
}
