/**
 * 弹出提示tip信息
 */
(function($){
	$.extend($.fn, {
		tip: function(text){
			var html = '<div class="tip"><i></i><div>'+text+'</div></div>';
			$(this.selector).hover(function(){
				$(html).insertAfter(this);
			}, function(){
				$(this).parent().find('.tip').remove();
			});
		}
	});
})(jQuery);