/**
 * New node file
 */
function sendSysMsg() {
	var memberId = $('#memberId').val();
	var content = $('#msgContent').val();
	if (content) {
		$.ajax({
			url : 'admin/member/sendSysMsg',
			type : 'POST',
			data : 'memberId=' + memberId + '&content=' + content,
			dataType : 'json',
			success : function(result) {
				alert("发送成功");
			},
			error : function(err) {
				alert("发送失败");
			}
		});
	}
}