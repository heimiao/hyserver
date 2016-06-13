/**
 * 
 */
var myAjax = function(url, data, success, error) {
	$.ajax({
		type : 'POST',
		url : url,
		data : JSON.stringify(data),
		contentType : 'application/json',
		dataType : 'json',
		success : success,
		error : error
	});
}
function updateOrderSend(sender) {
	var orderId = $('#orderId').val() - 0;
	var expressInfo = $('#expressInfo').val();
	if(orderId){
		myAjax('mall/updateOrder', {orderId: orderId, state:'Send', 
			expressInfo: expressInfo}, 
			function(data){
				if(data.flag){
					alert(data.msg);
					history.go(0);
				} else {
					alert(data.msg);
				}
			},
			function(err){
				alert(err);
			});
	}
}
function updateOrderRecv(sender) {
	var orderId = $('#orderId').val() - 0;
	if(orderId){
		myAjax('mall/updateOrder', {orderId: orderId, state:'Recv'}, 
			function(data){
				if(data.flag){
					alert(data.msg);
					history.go(0);
				} else {
					alert(data.msg);
				}
			},
			function(err){
				alert(err);
			});
	}
}