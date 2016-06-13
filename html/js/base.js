var ajaxUrl = {
	login: '../user/login',
	
	//获取用户信息
	getUserParams: '../user/getUserParams',
	
	getUserMsgList: '../user/getUserMsgList',
	regist: '../user/register',
	bannerUrl: '../web/bannerlist',
	articleList: '../web/mainlist',
	articleInfo: '../web/articleInfo',
	commentList: '../web/commentList',
	addCollect: '../web/addCollect',
	delCollect: '../web/deleteCollect',
	updateUser: '../user/updateUser',
	goodsList: '../mall/mainlist',
	mallBannerList: '../mall/bannerlist',
	addComment:'../web/addComment',
	///上传头像
	updateUserHeadImg:'../user/updateUserHeadImg',
	//收藏的文章
	getCollectArticle:"../web/getCollectArticle",
	//商品
	productInfo:'../mall/productInfo',
	isExistsShopCart:'../mall/isExistsShopCart',
	//添加购物车http://localhost:8080/HyServer/mall/addShopCart
	addShopCart:'../mall/addShopCart',
	//查询购物车
	myShopCart:'../mall/myShopCart',
	//修改购物车
	updateShopCart:'../mall/updateShopCart',
//	、删除购物车
	deleteShopCart:'../mall/deleteShopCart',
	//添加订单
	addOrder:"../mall/addOrder",
	//收货地址
	myAddressList:"../mall/myAddressList",
	//新增收货地址
	addAddress:"../mall/addAddress",
	//修改收货地址
	updateAddress:"../mall/updateAddress",
	//设置默认地址
	setDefaultAddress:"../mall/setDefaultAddress",
	//删除收货地址
	deleteAddress:"../mall/deleteAddress",
	//收货地址详情
	addressDetails:"../mall/addressDetails",
	//订单列表
	myOrders:"../mall/myOrders",
	//订单详细
	orderDetails:"../mall/orderDetails",
	//确认订单
	enterOrder:"../mall/enterOrder",
	//取消订单
	updateOrder:"../mall/updateOrder"
}

function setCookie(name, value) {
	var Days = 30 * 12; //cookie 将被保存一年  
	var exp = new Date(); //获得当前时间  
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000); //换成毫秒  
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
/* 
功能：获取cookies函数  
参数：name，cookie名字 
*/
function getCookie(name) {
	/*var arr,reg = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr=document.cookie.match(reg)) {
		return unescape(arr[2]);
	} else {
		return null;
	}*/
	
	 var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg))
 
        return (arr[2]);
    else
        return null;
}
/* 
功能：删除cookies函数  
参数：name，cookie名字 
*/
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

/*function delCookie(name) {
	var exp = new Date(); //当前时间  
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}*/

// 扩展data原型
Date.prototype.format = function(format) {
	var o = {
		"M+": this.getMonth() + 1, // month
		"d+": this.getDate(), // day
		"h+": this.getHours(), // hour
		"m+": this.getMinutes(), // minute
		"s+": this.getSeconds(), // second
		"q+": Math.floor((this.getMonth() + 3) / 3), // quarter
		"S": this.getMilliseconds() // millisecond
	}
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};