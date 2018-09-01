let showSuccessMessage = function (message, duration = 3) {
	this.$message({
		showClose: true,
		message: message || '操作成功',
		type: 'success',
		duration: duration * 1000
	})
}

let showErrorMessage = function (err, duration = 3) {
	console.log(err)
	let reason = typeof err === 'object' && err !== null ? err.reason : err

	this.$message({
		showClose: true,
		message: reason || '系统错误!',
		type: 'error',
		duration: duration * 1000
	})
}

let showLoginMessage = function () {
	if(this.$route.name == 'login'){
		return false
	}
	this.$confirm('客官,此操作需要登录之后才能查看, 是否前往登录页面?', '温馨提示', {
		confirmButtonText: '立即前往',
		cancelButtonText: '再逛逛',
		type: 'warning'
	}).then(() => {
		this.$router.push({
			name: 'login'
		})
	}).catch(() => {
	});
}

export default {
	install(Vue) {
		Vue.prototype.$showSuccessMessage = showSuccessMessage
		Vue.prototype.$showErrorMessage = showErrorMessage
		Vue.prototype.$showLoginMessage = showLoginMessage
	}
}
