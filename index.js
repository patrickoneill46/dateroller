var fs = require('fs'),
	moment = require('moment');


var NUM_DAYS_BY_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var BANK_HOLIDAYS = {};

if (process.env.HOLIDAY_JSON_PATH){

	fs.readFile(process.env.HOLIDAY_JSON_PATH, function(err, data){

		if (err){
			throw err
		} else{

			var holidayJsonData = JSON.parse(data);

			for (var market in holidayJsonData){

				BANK_HOLIDAYS[market] = [];

				holidayJsonData[market].forEach(function(holiday){
					
					BANK_HOLIDAYS[market].push(new moment({
						year: holiday.year,
						month: holiday.month,
						day: holiday.dayOfMonth
					}));
				});
			}
		}
	});
}

function isHoliday(date, sMarket){

	var dayOfMonth = date.day(),
		month = date.month();

	sMarket = sMarket || 'UK'

	return BANK_HOLIDAYS[sMarket].some(function(element){

		return date.isSame(element, 'day');

	});

}

function isWeekDay(nDayOfWeek){
	return [0, 6].indexOf(nDayOfWeek) === -1;
}
