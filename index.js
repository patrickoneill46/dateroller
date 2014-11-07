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

	//helper function
	function isHoliday(date, numDays, calendar){

		calendar = calendar || 'UK';

		var clonedDate = new moment(date);
		if(numDays){
			clonedDate.add(numDays, 'days');
		}
		return BANK_HOLIDAYS[calendar].some(function(element){
			return clonedDate.isSame(element, 'day');
		});

	}

	//helper function
	function isSameMonth(originalDate, numDaysRoll){

		var newDate = moment(originalDate);
		newDate.add(numDaysRoll, 'days');
		return originalDate.isSame(newDate, 'month');
	}

	//helper function
	function isWeekDay(date){
		return [0, 6].indexOf(date.day()) === -1;
	}

	function rollDate(date, rollDayForwards, modified, calendar){

		var businessDayFound = false;
		var incrementer = rollDayForwards ? 1 : -1;

		while(!businessDayFound){

			//if its a weekday and not a holiday
			if(isWeekDay(date) && !isHoliday(date, incrementer, calendar)){

				businessDayFound = true;

			} else {

				//for modifiedFollowing and modifiedPrevious 
				//if the rolled date is in another month, roll the date the oppouisute way
				if(modified && !isSameMonth(date, incrementer)){
					incrementer *= -1;
				}
				//roll the day by one.
				date.add(incrementer, 'days');
			}
		}

		return date;
	}

	function following(date, calendar){

		if (!isWeekDay(date) && !isHoliday(date, calendar)) {
			rollDate(date, true, false, calendar);
		}

		return date;
	}
	function modifiedFollowing(date, calendar){

		if (!isWeekDay(date) && !isHoliday(date, calendar)){
			rollDate(date, true, true, calendar);
		}
		return date;
	}

	function previous(date, calendar){

		if (!isWeekDay(date) && !isHoliday(date, calendar)){
			rollDate(date, false, false, calendar);
		}
		return date;
	}

	function modifiedPrevious(date, calendar){

		if (!isWeekDay(date) && !isHoliday(date, calendar)){
			rollDate(date, false, true, calendar);
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
		modifiedPrevious: modifiedPrevious,
		isHoliday: isHoliday,
		isWeekDay: isWeekDay
	};
}
