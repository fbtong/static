/**
 * 弹出提示tip信息
 * @param text 提示文本信息
 * @param tipWidth 单行信息宽度
 * @param tipLeft 提示tip相对左偏移
 * @param iLeft 提示i相对左偏移
 */
(function($){
	$.extend($.fn, {
		tip: function(text, tipWidth, tipLeft, iLeft){
			$(this.selector).hover(function(){
				var html = '<div class="tip"><i></i><div>'+text+'</div></div>';
				$(html).insertAfter(this);
				if (tipWidth && iLeft) {
					var elTip =$(this).parent().find('.tip');
					var elI = $(this).parent().find('i');
					elTip.css('width', tipWidth+'px');
					elTip.css('left', tipLeft+'px');
					elI.css('left', iLeft+'px');
				}
			}, function(){
				$(this).parent().find('.tip').remove();
			});
		}
	});
})(jQuery);