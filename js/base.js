/* 滚动条移位 */
var $scrollBody = $('.scroll-body');
var elListHeight = $('.scroll-body .list').outerHeight();
if(elListHeight > $scrollBody.outerHeight()) {
	$scrollBody.addClass('mr');
} else {
	$scrollBody.removeClass('mr');
}
