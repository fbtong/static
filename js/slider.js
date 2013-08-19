/**
  *<dd class="slider-out">
					<div class="slider" data-value="0" data-max="100">
						<div class="slider-range"></div>
						<a href="#" class="slider-handle">0</a>
						<input type="text" name="progress" class="text w1 slider-input" value="${(progressAO.progress)!0}">
					</div>
				</dd>
  */
/**
 * 定制 slide widget
 */
$(function(){
	$('.layout').on('mousedown', '.slider-handle', function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		var $This = $(this),
			   $slider = $This.parent(),
			   $range = $This.prev(),
			   $sliderInput = $This.next();
		
		var sliderXY = $slider.offset(),
			   thisXY = $This.offset();
		
		var sliderWidth = $slider.width();
		
		var sX = sliderXY.left, sY = sliderXY.top;
		
		$This.addClass('hover');
		
		$(document).mousemove(function(e) {
			 var X = e.pageX, Y = e.pageY;
			 if(X > sX && X < (sX + sliderWidth)) {
				 var range = X-sX;
				 $This.css('left', range - 6 + 'px');
				 var progress = range/sliderWidth*100;
				 if (progress < 0.5) {
					 progress = 0;
				 } else if ( progress < 1) {
					 progress = 1;
				 } else {
					 progress = Math.ceil(progress);
				 }
				 $range.css('width', progress + '%');
				 $sliderInput.val(progress);
				 $This.text(progress);
			 }
			 e.stopPropagation();
		});
		
		$(document).mouseup(function(e) {
			$(document).unbind('mousemove');
			$This.unbind('mousedown');
			$This.unbind('click');
			$This.removeClass('hover');
		});
		
	});
	$('.layout').on('click', '.slider', function(e) {
		e.stopPropagation();
		
		var $This = $(this),
		   $slider = $This.parent();
	
		var sliderXY = $slider.offset(),
			   thisXY = $This.offset();
		
		var sliderWidth = $slider.width();
		
		var sX = sliderXY.left, sY = sliderXY.top;
		var X = e.pageX, Y = e.pageY;
		 if(X > sX && X < (sX + sliderWidth)) {
			 //console.log(sX, sY, sliderWidth);
		 }
		
		return false;
	});
	$('.layout').on('click', '.slider-input', function(e) {
		e.stopPropagation();
	});
	$('.layout').on('keyup', '.slider-input', function(e) {
		var $This = $(this),
			   $handle = $This.prev(),
			   $range = $handle.prev(),
			   $slider = $This.parent();
		
		var r = /^[1-9]([0-9]{0,2})$/;
		
		var sVal = $This.val();
		
		var sliderWidth = $slider.width();
		
		if(r.test(sVal) && sVal > 0 && sVal <= 100) {
			sliderLeft = (sliderWidth * sVal / 100) -6;
			$handle.text(sVal).css('left', sliderLeft);
			$range.css('width', sVal + '%');
		} else {
			$This.val('');
		}
		
		e.stopPropagation();
	});
});