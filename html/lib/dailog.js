function Id(obj) {
    return document.getElementById(obj);
}

function trim(str) { //删除左右两端的空格
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

var popMsgHideTimer;

function popMsg(txt) {
    if (!(typeof isReadPage === 'undefined') && isReadPage) {
        if (!txt) {
            popMsgRead("网络不给力哦！");
        } else {
            popMsgRead(txt);
        }
    } else {
        if (!txt) {
            popMsg00("网络不给力哦！");
        } else {
            popMsg00(txt);
        }
    }

}

function showBlackDiv() {
    if ($('#backBlackDiv').length <= 0) {
        var backDiv = '<div id="backBlackDiv" style="position:absolute;left:0px;top:0px;height:' + document.body.scrollHeight + 'px;width:100%;z-index:999999999;background:rgba(0, 0, 0, 0);">';
        backDiv += '</div>';
        $('body').append(backDiv);
    } else {
        $('#backBlackDiv').css("height", document.body.scrollHeight + "px");
    }
    $('#backBlackDiv').fadeIn();
}


function popMsg00(msg, focusEle) {
    showBlackDiv();
    var divAndColseStr = '<div style="position:absolute;width:260px;background:rgba(0, 0, 0, 0.5);;border-radius:5px;">';
    divAndColseStr += '<div style="padding:30px 21px 30px 21px;line-height:16px;font-size:15px;color:#FFF;text-align:center">' + msg + '</div>';
    divAndColseStr += '</div>';

    popMsgClass5("classDBY4", divAndColseStr);
    if (popMsgHideTimer) {
        clearTimeout(popMsgHideTimer);
    }
    popMsgHideTimer = setTimeout('indexNum()', 2000);
}

function popMsgRead(msg, focusEle) {
    showBlackDiv();

    var divAndColseStr = '<img src="http://a.10086.cn/mmfs/image/28082/28082001.png" class="closetac">';
    divAndColseStr += '<div class="floawscuful" style="width:260px;"><p>' + msg + '</p></div>';
	
    popMsgClass5("classDBY4", divAndColseStr);
    if (popMsgHideTimer) {
        clearTimeout(popMsgHideTimer);
    }
    popMsgHideTimer = setTimeout('indexNum()', 2000);
  
  $('.closetac').bind('click', function() {
        $('.classDBY4').hide();
        $('#backBlackDiv').hide();
    });
}

//倒计时
function indexNum(){
	$(".classDBY4").fadeOut();
	$("#backBlackDiv").fadeOut();
}


function popMsgClass5(className, html, css) {

    var popMsgObj = $('.' + className);
    if (popMsgObj.length <= 0) {
        var popMsg = document.createElement('div');
        $(popMsg).attr('class', className)
        $('body').append(popMsg);
        popMsgObj = $('.' + className);
    }
    var _scrollHeight = window.pageYOffset;
    //获取当前窗口距离页面顶部高度
    var _windowHeight = $(window).height();
    //获取当前窗口高度
    //var _popupHeight = popMsgObj.height();
    var _popupHeight = 211;
    //获取弹出层高度
    _popupHeight = parseFloat(_popupHeight) || 0;
    _posiTop = (_windowHeight - _popupHeight) / 2 + _scrollHeight;
    if (!css || css == "") {
        popMsgObj.css({
            'position': 'absolute',
            'zIndex': 9999,
            'top': _posiTop + 'px',
            'left': '50%',
            'marginLeft': '-135px'
        });
    } else {
        popMsgObj.css(css);
    }
    if (!html) { 
        popMsgObj.fadeIn().html("<h6>网络不给力哦！<h6>");
        setTimeout(function() {
            $('.' + className).hide();
        }, 2500);
    } else {
        popMsgObj.fadeIn().html(html);
        $('#closespan5').bind('click', function() {
            $('.' + className).hide();
            $('#backBlackDiv').hide();
            //location.reload();
        });
    }
}

function getURLParameterValue(urlPath, paramName) {
    //不存在此参数,直接返回
    if (urlPath.indexOf(paramName + "=") < 0) {
        return null;
    }
    if (urlPath.indexOf("?" + paramName + "=") < 0 && urlPath.indexOf("&" + paramName + "=") < 0) {
        return null;
    }
    var searchParamName = "";
    if (urlPath.indexOf("/?" + paramName + "=") > -1) {
        searchParamName = "?" + paramName;
    }
    if (urlPath.indexOf("&" + paramName + "=") > -1) {
        searchParamName = "&" + paramName;
    }
    var reg = new RegExp("(/?|&)" + searchParamName + "=([^&^#]*)(&|#|$)");
    var r = urlPath.match(reg);
    //匹配目标参数

    if (r != null) {
        paramValue = unescape(r[2]);
        return paramValue;
    }
    return null;
    //返回参数值
}
