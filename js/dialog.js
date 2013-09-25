/**
 * 微博方式弹窗
 * @author yangkang
 */
(function($) {       
	
	//var overlay = '<div class="overlay"></div>';
		   //constructor, typeof,
		   //instanceof 返回一个 Boolean 值，指出对象是否是特定类的一个实例。 
	
	var createEl = function(tag) {
			var el = document.createElement(tag);
			return el;
	};
	
	var settings = {
			width : 450,
			height : 'auto',
			overlay : false,
			screenFull : false,
			content : '',
			dialogClass : 'dialog'
	};
	
	var popFn = function(dialogEl, obj, This) {
		var screenHeight = $(window).height();//window.screen.availHeight - 180,
		       screenWeight = $(window).width();//window.screen.availWidth;
		       
		 var $This = obj.target || This;
		
		var overlay =  createEl('div');
		$(overlay).addClass('overlay');
		
		var dialogWidth= obj.width || settings.width;
		$(dialogEl).addClass(settings.dialogClass).css('width', dialogWidth);
		$('body').append(dialogEl);
		
		if(obj.overlay || settings.overlay) {
			$('body').append(overlay);
		}
		
		if(obj.content && (obj.content.constructor===Function)) {
			obj.content.call(dialogEl, $This);
		} else {
			dialogEl.innerHTML = obj.content || settings.content;
		}
		
		if($This !== undefined && $This.constructor !== String) {
			$(dialogEl).find('h2 em').text($This.text());
		}
		
		var dialogHeight = obj.height || $(dialogEl).height();
		
		if(obj.screenFull || settings.screenFull) {
			dialogElTop = parseInt(screenHeight/2 -  dialogHeight/2);
			dialogElLeft = parseInt(screenWeight/2 - dialogWidth/2);
			if(obj.ishome === 'home') {
				dialogElLeft = 280;
			}
			$(dialogEl).css('left', dialogElLeft+'px').css('top', dialogElTop+'px');
		}else{
    	    elHeight = $This.outerHeight(),
    	    elWidth = $This.outerWidth(),
    	    elOffset = $This.offset();
			
			dialogElTop = elOffset.top + parseInt(elHeight);
			dialogElLeft = elOffset.left + parseInt(elWidth/2) - parseInt(dialogWidth/2);
			$(dialogEl).css('left', dialogElLeft+'px').css('top', dialogElTop+'px').css('position', 'absolute');
		}

		$(dialogEl).on('click', obj.close, function(e) {
			$(dialogEl).remove();
			$(overlay).remove();
			e.preventDefault();
			e.stopPropagation();
		});
		
		$(dialogEl).on('click', '.submit-fn', function(e) {
			var $this = $(this);
			var isClose = true;
			if(obj.submitFn && (obj.content.constructor===Function)) {
				isClose  = obj.submitFn($this); //当为false时阻止关闭窗口
			}
			if (isClose) {
				$(dialogEl).remove();
				$(overlay).remove();
				e.preventDefault();
				e.stopPropagation();
			}
		});
		
		
		$(dialogEl).mouseenter(function() {
			$(this).find('h2').removeClass('hide');
		});
		$(dialogEl).mouseleave(function() {
			$(this).find('h2').addClass('hide');
		});
		
		$(dialogEl).on('mousedown', 'h2', function(e) {
		//$(dialogEl).find('h2').mousedown(function(e) { 
			$(document).mousemove(function(e) {
				 var X = e.pageX, Y = e.pageY;
				 
				 var dialogX = $(dialogEl).offset().left, dialogY = $(dialogEl).offset().top;
				 var dialogTop = Number($(dialogEl).css('top').replace('px', ''));
				 var dialogHalfWidth = $(dialogEl).outerWidth()/2;
				
				 $(dialogEl).css('left', (X-dialogHalfWidth)+'px');
				 if (dialogY > Y) {
					 var stepY = dialogY - Y;
					 var moveTop = dialogTop - stepY;
					 if(moveTop < 20) {
						 moveTop = 20;
					 }
					 $(dialogEl).css('top', moveTop+'px');
				 } else if (dialogY < Y) {
					 var stepY = Y - dialogY;
					 var moveTop = dialogTop + stepY;
					 if(moveTop > (screenHeight - 5)) {
						 moveTop = screenHeight - 5;
					 }
					 $(dialogEl).css('top', moveTop+'px');
				 }
				 e.stopPropagation();
			});
			
			$(document).mouseup(function(e) {
				$(document).unbind('mousemove');
			});
		});
		/*$('.'+settings.dialogClass).click(function(e) {
			//e.stopPropagation();
		});*/
	};
	
	$.dialog = function(obj) {
		var dialogEl = createEl('div');
		if (obj.autoload) {
			popFn(dialogEl, obj);
		}
	};
	
	$.fn.dialog = function(obj) {
		
		var dialogEl = createEl('div');
		
		if (obj.autoload) {
			popFn(dialogEl, obj);
		}
		
		var bind = $(obj.bind).length > 0 ?  obj.bind : document.body;
		
		$(bind).on('click', this.selector, function(e) {
			e.preventDefault();
			//e.stopPropagation();
			popFn(dialogEl, obj, $(this));
		});
		
	};
	
})(jQuery);

/**
 * dialog表单html结构
 * @param submitId 提交函数
 * @param html 插入对话框代码
 * @param alert true|false
 */
var dialogForm = function (submitId, html, isAlert) {
	var insertCode = html || '';
	var form = '<div class="dialog-head"><h2 class="hide"><em></em><span class="close">close</span></h2></div>';
	form += '<div class="dialog-content">' + insertCode + '</div>';
	form += '<div class="dialog-foot">';
	if (isAlert) {
		form += '<span class="submit"><input type="button" value="确定" id="' +submitId+ '" class="submit-fn"></span>';
	} else {
		form += '<span class="submit"><input type="button" value="提交" id="' +submitId+ '" class="submit-fn"></span>';
		form += '<a class="reset close">取消</a>';
	}
	form += '</div>';
	return form;
};

/**
  * 参与执行人弹出模板
  */
var dialogModel1 = function (html1, html2) {
	var model = '<div class="job">';
	model += '<label class="radio bar checked do-radio-job"><a><input type="radio" name="job-class" value="1" checked="checked">按部门</a></label>';
	model += '<label class="radio bar do-radio-job"><a><input type="radio" name="job-class" value="2">按职位</a></label>';
	model += '</div>';
	model += '<div class="g1">';
	model += '<div class="dialog-search">';
	model += '<input id="searchText" type="text" placeholder="查找人员、部门" class="text"><a class="go"  id="searchDialog"><input type="button" value=" "></a>';
	model += '</div>';
	model += '<div class="code">'+html1+'</div>';
	model += '</div>';
	model += '<div class="g2">';
	model += '<a class="arrow do-add2right"></a>';
	model += '</div>';
	model += '<div class="code g3">'+html2+'</div>';
	model += '<div class="clear"></div>';
	return model;
};
/**
 * 指定执行人
 */
var dialogModel2 = function (html1, html2) {
	//var model = '<div class="h3"><span>已有参与人</span></div>';
	//model += '<div class="code c1">' +html1+ '</div>';
	var model = html1;
	model += '<div class="h3"><span>全部人员</span> ';
	model += '<label class="radio bar checked do-radio-job"><a><input type="radio" name="job-class" value="1" checked="checked">按部门</a></label>';
	model += '<label class="radio bar do-radio-job"><a><input type="radio" name="job-class" value="2">按职位</a></label></div>';
	model += '<div class="g1">';
	model += '<div class="dialog-search">';
	model += '<input id="searchText" type="text" placeholder="查找人员、部门" class="text"><a class="go"  id="searchDialog"><input type="button" value=" "></a>';
	model += '</div>';
	model += '<div class="code c2">'+html2+'</div>';
	model += '</div>';
	model += '<div class="clear"></div>';
	return model;
};
/**
  * 进度对话框
  */
var dialogProgress = function(progress) {
	var nProgress = progress || 0;
	var model = '<div class="slider" data-value="'+nProgress+'" data-max="100">';
	model += '<a href="#" class="slider-current">'+nProgress+'</a>';
	model += '<div class="slider-range"></div>';
	model += '<a href="#" class="slider-handle hide">0</a>';
	model += '<input type="hidden" name="progress" class="text w1 slider-input" value="'+nProgress+'">';
	model += '</div>';
	return model;
};
/**
  * 模拟浏览器confirm对话框
  */
var dialogConfirm = function (text, alertFn, This) {
	
	var alertText = '<div class="alert">'+text+'</div>';
	
	$.dialog({
		target : This,
		width : 230,
		autoload: true,
		overlay:true,
		screenFull:true,
		close : '.close',
		submitFn : function () {
			if(alertFn && (alertFn.constructor===Function)) {
				alertFn();
			}
			var isClose = true;
			return isClose;
		},
		content : function(el) {
			var dialog = this;
			var doFrom = dialogForm('do-alert-submit', alertText);
			$(dialog).html(doFrom); //插入弹出框
			
			$(dialog).find('h2 em').text('确认');
		}
	});
};
/**
 * 模拟浏览器Alert对话框
 */
var dialogAlert = function (text, complex) {
	
	var alertText = '<div class="alert">'+text+'</div>';
	
	$.dialog({
		target : complex,
		width : 230,
		autoload: true,
		overlay:true,
		screenFull:true,
		close : '.close',
		ishome : complex,
		content : function(el) {
			var dialog = this;
			var doFrom = dialogForm('do-alert-submit', alertText, true);
			$(dialog).html(doFrom); //插入弹出框
			
			$(dialog).find('h2 em').text('确认');
		}
	});
};