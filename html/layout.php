<!DOCTYPE  html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<title>test</title>
		<link type="text/css" rel="stylesheet" charset="utf-8" href="css/reset.css">
		<link type="text/css" rel="stylesheet" charset="utf-8" href="css/base.css">
		<link type="text/css" rel="stylesheet" charset="utf-8" href="css/layout.css">
		<script type="text/javascript" src="js/jquery.min.js"></script>
	</head>
	<body>
	/* float grid layout */
	<div class="layout">
		<div class="col-nav">
			<a href="#1">grid-1</a>
		</div>
		
		<div class="col-main">
			<a href="#main">main</a>asdfasdfasdf
		</div>
		
		<div class="col-filter">
			<a href="#2">grid-2</a>
		</div>
		
	</div>
	
	<div class="clearfix">
		<div class="col-m-1">
			左边栏 <a href="#sdfj">测试连接</a>
		</div>
		<div class="col-m-2">
			<div class="in">自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容<br>自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容<br>自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容自适应主体内容<br>....</div>
		</div>
		<div class="col-m-3">右边栏</div>
	</div>
	
	/* table layout */
	<div class="table">
		<div class="row">
			<div class="cell">a</div>
			<div class="cell">b</div>
			<div class="cell">c</div>
		</div>
		<div class="row">
			<div class="cell">d</div>
			<div class="cell">e</div>
			<div class="cell">f</div>
		</div>
	</div>
	/* position layout */
	<!-- 
	<div class="col-1">
	col-1
	</div>
	<div class="col-2">
	col-2
	</div>
	<div class="col-3">
	col-3
	</div> -->
	
	/* flexbox layout */
	<div class="box">
		<div class="box-1">
		col-1
		</div>
		<div class="box-2">
		col-2
		</div>
		<div class="box-3">
		col-3
		</div>
	</div>
	
	/* 事件重叠时，href绑定 */
	<a class="ii Jtip" href="javascript:aa()"><i class="icon-share"></i></a>
	/* upload */
	<div class="upload">
		<form id="JUploadform" action="url" method="post" enctype="multipart/form-data" target="JUploadFrame">
			<iframe name="JUploadFrame" id="JUploadFrame" class="hidden"></iframe>
			<a class="btn" href="#">上传文件</a>
			<input type="file" class="file" id="JfileUploader" name="JfileUploader" accept="image/gif, image/jpeg, image/png">
		</form>
	</div>

	<div class="form-data">
		<dl>
			<dt>text</dt>
			<dd><input type="text" class="text" value=""></dd>
		</dl>
	</div>
	<div class="form-data">
		<dl>
			<dt>text</dt>
			<dd><input type="text" class="text" value=""></dd>
		</dl>
	</div>
	<div class="box-shadow">
		<a href="#" id="a-toggle">test toggle</a>
		<div id="test-toggle">now show, next will hidden.</div>
	</div>
	<div class="bword" style="width:200px;">21564545123123sadfasdfa21564545123123sadfasdfasdfasdfasdf21564545123123sadfasdfasdfasdfasdf21564545123123sadfasdfasdfasdfasdfsdfasdfasdf</div>
	<script type="text/javascript">
		
		var form = (function(){
			
			//form setup
			
			return {
				defaultSet : function(formEls, formElsDefault){
					formEls.each(function(i, el){
						var cDv = formElsDefault[i];
						$(el).val(cDv).addClass('default');
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
						})
					});
				}
			}
			
		})();
		(function($){
			$.extend($.fn, {
				form : function(){
					var formEls = $(this.selector);
					return {
						defaultSet : function(formElsDefault){
							formEls.each(function(i, el){
								var cDv = formElsDefault[i];
								$(el).val(cDv).addClass('default');
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
								})
							});
						}
					}
				}
			});
		})(jQuery);
	
		$(function(){
			
				var formElsDefault = ['默认值1', '默认值2'];
				//form.defaultSet($('.text'), formElsDefault);
				$('.text').form().defaultSet(formElsDefault);
				$('#a-toggle').click(function(){
					$('#test-toggle').toggle();
					if($('#test-toggle').css('display')=='block') {
						$('#test-toggle').html('asdfasdfsadf');
					} else {
						$('#test-toggle').html('');
					}
				});
		});
	</script>
	</body>
</html>