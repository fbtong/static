<?php
$title = "时光胶囊 TimeCapsule - 首页";
?>
<?php include('conf/header.php');  ?>
	
	<?php include('conf/nav.php');  ?>
 	<article>
 		<h1>时光胶囊 TimeCapsule</h1>
 		<section class="first">
 			<p>在阅读本文档之前，请各位绑定hosts</p>
 			<textarea id="demotext">
//hosts路径
C:\Windows\System32\drivers\etc\hosts

//打开文件后，在文件最后加入下面一行
10.180.128.198 static.yxtech.cn</textarea>
 			<p>此项目目前针对事务管理前端整理前端文档，包括图片、样式、js三方面的使用情况介绍，以提供示例为主。对左边栏导航在事务管理的作用，描述如下：</p>
 			<ol>
 				<li>1. <a href="<?php echo staticPath; ?>/img/">img</a>为使用的图片。</li>
 				<li>2. <a href="<?php echo staticPath; ?>/css/">css</a>为通用的css模块</li>
 				<li>3. <a href="<?php echo staticPath; ?>/js/">js</a>为通用的js组件</li>
 				<li>4. <a href="<?php echo staticPath; ?>/html/">html</a>是事务管理里的交互示例和展示示例</li>
 			</ol>
 		</section>
 		
 		<section>
 			<h2>目前项目整理要点</h2>
 			<ul>
 				<li>1. 文件上传插件plupload</li>
 				<li>2. 弹出框<a href="<?php echo staticPath; ?>/html/dialog.php">dialog</a></li>
 				<li>3. 日历控件calendar</li>
 				<li>4. 目录树ztree</li>
 				<li>5. 复选框checkbox</li>
 				<li>6. 单选框radio</li>
 				<li>7. 下拉框selectbox</li>
 				<li>8. 进度刻度slider</li>
 				<li>9. 表单<a href="<?php echo staticPath; ?>/html/form.php">form</a></li>
 			</ul>
 		</section>
 		
 		<section>
 			<h2>待升级的组件</h2>
 			<ul>
 				<li>下拉框</li>
 				<li>进度刻度</li>
 			</ul>
 		</section>
 		
 		<section>
 			<h2>mysql端口</h2>
 			<ul>
 				<li>10.180.128.198:3306 root  remote</li>
 				<li>GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'youpassword' WITH GRANT OPTION;</li>
 				<li>进度刻度</li>
 			</ul>
 		</section>
 		
 	</article>
 	<script>
    var editor = CodeMirror.fromTextArea(document.getElementById("demotext"), {
      lineNumbers: true,
      mode: "text/html",
      matchBrackets: true
    });
  </script>

<?php include('conf/footer.php');  ?>