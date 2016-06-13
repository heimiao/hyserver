myApp.controller("store", function($scope, findAll, findByParam, saveData) {
	var store = {} || store;
	store.pageInfo = {
		search: '', //搜索条件
		page: 0, //页码从0开始
		pageSize: 10 //每页个数
	}
	store.list = [];
	store.isHide = false;
	//banner查询
	/*findAll.findAll(ajaxUrl.mallBannerList,{}).success(function(data) {
		 console.log(data);
	});*/
	function rqstList(args) {
		$(".J_load").find("img").show();
		//列表详情
		findByParam.findByParam(ajaxUrl.goodsList, args).success(function(data) {
			if (data.flag) {
				//是否显示加载更多
				if (data.data.content.length < store.pageInfo.pageSize) {
					store.isHide = true;
				}
				if (store.pageInfo.page == 0) {
					store.list = data.data.content;
				} else {
					store.list = store.list.concat(data.data.content);
				}
				//初始化banner的集合
				store.bannerList = [];
				$.each(store.list, function() {
					if (this.banner) {
						if (store.bannerList.length < 5) {
							store.bannerList.push(this);
						}
					}
				});
				$(".J_load").find("img").hide();
			}
		});
	}
	rqstList(store.pageInfo);
	store.loadMore = function() {
		//如果有数据继续加载数据
		store.pageInfo.page++;
		rqstList(store.pageInfo);
	}
	store.searchList = function() {
		store.pageInfo.page = 0;
		rqstList(store.pageInfo);
	}

	$scope.store = store;
});

//***********************************************商品详情*******************************************/
myApp.controller("store_detail", function($scope, $stateParams, findByParam, saveData, $sce) {
	var goods_detail = {} || goods_detail;
	//评论内容
	goods_detail.Info = {}
		//文章id
	goods_detail.goodsId = parseInt($stateParams.productId) || 0;
	//商品详情
	findByParam.findByParam(ajaxUrl.productInfo, {
		productId: goods_detail.goodsId
	}).success(function(data) {
		if (data.flag) {
			goods_detail.Info = data.data;
			goods_detail.Info.description = $sce.trustAsHtml(goods_detail.Info.description);
		}
	});
	goods_detail.injoinCart = function(id) {
		if ($.cookie('userId') != "null" && $.cookie('userId') != undefined) {
			location.href = "#/store_cart?productId=" + id;
		} else {
			location.href = "#user"
		}
	}
	$scope.goods_detail = goods_detail;
});

//***********************************************购物车*******************************************/
myApp.controller("store_cart", function($scope, $stateParams, findByParam, saveData, findByParam_get) {
	var store_cart = {} || store_cart;

	//初始化购物车信息
	store_cart.Info = [];

	//文章id
	store_cart.goodsId = parseInt($stateParams.productId) || 0;

	//状态 
	//编辑
	store_cart.isEdit = false;
	//全选
	store_cart.isckAll = false;
	//结算总金额
	store_cart.integral = 0;
	//选中的商品数量
	store_cart.ckGoods = [];

	//读取购物车同时合并文件
	store_cart.readGoods = function() {
		findByParam.findByParam(ajaxUrl.myShopCart, {}).success(function(data) {
			if (data.flag) {
				store_cart.Info = [];

				$.each(data.data, function() {
					store_cart.Info.push($.extend(this, {
						ck: false
					}));
				});

			}
		});
	}

	//如果有商品返回true否者为false
	store_cart.cartIsHv = function(array, id) {
		var itemGoods = {
			cartFlag: false,
			item: {}
		};
		if (array.length > 0) {
			$.each(array, function() {
				if (this.product.productId == id) {
					itemGoods.cartFlag = true;
					itemGoods.item = this;
				}
			});
		}
		return itemGoods;
	}

	//查询购物车
	findByParam.findByParam(ajaxUrl.myShopCart, {}).success(function(data) {
		if (data.flag) {
			//初始化购物车
			store_cart.Info = data.data;
			//初始化购物车同时判断购物车中是否有该商品
			if (store_cart.Info.length > 0) {
				//查看购物车的商品是否有东西
				var itemGoods = store_cart.cartIsHv(store_cart.Info, store_cart.goodsId);
				if (itemGoods.cartFlag) {
					//有商品
					//store_cart.eidtGoodsNum(itemGoods.item, 1);
					popMsg("购物车中已经有该商品了！直接编辑数量即可");
				} else {
					//没有商品
					store_cart.addGoodsGoods(store_cart.goodsId);
				}
			} else {
				//第一次添加购物车
				store_cart.addGoodsGoods(store_cart.goodsId);
			}
		}
	});

	//购物车中添加新的商品
	store_cart.addGoodsGoods = function(id) {
		findByParam.findByParam(ajaxUrl.addShopCart, {
			productId: id,
			number: 1
		}).success(function(data) {
			if (data.flag) {
				store_cart.readGoods();
			} else {
				popMsg(data.msg);
			}
		});
	}

	//商品数量编辑      1：添加       0：减少
	store_cart.eidtGoodsNum = function(_this, args) {
		var goodsNum = 0;
		if (args) {
			if (_this.product.limit >= 1) {

				if (_this.number < _this.product.limit) {
					goodsNum = _this.number + 1;
				} else {
					popMsg("该商属于限购商品");
				}
			} else {
				goodsNum = _this.number + 1;
			}
		} else {
			if (_this.number - 1 > 0) {
				goodsNum = _this.number - 1;
			} else {
				popMsg("商品最少保留一个噢噢！！");
			}
		}
		
		if (_this.product.limit >= 1) {
			if (_this.number < _this.product.limit) {
				findByParam.findByParam(ajaxUrl.updateShopCart, {
					productId: store_cart.goodsId,
					number: goodsNum
				}).success(function(data) {
					if (data.flag) {
						_this.number = goodsNum;
						//计算商品所需要豆
						store_cart.getCkGoods();
					}
				});
			}
		} else {
			if (goodsNum > 0) {
				findByParam.findByParam(ajaxUrl.updateShopCart, {
					productId: store_cart.goodsId,
					number: goodsNum
				}).success(function(data) {
					if (data.flag) {
						_this.number = goodsNum;
						//计算商品所需要豆
						store_cart.getCkGoods();
					}
				});
			}
		}
	}
	//是否编辑---状态
	store_cart.isEditWay = function() {
		if (store_cart.isEdit) {
			store_cart.isEdit = false;
		} else {
			store_cart.isEdit = true;
		}
	}

	//全删
	store_cart.dellAll = function() {
			var flag = false;
			//删除选中的	
			$.each(store_cart.Info, function() {
				if (this.ck) {
					flag = true;
					store_cart.dellGoods(this);
				}
			});
			if (!flag) {
				popMsg("请选择需要删除的商品");
			}
			store_cart.getCkGoods();
			store_cart.isckAll = false;
			store_cart.ckGoods = [];
		}
		//删除单个
	store_cart.dellGoods = function(item) {
		findByParam.findByParam(ajaxUrl.deleteShopCart, {
			productId: item.product.productId
		}).success(function(data) {
			if (data.flag) {
				var deledGoods = [];
				$.each(store_cart.Info, function() {
					if (this.product.productId != item.product.productId) {
						deledGoods.push(this);
					}
				});
				
				store_cart.Info = deledGoods;
				//从新计算选中的商品价格
				store_cart.getCkGoods();
			} else {
				popMsg("删除失败了！联系管理员")
			}
		});
	}

	//全选
	store_cart.ckAll = function() {
		if (store_cart.isckAll) {
			store_cart.isckAll = false;
			$.each(store_cart.Info, function() {
				this.ck = false;
			});
		} else {
			$.each(store_cart.Info, function() {
				this.ck = true;
			});
			store_cart.isckAll = true;
		}
		store_cart.getCkGoods();
	}

	//单个
	store_cart.radioCk = function(itme) {
		//判断当前对象是否选中
		if (itme.ck) {
			itme.ck = false;
			//取消全选
			store_cart.isckAll = false;
		} else {
			itme.ck = true;
			store_cart.isckAll = true;
			$.each(store_cart.Info, function() {
				if (!this.ck) {
					store_cart.isckAll = false;
				}
			});
		}
		//获取选中的
		store_cart.getCkGoods();
	}

	store_cart.getCkGoods = function() {
		store_cart.ckGoods = [];
		store_cart.integral = 0;

		$.each(store_cart.Info, function() {
			if (this.ck) {
				store_cart.ckGoods.push(this);
				console.log(this.product.price + "+" + this.number);
				store_cart.integral += this.product.price * this.number;
				console.log(store_cart.integral);
			}
		});

	}

	store_cart.goAccount = function() {
		if (store_cart.ckGoods.length > 0) {
			var orderArray = [];
			$.each(store_cart.ckGoods, function() {
				orderArray.push({
					productId: this.product.productId,
					number: this.number
				});
			});
			findByParam.findByParam(ajaxUrl.addOrder, {
				items: orderArray
			}).success(function(data) {
				if (data.flag) {
					location.href = "#/store_account?accountId=" + data.data;
				} else {
					popMsg(data.msg)
				}
			});
		} else {
			popMsg("您还没有选择要结算的宝贝噢！");
		}
	}
	$scope.store_cart = store_cart;
});

//订单
myApp.controller("store_account", function($scope, $stateParams, findByParam, saveData, $sce) {
	var store_account = {} || store_account;
	//评论内容
	store_account.Info = [];
	store_account.orderId = parseInt($stateParams.accountId);
	//获取选中的收货地址
	store_account.myAddress = {};
	//当前用户信息
	store_account.userInfo = {};
	//合计总积分
	store_account.sumScore = 0;

	//获取选中的地址	
	findByParam.findByParam(ajaxUrl.myAddressList, {
		orderId: store_account.Info.orderId
	}).success(function(data) {
		if (data.flag) {
			//获取地址
			$.each(data.data, function() {
				if (this.defaults) {
					store_account.myAddress = this;
				}
			});
		} else {
			popMsg("你还没有添加收货地址噢！")
		}
	});

	///用户信息
	findByParam.findByParam(ajaxUrl.getUserParams, {
		userId: $.cookie('userId')
	}).success(function(data) {
		if (data.flag) {
			//获取用户信息
			store_account.userInfo = data.data;
		} else {
			popMsg("你还没有添加收货地址噢！")
		}
	});

	//获取详细订单
	findByParam.findByParam(ajaxUrl.orderDetails, {
		orderId: store_account.orderId
	}).success(function(data) {
		if (data.flag) {
			//获取订单详细
			store_account.Info = data.data.items;
			if (store_account.Info.length > 0) {
				$.each(store_account.Info, function() {
					store_account.sumScore = store_account.sumScore + this.price;
					this.product.description = $sce.trustAsHtml(this.product.description);
				});
			}
		} else {
			popMsg("添加订单失败！联系管理员")
		}
	});

	store_account.submit = function() {

		var flag = false;
		for (var prop in store_account.myAddress) {
			flag = true;
			break;
		}
		//判断当前积分是否小于商品总积分
		var submitParam = {
			"orderId": store_account.orderId, //订单ID
			"paymentType": 1, //支付方式 目前只支持一种积分支付方式，值为0，后期会添加在线支付
			"addressId": store_account.myAddress.addressId //收货地址
		}
		if (store_account.sumScore <= store_account.userInfo.coin) {
			if (flag) {
				findByParam.findByParam(ajaxUrl.enterOrder, submitParam).success(function(data) {
					if (data.flag) {
						//获取订单详细
						//location.href = "#/store_accountlist";
						var uri = encodeURIComponent("http://www.zhizhunets.com/pay/order?orderId=" + store_account.orderId);
						location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfe9a1fe3d1af08bf&redirect_uri=" + uri + "&response_type=code&scope=snsapi_base&state=pay#wechat_redirect";
						//跳转到订单页面
					} else {
						popMsg(data.msg)
					}
				});
			} else {
				popMsg("请添加收货地址！")
			}
		} else {
			popMsg("您的积分不够用了！快去充积分吧！")
		}
	}

	$scope.store_account = store_account;
});

//订单列表
myApp.controller("store_accountlist", function($scope, $stateParams, findByParam, saveData) {
	var store_accountlist = {} || store_accountlist;
	store_accountlist.Info = [];
	store_accountlist.orderId = parseInt($stateParams.accountId);

	//加载的个数是否下与分页数目，如果小于则隐藏
	store_accountlist.ishide = false;
	store_accountlist.rqstParam = {
		"page": 0,
		"pageSize": 10,
		"state": null
	};

	store_accountlist.submitFrm = {
		"orderId": 1, //订单ID
		"state": "all",
		//要更改为的状态，RecvEnter 收货确认，Appraise 已评价，  Cancle 取消;
		//订单状态共7种，Create 未确认（创建后即为此状态），Send 已发货（管理员设置），Recv 已收货（管理员设置），RecvEnter 收货确认（会员设置），Appraise 已评价状态（会员设置）, Cancle 已取消（会员设置）
		"appraise": "", //评价时提供改字段
		"description": "取消理由", //取消时提供该字段
	};

	store_accountlist.rqstList = function(args) {
			findByParam.findByParam(ajaxUrl.myOrders, args).success(function(data) {
				if (data.flag) {
					//根据条件筛选
					if (data.data.content.length < args.pageSize) {
						store_accountlist.ishide = true;
					}
					
					if (store_accountlist.rqstParam.page != 0) {
						store_accountlist.Info = store_accountlist.Info.concat(data.data.content);
					} else {
						store_accountlist.Info = data.data.content;
					}
				} else {
					popMsg(data.msg)
				}
			});
		}
		//默认加载
	store_accountlist.rqstList(store_accountlist.rqstParam);

	store_accountlist.loadMore = function() {
		store_accountlist.rqstParam.page++;
		store_accountlist.rqstList(store_accountlist.rqstParam);
	}

	//条件筛选
	store_accountlist.screening = function(args) {
		store_accountlist.rqstParam.page = 0;
		if (args == "all") {
			store_accountlist.rqstParam.state = null;
		} else {
			store_accountlist.rqstParam.state = args;
		}
		store_accountlist.submitFrm.state = args;
		store_accountlist.rqstList(store_accountlist.rqstParam);
	};

	//取消订单
	store_accountlist.cancelOrder = function(id) {
		$('#cancelOrder').modal('show');
		store_accountlist.submitFrm.orderId = id;
	}

	//取消订单确认
	store_accountlist.sureCancelOrder = function() {
		$('#cancelOrder').modal('show');
		store_accountlist.submitFrm.state = "Cancle";
		findByParam.findByParam(ajaxUrl.updateOrder, store_accountlist.submitFrm).success(function(data) {
			if (data.flag) {
				//从新加载订单列表
				store_accountlist.screening("all");

				$("#cancelOrder").modal("hide");
				$(".modal-backdrop").remove();
			} else {
				popMsg(data.msg)
			}
		});
	}

	$scope.store_accountlist = store_accountlist;
});

//收货地址列表
myApp.controller("store_adslist", function($scope, $stateParams, findByParam, saveData) {
	var store_adslist = {} || store_adslist;
	store_adslist.list = [];
	store_adslist.orderId = $stateParams.orderId;

	store_adslist.rqst = function() {
		findByParam.findByParam(ajaxUrl.myAddressList, {}).success(function(data) {
			if (data.flag) {
				store_adslist.list = data.data;
			} else {
				popMsg(data.msg)
			}
		});
	}
	store_adslist.rqst();
	//删除
	store_adslist.delAddress = function(item) {
			findByParam.findByParam(ajaxUrl.deleteAddress, {
				addressId: item.addressId
			}).success(function(data) {
				if (data.flag) {
					store_adslist.rqst();
				} else {
					popMsg("删除地址失败！联系管理员")
				}
			});
		}
		//选中地址
	store_adslist.ckedAddress = function(item) {
			findByParam.findByParam(ajaxUrl.setDefaultAddress, {
				addressId: item.addressId
			}).success(function(data) {
				if (data.flag) {
					store_adslist.rqst();
				} else {
					popMsg("删除地址失败！联系管理员")
				}
			});
		}
		//跳回订单页面
	store_adslist.sure = function() {
		var flag = false;
		//判断是否有选中地址
		if (store_adslist.list.length > 0) {
			$.each(store_adslist.list, function() {
				flag = true;
			})
		}
		if (flag) {
			location.href = "#/store_account?accountId=" + store_adslist.orderId;
		} else {
			popMsg("请选择一个默认收货地址");
		}
	}
	$scope.store_adslist = store_adslist;
});

//编辑收货地址
myApp.controller("store_editsite", function($scope, $stateParams, findByParam, saveData) {
	var store_editsite = {} || store_editsite;
	//评论内容myAddressList
	store_editsite.Info = {}
	store_editsite.addressId = $stateParams.addressId;
	store_editsite.orderId = $stateParams.orderId;

	var getAddress = ajaxUrl.addAddress;

	if (store_editsite.addressId) {
		getAddress = ajaxUrl.updateAddress
			//获取当前地址的详细信息
		findByParam.findByParam(ajaxUrl.addressDetails, {
			addressId: store_editsite.addressId
		}).success(function(data) {
			if (data.flag) {
				store_editsite.Info = data.data;
			} else {
				popMsg("新增地址失败！从新添加")
			}
		});

	} else {
		getAddress = ajaxUrl.addAddress;
	}
	store_editsite.addAdrs = function() {
		store_editsite.Info.area = store_editsite.Info.provinces + store_editsite.Info.city;
		findByParam.findByParam(getAddress, store_editsite.Info).success(function(data) {
			if (data.flag) {
				location.href = "#/store_adslist?orderId=" + store_editsite.orderId;
			}
		});
	}
	$scope.store_editsite = store_editsite;
});