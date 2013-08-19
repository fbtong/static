/**
 * 日期相关封装
 */
/* 0-9整数补0转双位 */
var nAdd0 = function(num) {
	return (num < 10) ? '0' + num : num;
};
(function($) {
	
	var dA = new Date();
	
	var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
	var settings = {
			year : dA.getFullYear(),
			month : dA.getMonth(),
			date : dA.getDate(),
			day : dA.getDay()
	};
	
	var year = settings.year,
		   month = nAdd0(settings.month + 1);
	
	if( ( (year%4 === 0) && (year%100 != 0) ) || (year%400 === 0)) {
		monthDays[1] = 29;
	}
	
	var getMonday = (function() {
		var dB = new Date();
		var day = settings.day;
		if(day === 0) {
		    day = 7;
		 }
		var dBTime = dA.getTime() - (day - 1)*86400000;
		dB.setTime(dBTime);
		return dB;
	})();
	
	var getSunday = (function() {
		var dB = new Date();
		var day = settings.day;
		if(day === 0) {
		    day = 7;
		 }
		var dBTime = dA.getTime() + (7 - day)*86400000;
		dB.setTime(dBTime);
		return dB;
	})();
	
	var getNextMonday = (function() {
		var dB = new Date();
		var day = settings.day;
		if(day === 0) {
		    day = 7;
		 }
		var dBTime = dA.getTime() + (7 - day + 1)*86400000;
		dB.setTime(dBTime);
		return dB;
	})();
	
	var getFriday = (function() {
		var dB = new Date();
		var day = settings.day;
		if(day === 0) {
		    day = 7;
		 }
		var dBTime = dA.getTime() + (7 - day - 2)*86400000;
		dB.setTime(dBTime);
		return dB;
	})();
	
	var getTomorrow = (function() {
		var dB = new Date();
		var day = settings.day;
		var dBTime = dA.getTime() + 86400000;
		dB.setTime(dBTime);
		return dB;
	})();
	
	var monthFirst = year + '/' + month + '/' + '01',
		   monthEnd = year + '/' + month + '/' + monthDays[settings.month],
		   monday = getMonday.getFullYear() + '/' + nAdd0((getMonday.getMonth() + 1)) + '/' + nAdd0(getMonday.getDate()),
		   sunday = getSunday.getFullYear() + '/' + nAdd0((getSunday.getMonth() + 1)) + '/' + nAdd0(getSunday.getDate()),
		   nextMonday = getNextMonday.getFullYear() + '/' + nAdd0((getNextMonday.getMonth() + 1)) + '/' + nAdd0(getNextMonday.getDate()),
		   friday = getFriday.getFullYear() + '/' + nAdd0((getFriday.getMonth() + 1)) + '/' + nAdd0(getFriday.getDate()),
		   today = dA.getUTCFullYear() + '/' + nAdd0((dA.getUTCMonth() + 1)) + '/' + nAdd0(dA.getUTCDate()),
		   tomorrow = getTomorrow.getFullYear() + '/' + nAdd0((getTomorrow.getMonth() + 1)) + '/' + nAdd0(getTomorrow.getDate());
	
	$.fn.date = function(O) {
		
		if (O) {
			$(O.monthFirst).val(monthFirst);
			$(O.monthEnd).val(monthEnd);
			$(O.monday).val(monday);
			$(O.sunday).val(sunday);
			$(O.nextMonday).val(nextMonday);
			$(O.friday).val(friday);
			$(O.today).val(today);
			$(O.tomorrow).val(tomorrow);
		}
		
		return {
			'monthFirst' : monthFirst,
			'monthEnd' : monthEnd,
			'monday' : monday,
			'sunday' : sunday,
			'nextMonday' : nextMonday,
			'friday' : friday,
			'today' : today,
			'tomorrow' : tomorrow
		}
	};
	
})(jQuery);