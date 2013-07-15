/**
 * 设置表单元素默认值
 * @param selector  选择器
 * @param formElsDefault  默认数组 
 */
(function($){
	
	var defaultSet = function(formEls, formElsDefault){
		formEls.each(function(i, el){
			var cDv = formElsDefault[i];
			var v = $.trim($(el).val());
			if (v.length === 0 || v == cDv) {
				$(el).val(cDv).addClass('default');
			}
			$(el).focus(function(){
				var cV = $.trim($(this).val());
				if(cV.length === 0 || cV == cDv) {
					$(this).val('');
				}
				$(this).removeClass('default');
			});
			$(el).blur(function(){
				var cV = $.trim($(this).val());
				if(cV.length === 0 || cV == cDv) {
					$(this).val(cDv);
					$(this).addClass('default');
				}
			});
		});
	};
	
	$.extend($.fn, {
		formDefaultSet : function(formElsDefault){
			defaultSet($(this), formElsDefault);
		},
		formElEdit : function(sUrl, param, target){
			var $This = $(this);
			var $parent = $This.parent();
			
			$parent.append('<div class="form-el-edit"><input type="text" class="text"> <a class="submit">确定</a> <a class="close">取消</a></div>');
			
			var $target =  ($parent.find(target).length > 0) ? $parent.find(target) : $parent.find('.target');
			var sText = $target.text();
			$parent.find('.text').val(sText);
			
			$('.submit', $parent).click(function(){
				var $prev = $(this).prev();
				var name = $.trim($prev.val());
				
				param += name;
				
				if(name.length === 0 || name === sText){
					alert('请重新输入分类名称！');
				} else {
					$.ajax({
						url :sUrl,
						type: 'POST',
						data : param
					}).done(function(data){
						if(data.succeed) {
							$target.text(name);
							$parent.find('.form-el-edit').remove();
						} else {
							alert(data.msg);
						}
					}).fail(function(jqXHR, error){
						alert(jqXHR.responseText);
					});
				}
			});
			$('.close', $parent).click(function(){
				$parent.find('.form-el-edit').remove();
			});
		}
	});
})(jQuery);