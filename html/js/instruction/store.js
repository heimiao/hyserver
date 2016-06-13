myApp.directive('bannerShuffling', function(findAll) {
	return {
		restrict: 'AEMC',
		link: function(scope, element, attr, parentDom) {
			var bnList = [];
			findAll.findAll(ajaxUrl.mallBannerList, {}).success(function(data) {
				bnList = data.data;
				var imgContanier = $(element).find(".swiper-wrapper");
				var dom = "";
				$.each(bnList, function(i, j) {
					if (i < 5 && this.banner) {
						dom += "<div class='swiper-slide blue-slide' ><a href='#/store_detail?productId=" + this.productId + "'><img src='" + this.iconUrl + "'/></a></div>"
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


myApp.directive('address', function() {
	return {
		restrict: 'AEMC',
		link: function(scope, element, attr, parentDom) {
			
			var $provinces = $(element).find(".provinces");
			var $city = $(element).find(".city");
			var $button = $(element).find("button");
			
			for (var i = 0; i < area_array.length; i++) {
				if (area_array[i] != undefined) {
					$provinces.append("<option value=" + area_array[i] + " data=" + i + ">" + area_array[i] + "</option>");
				}
			};
			$provinces.change(function() {
				var selectedObj = $(".provinces option:selected").attr("data");
				$city.find("option").remove();
				for (var j = 0; j < sub_array[selectedObj].length; j++) {
					if (sub_array[selectedObj][j] != undefined) {
						$city.append("<option value=" + sub_array[selectedObj][j] + " data=" + i + ">" + sub_array[selectedObj][j] + "</option>");
					}
				};
			});
			
			$button.click(function(){
				 
			})
//			store_editsite.addAdrs
		}
	};
});

