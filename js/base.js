/* 滚动条移位 */
var $scrollBody = $('.scroll-body');
var elListHeight = $('.scroll-body .list').outerHeight();
if(elListHeight > $scrollBody.outerHeight()) {
	$scrollBody.addClass('mr');
} else {
	$scrollBody.removeClass('mr');
}
/* 数字转数组 */
var numArr = function(num){
	var arr = [];
	for(var i=1; i <= num; i++){
		arr.push(i);
	}
	return arr;
};
/*
 * 删除数组
 */
Array.prototype.remove = function(ind){
	var a = this.indexOf(ind);
	if (a >= 0) {
	this.splice(a, 1);
	return true;
	}
	return false;
};