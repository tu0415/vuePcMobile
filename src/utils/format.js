let formatDate = function (options, fmt) {
	let date = new Date(options);
	let o = {
		"M+": date.getMonth() + 1,                 //月份
		"d+": date.getDate(),                    //日
		"h+": date.getHours(),                   //小时
		"m+": date.getMinutes(),                 //分
		"s+": date.getSeconds(),                 //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds()             //毫秒
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

let getDateDiff = function (dateTimeStamp) {
	let minute = 1000 * 60;
	let hour = minute * 60;
	let day = hour * 24;
	let week = day * 7;
	let month = day * 30;
	let now = new Date().getTime();
	let diffValue = now - dateTimeStamp;
	let monthC = diffValue / month;
	let weekC = diffValue / week;
	let dayC = diffValue / day;
	let hourC = diffValue / hour;
	let minC = diffValue / minute;
	let result = '';

	if (diffValue < 0) {
		return;
	}
	if (monthC >= 1) {
		result = "" + parseInt(monthC) + "月前";
	}
	else if (weekC >= 1) {
		result = "" + parseInt(weekC) + "周前";
	}
	else if (dayC >= 1) {
		result = "" + parseInt(dayC) + "天前";
	}
	else if (hourC >= 1) {
		result = "" + parseInt(hourC) + "小时前";
	}
	else if (minC >= 1) {
		result = "" + parseInt(minC) + "分钟前";
	} else {
		result = "刚刚";
	}

	return result;
}

let setCookie = function (name, value, days) {
	let d = new Date;

	d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
	window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

let getCookie = function (name) {
	let v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');

	return v ? v[2] : null;
}

let deleteCookie = function (name) {
	let exp = new Date();
	let cval = getCookie(name);

	exp.setTime(exp.getTime() - 1);
	if (cval != null) {
		window.document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	}
}

export default {
	formatDate,
	getDateDiff,
	setCookie,
	getCookie,
	deleteCookie
}
