//文章列表
myApp.controller("user", function($scope, findAll, findByParam, saveData) {
	var user = {} || user;
	user.isLogin = false;
	//用户信息模型
	user.userInfo = {
		username: '',
		password: '',
		repassword: ''
	};
	//显示用户信息模型
	user.showInfo = {};
	//判断用户登录
	if ($.cookie('userId') != "null" && $.cookie('userId') != undefined) {
		findByParam.findByParam(ajaxUrl.getUserParams, {
			userId: $.cookie('userId')
		}).success(function(data) {
			if (data.flag) {
				//对初始化的处理
				user.showInfo = data.data;
				user.isLogin = true;
			} else {
				popMsg(data.msg);
			}
		});
	} else {
		user.isLogin = false;
	}

	//注册
	user.register = function() {
			//首先校验非空
			if (user.verdict(1)) {
				saveData.saveData(ajaxUrl.regist, user.userInfo).success(function(data) {
					if (data.flag) {
						//对注册之后的处理
						$("#registerModal").modal("hide");
						$(".modal-backdrop").remove();
					}
					popMsg(data.msg);
					$("#loginModal").find("input[type='password']").val("");
				});
			}
		}
		//登录
	user.login = function() {
		if (user.verdict(0)) {
			saveData.saveData(ajaxUrl.login, user.userInfo).success(function(data) {
				if (data.flag) {
					//把登陆之后获取的信息放到前台
					$.cookie('userId', data.data.userId)
					user.showInfo = data.data;
					user.isLogin = true;
					//对注册之后的处理
					$("#loginModal").modal("hide");
					$(".modal-backdrop").remove();
				}
				$("#loginModal").find("input[type='password']").val("");
				popMsg(data.msg);
			});
		}
	}

	//验证非空
	user.verdict = function(args) {
		var flag = false;
		if ($.trim(user.userInfo.username) != "") {
			if (/^[1][358][0-9]{9}$/.test(user.userInfo.username)) {
				if ($.trim(user.userInfo.password) != "") {
					if (args == 0) {
						flag = true;
					} else {
						if ($.trim(user.userInfo.repassword) != "") {
							if (user.userInfo.repassword == user.userInfo.password) {
								flag = true;
							} else {
								popMsg("密码和重复密码不一致");
							}
						} else {
							popMsg("重复密码不能为空");
						}
					}
				} else {
					popMsg("密码不能为空");
				}
			} else {
				popMsg("帐号必须是正确的手机号");
			}
		} else {
			popMsg("账户不能为空");
		}
		return flag;
	}
	user.exit = function() {
		$.cookie('userId', null);
		user.isLogin = false;
	}
	$scope.user = user;
});

//个人信息设置
myApp.controller("user_set", function($scope, findAll, findByParam, saveData, Upload, $timeout) {
	var user_set = {} || user_set;
	//用户信息模型
	user_set.showInfo = {};

	user_set.rqst = function() {
		findByParam.findByParam(ajaxUrl.getUserParams, {
			userId: $.cookie('userId')
		}).success(function(data) {
			if (data.flag) {
				//对初始化的处理
				user_set.showInfo = data.data;
			}
		});
	}
	user_set.rqst();
	//修改个人信息
	user_set.updateInfo = function() {
			//首先校验非空
			saveData.saveData(ajaxUrl.updateUser, user_set.showInfo).success(function(data) {
				//对注册之后的处理
				if (data.flag) {
					popMsg("修改成功了");
				}
			});
		}
		//上传图片
	user_set.uploadPic = function() {
		var file = $scope.testFile;
		file.upload = Upload.upload({
			url: ajaxUrl.updateUserHeadImg,
			data: {
				headImg: file
			},
		});
		file.upload.then(function(response) {
			$timeout(function() {
				file.result = response.data;
			});
			user_set.rqst();
		}, function(response) {
			if (response.status > 0)
				$scope.errorMsg = response.status + ': ' + response.data;
		}, function(evt) {
			// Math.min is to fix IE which reports 200% sometimes
			file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		});
	}

	$scope.user_set = user_set;
});