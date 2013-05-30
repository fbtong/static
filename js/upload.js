$(function(){
	
	var upRoot = $('#upfiles').data('root');
	
	var uploader = new plupload.Uploader({
		runtimes : 'html5,flash',
		browse_button : 'upfiles',
		container : 'upcontainer',
		max_file_size : '10mb',
		url : SERVERPATH + '/pc/upload/uploadfile?parent='+upRoot,
		flash_swf_url : SERVERPATH + '/static/app/skydrive/js/plugin/plupload.flash.swf',
		multi_selection:false
	});
	
	uploader.bind('Init', function(up, params) {
		$('#filelist').html("<div>Current runtime: " + params.runtime + "</div>");
	});

	uploader.init();

	uploader.bind('FilesAdded', function(up, files) {
		var fileType = 'bmp,jpg,jpeg,gif,png';
		
		fileType = fileType.replace(/,/g, '|');
		
		var fileRegExp = eval('/.*\.('+fileType+')$/'), tipInfo = '请选择正确的文件！';
		
		console.log(up.files.length);
		
		while(up.files.length > 4) {
            up.removeFile(up.files[0]);
        }
		
		$.each(files, function(i, file) {
			if( !(fileRegExp.test(file.name)) ){
				alert(tipInfo);
			} else {
				
			}
			/*if(file.size > max) {
				
			}*/
		});
		
		up.refresh();
		//uploader.start();
	});

	uploader.bind('FileUploaded', function(up, file) {
		window.location.reload();
	});
});