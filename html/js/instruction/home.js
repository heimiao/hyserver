myApp.directive('scrollBanner', function(findAll) {
	return {
		restrict: 'AEMC',
		link: function(scope, element, attr, parentDom) {
			var bnList=[];
			findAll.findAll(ajaxUrl.bannerUrl, {}).success(function(data) {
				 bnList= data.data;
				var imgContanier = $(element).find(".swiper-wrapper");
				var dom = "";
				$.each(bnList, function(i,j) {   
					if(i<4&&this.banner){
						 dom+="<div class='swiper-slide blue-slide' ><a href='#/home_detail?articleId="+this.articleId+"&isAnchor=true'><img src='"+this.imgUrl+"'/></a></div>"            
					}
				});
				imgContanier.append(dom);
				var mySwiper = new Swiper($(element), {
					pagination: '.swiper-pagination',
					loop: true,
					autoplay: 3000,
				});
			});
		}
	};
});