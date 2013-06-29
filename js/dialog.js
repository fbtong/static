(function($) {       
	
	var overlay = '<div class="overlay"></div>';
		   //dialog = '<div class="dialog"></div>',
		   //constructor, typeof, 
		//instanceof 返回一个 Boolean 值，指出对象是否是特定类的一个实例。 
	
	var settings = {
			width : 450,
			height : 'auto',
			overlay : false,
			content : '',
			dialogClass : 'dialog'
	};
	
	var createEl = function(tag, className){
		var el = document.createElement(tag);
		el.setAttribute('class', className);
		return el;
	};
	
	$.fn.dialog = function(obj) {
	    
		var $body = $('body'),
			   $This = $(this),
			   elOffset = $This.offset(),
			   elHeight = $This.outerHeight(),
			   elWidth = $This.outerWidth();
		var dialogEl = createEl('div', settings.dialogClass);
		
		var dialogWidth= obj.width || settings.width;
		$(dialogEl).css('width', dialogWidth);
		
		$(this).click(function(e){
			e.preventDefault();
			e.stopPropagation();
			
			if(obj.overlay || settings.overlay) {
				$body.append(overlay);
			}
			
			dialogElLeft = elOffset.left + parseInt(elWidth/2) - parseInt(dialogWidth/2);
			dialogElTop = elOffset.top + parseInt(elWidth/2);
			
			if(obj.content && (obj.content.constructor===Function)){
				obj.content.call(dialogEl);
			}else{
				dialogEl.innerHTML = obj.content || settings.content;
			}
			
			$(dialogEl).css('left', dialogElLeft+'px');
			$(dialogEl).css('top', dialogElTop+'px');
			dialogEl.setAttribute('id', obj.id);
			
			$body.append(dialogEl);
			
			$(obj.close).click(function(e){
				$(dialogEl).remove();
				$('.overlay').remove();
				e.preventDefault();
				e.stopPropagation();
			});
			$(document).click(function(e){
				$(dialogEl).remove();
				$('.overlay').remove();
			});
			$('.'+settings.dialogClass).click(function(e){
				e.stopPropagation();
			});
		});
		
	};
	
})(jQuery);
