<?php
$title = "时光胶囊 TimeCapsule - dialog弹出框使用示例";
?>
<?php include('../conf/header.php');  ?>
	<link type="text/css" rel="stylesheet"charset="utf-8" href="<?php echo staticPath; ?>/css/form.css">
	<link type="text/css" rel="stylesheet"charset="utf-8" href="<?php echo staticPath; ?>/css/dialog.css">
	<script type="text/javascript" src="<?php echo staticPath; ?>/js/dialog.js"></script>

	<?php include('../conf/nav.php');  ?>
 	<article>
 			<h1>时光胶囊 TimeCapsule</h1>
 			
 			<section>
				<h2>dialog弹出框使用示例</h2>
				<p>这里会列举出两种类型的弹窗：1、自动加载弹窗，2、点击后弹窗</p>
				<p>使用这个插件之前，请在页面中引入以下文件：</p>
				
			</section>
			
			<section>
				<h2>1、自动加载弹窗</h2>
				<p>
				<textarea id="demotext">
$.dialog({
		width : 230,
		autoload: true,
		overlay:true,
		screenFull:true,
		close : '.close',
		content : function(el) {
			var dialog = this;
			var doFrom = dialogForm('do-submit', 'content');
			$(dialog).html(doFrom); //插入弹出框
		}
});
				</textarea>
				</p>
			</section>
			
			<section>
				<h2>2、点击后弹窗</h2>
				<p>
				<textarea id="demotext2">
//点击此元素即可弹出
<a href="" id="test-dialog">弹出框1</a>
//调用方法
$('#test-dialog').dialog({
		width:450,
		overlay:true,
		screenFull:true,
		close : '.close',
		content: function(el) {
			var dialog = this;
			var doFrom = dialogForm('do-submit', 'content');
			$(dialog).html(doFrom); //插入弹出框
		}
});
				</textarea>
				</p>
			</section>
			<div><a href="" id="test-dialog">弹出框1</a>  <a href="" id="test-dialog2">弹出框2</a> </div>
 		</article>
		
		
		<script type="text/javascript">
$(function(){
	$('#test-dialog').dialog({
		width:450,
		overlay:true,
		screenFull:true,
		close : '.close',
		content: function(el) {
			var dialog = this;
			var doFrom = dialogForm('do-submit', 'content');
			$(dialog).html(doFrom); //插入弹出框
		}
	});
	$('#test-dialog2').dialog({
		width:300,
		close : '.close',
		content:function(el){
			var s1 = 'dsafasdfasdfasdfasdfasdfasdfasdf<a href="#" class="close">close</a>';
			this.innerHTML = s1;
		}
	});
	
	var editor1 = CodeMirror.fromTextArea(document.getElementById("demotext"), {
	      lineNumbers: true,
	      mode: "text/html",
	      matchBrackets: true
	    });
	
	 var editor2 = CodeMirror.fromTextArea(document.getElementById("demotext2"), {
	      lineNumbers: true,
	      mode: "text/html",
	      matchBrackets: true
	    });
	/* $.dialog({
		width : 230,
		autoload: true,
		overlay:true,
		screenFull:true,
		close : '.close',
		content : function(el) {
			var dialog = this;
			var doFrom = dialogForm('do-submit', 'content');
			$(dialog).html(doFrom); //插入弹出框
		}
	}); */
});
		</script>

<?php include('../conf/footer.php');  ?>