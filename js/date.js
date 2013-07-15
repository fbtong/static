/**
 * 日期相关封装
 */
(function($){
	
	var dA = new Date();
	
	var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
	var settings = {
			year : dA.getFullYear(),
			month : dA.getMonth(),
			date : dA.getDate(),
			day : dA.getDay()
	};
	
	var nAdd0 = function(num){
		return (num < 10) ? '0' + num : num;
	};
	
	var year = settings.year,
		   month = nAdd0(settings.month + 1);
	
	if( ( (year%4 == 0) && (year%100 != 0) ) || (year%400 == 0)) {
		monthDays[1] = 29;
	}
	
	var getMonday = (function(){
		var dB = new Date();
		var day = settings.day;
		if(day == 0){
		    day = 7;
		 }
		var dBTime = dA.getTime() - (day - 1)*86400000;
		dB.setTime(dBTime);
		return dB;
	})();
	
	var getSunday = (function(){
		var dB = new Date();
		var day = settings.day;
		if(day == 0){
		    day = 7;
		 }
		var dBTime = dA.getTime() + (7 - day)*86400000;
		dB.setTime(dBTime);
		return dB;
	})();
	
	var monthA = year + '/' + month + '/' + '01',
		   monthB = year + '/' + month + '/' + monthDays[settings.month],
		   mondayDate = getMonday.getFullYear() + '/' + nAdd0((getMonday.getMonth() + 1)) + '/' + nAdd0(getMonday.getDate()),
		   sundayDate = getSunday.getFullYear() + '/' + nAdd0((getSunday.getMonth() + 1)) + '/' + nAdd0(getSunday.getDate());
	
	$.fn.date = function(O){
		$(O.monthA).val(monthA);
		$(O.monthB).val(monthB);
		$(O.monday).val(mondayDate);
		$(O.sunday).val(sundayDate);
	};
	
})(jQuery);