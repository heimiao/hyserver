//文章列表
myApp.controller("home", function($scope, findAll, findByParam, saveData,$stateParams) {
	var home = {} || home;
	home.pageInfo = {
		page: 0, //页码从0开始
		pageSize: 5 //每页个数
	}
	home.list = [];
	home.bnArray = [];
	home.isHide = false; 
	home.iscolle=$stateParams.collection;
     var _url=ajaxUrl.articleList;
	function rqst(args) {
		$(".J_load").find("img").show();
		if(home.iscolle){
			_url=ajaxUrl.getCollectArticle
		}else{
			_url=ajaxUrl.articleList;
		}
		//列表详情
		findByParam.findByParam(_url, args).success(function(data) {
			if (data.flag) {
				//是否显示加载更多
				if (data.data.content.length < home.pageInfo.pageSize) {
					home.isHide = true;
				}
				home.list = home.list.concat(data.data.content);
				//读取banner
				$.each(home.list, function() {
					if (this.banner) {
						if (home.bnArray.length < 5) {
							home.bnArray.push(this);
						}
					}
				});
				$(".J_load").find("img").hide();
			}
		});
	}
	//收藏
	//http://www.zhizhunets.com/web/addCollect
	home.iscollection = function(item) {
			//判断登录
			if ($.cookie('userId')!= "null"&&$.cookie('userId')!=undefined) {
				
				if (item.favorite) {
					rqstCollect(item,ajaxUrl.delCollect,false);
				} else {
					rqstCollect(item,ajaxUrl.addCollect,true);
				}
				
			} else {
				location.href = "#user"
			}
		}
	//请求收藏
	function rqstCollect(item,url, bool) {
		saveData.saveData(url, {
			articleId: item.articleId,
			userId: $.cookie('userId')
		}).success(function(data) {
			if (data.flag) {
				item.favorite = bool;
			} else {
				popMsg(data.data.msg);
			}
		});
	}
	
	rqst(home.pageInfo);
	home.loadMore = function() {
		//如果有数据继续加载数据
		home.pageInfo.page++;
		rqst(home.pageInfo);
	}
	$scope.home = home;
});

//文章详情
myApp.controller("home_detail", function($scope, $stateParams, findByParam, saveData,$sce) {
	var home_article = {} || home_article;
	//评论内容
	home_article.comments = []
		//文章内容
	home_article.contInfo = {};
	home_article.isHide = false;
	//文章id
	home_article.articleId = parseInt($stateParams.articleId) || 0;
	home_article.saveComts = {
		articleId: 1,
		comment: ''
	}
	home_article.pageInfo = {
		articleId: home_article.articleId, //文章id
		page: 0, //页码
		pageSize: 10 //每页个数
	}
	
	//获取文章详情
	findByParam.findByParam(ajaxUrl.articleInfo, {
		articleId: home_article.articleId
	}).success(function(data) {
		if (data.flag) {
			//是否显示加载更多
			home_article.contInfo = data.data;
			home_article.contInfo.content=$sce.trustAsHtml(home_article.contInfo.content);
		}
	});
	
	//评论详情
	function readComment(args) {
		findByParam.findByParam(ajaxUrl.commentList, args).success(function(data) {
			if (data.flag) {
				//是否显示加载更多
				if (data.data.content.length <home_article.pageInfo.pageSize) {
					home_article.isHide = true;
				} else{
					home_article.isHide = false;
				}
				if(args.page ==0){
					home_article.comments=[];
					home_article.comments = data.data.content;
				}else{
					home_article.comments = home_article.comments.concat(data.data.content);
				}
			}
		});
	}
	 
	
	readComment(home_article.pageInfo);
	//加载更多
	home_article.loadMore = function() {
			home_article.pageInfo.page++;
			readComment(home_article.pageInfo);
	 }
		//添加评论
	home_article.joinComments = function() {
		if ($.cookie('userId') != "null"&&$.cookie('userId')!=undefined){
			$("#pinlunModal").modal("show");
		}else{
			location.href = "#/user"
		}
	}
	home_article.saveComments = function() {
		home_article.saveComts.articleId = home_article.articleId;
		saveData.saveData(ajaxUrl.addComment, home_article.saveComts).success(function(data) {
			if (data.flag) {
				//刷新评论列表
				$("#pinlunModal").modal("hide");
				home_article.pageInfo.page = 0;
				readComment(home_article.pageInfo);
			} else {
				location.href = "#/user"
			}
			$(".modal-backdrop").remove();
			//初始化查询评论
		});
	}
	$scope.home_article = home_article;
});