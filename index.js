var fs = require('fs'),
	moment = require('moment'),
	events = require('events');

var eventEmitter = new events.EventEmitter();	

var NUM_DAYS_BY_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	BANK_HOLIDAYS = {};

if (process.env.HOLIDAY_JSON_PATH){

	var holidayJsonData = JSON.parse(fs.readFileSync(process.env.HOLIDAY_JSON_PATH));

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

module.exports = function(arrBankHolidays){

	BANK_HOLIDAYS = arrBankHolidays;

	//helper function
	function isHoliday(date, calendar){

		calendar = calendar || 'UK';

		//copy date

		// return BANK_HOLIDAYS[calendar].some(function(element){
		// 	return date.isSame(element, 'day');
		// });

		//ToDo look over this method.
		return false;
	}

	//helper function
	function isSameMonth(originalDate, numDaysRoll){

		var newDate = moment(originalDate);
		newDate.add(numDaysRoll, 'days');
		return originalDate.isSame()

	}

	//helper function
	function isWeekDay(nDayOfWeek){
		return [0, 6].indexOf(nDayOfWeek) === -1;
	}


	function following(date, calendar){

		console.log(isWeekDay(date.day()));

		if (!isWeekDay(date.day()) && !isHoliday(date, calendar)) {
			if (date.day() === 0){
				date.add(1, 'days');
			} else {
				date.add(2, 'days');
			}
		}

		return date;
	}
	function modifiedFollowing(date, calendar){

		if (!isWeekDay(date.day()) && !isHoliday(date, calendar)){
			if (date.day() === 0){
					date.add(-2, 'days');
				} else {
					date.add(-1, 'days');
			}
		}

		return date;
	}

	function previous(date, calendar){

		if (!isWeekDay(date.day()) && !isHoliday(date, calendar)){
			if (date.day() === 0){
					date.add(-2, 'days');
				} else {
					date.add(-1, 'days');
			}
		}
		return date;
	}

	function modifiedPrevious(date, calendar){

		if (!isWeekDay(date.day()) && !isHoliday(date, calendar)){
			if (date.day() === 0){
					date.add(-2, 'days');
				} else {
					date.add(-1, 'days');
			}
		}
		return date;

	}

	function actual(date, calendar){
		return date;
	}

	return {
		actual: actual,
		following: following,
		modifiedFollowing: modifiedFollowing,
		previous: previous,
		modifiedPrevious: modifiedPrevious
	};
}
