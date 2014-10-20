var fs = require('fs'),
	moment = require('moment');


var NUM_DAYS_BY_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var BANK_HOLIDAYS;

if (process.env.HOLIDAY_JSON_PATH){

	fs.readFile(process.env.HOLIDAY_JSON_PATH, function(err, data){

		if (err){
			throw err
		} else{
			BANK_HOLIDAYS = data;
		}
	});
}

function isHoliday(date){

	var dayOfMonth = date.day(),
		month = date.month();

}

function isWeekDay(nDayOfWeek){
	return [0, 6].indexOf(nDayOfWeek) === -1;
}