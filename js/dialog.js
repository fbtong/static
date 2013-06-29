(function($) {       
	
	var overlay = '<div class="overlay"></div>';
		   //constructor, typeof,
		   //instanceof 返回一个 Boolean 值，指出对象是否是特定类的一个实例。 
	var screenHeight = window.screen.availHeight - 180,
		   screenWeight = window.screen.availWidth;
	
	var settings = {
			width : 450,
			height : 'auto',
			overlay : false,
			screenFull : false,
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
				screenHeight = $('.overlay').outerHeight() - 60;
			}
			
			$body.append(dialogEl);
			
			if(obj.content && (obj.content.constructor===Function)){
				obj.content.call(dialogEl);
			}else{
				dialogEl.innerHTML = obj.content || settings.content;
			}
			
			var dialogHeight = obj.height || $(dialogEl).height();
			
			if(obj.screenFull || settings.screenFull){
				dialogElLeft = parseInt(screenWeight/2 - dialogWidth/2);
				dialogElTop = parseInt(screenHeight/2 -  dialogHeight/2);
				$(dialogEl).css('left', dialogElLeft+'px').css('top', dialogElTop+'px');
			}else{
				dialogElLeft = elOffset.left + parseInt(elWidth/2) - parseInt(dialogWidth/2);
				dialogElTop = elOffset.top + parseInt(elWidth/2);
				$(dialogEl).css('left', dialogElLeft+'px').css('top', dialogElTop+'px');
			}
			
			$(obj.close).click(function(e){
				$(dialogEl).remove();
				$('.overlay').remove();
				e.preventDefault();
				e.stopPropagation();
			});
			/*$('body').on('click', (function(e){
				$(dialogEl).remove();
				$('.overlay').remove();
			});*/
			$('.'+settings.dialogClass).click(function(e){
				e.stopPropagation();
			});
		});
		
	};
	
})(jQuery);
