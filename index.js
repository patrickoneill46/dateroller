var	moment = require('moment'),
	EventEmitter = require('events').EventEmitter;

var server = new EventEmitter();
server.on('loaded', function(){
	console.log('data loaded');
});

var NUM_DAYS_BY_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	BANK_HOLIDAYS = {};

if (process.env.HOLIDAY_JSON_PATH){

	loadHolidaysFromFile(process.env.HOLIDAY_JSON_PATH, function(){
		console.log('Data loaded from env variable - HOLIDAY_JSON_PATH: ', process.env.HOLIDAY_JSON_PATH);
	});
}

function setHolidays(holidays){
    BANK_HOLIDAYS = holidays;
}

exports.setHolidays = setHolidays;

exports.following = function (date, calendar){

	return rollDate(date, true, false, calendar);
};

exports.modifiedFollowing = function (date, calendar){

	return rollDate(date, true, true, calendar);
};

exports.previous = function (date, calendar){

	return rollDate(date, false, false, calendar);
};

exports.modifiedPrevious = function (date, calendar){

	return rollDate(date, false, true, calendar);
};

exports.actual = function(date, calendar){
	return date;
};


function parseInput(input){
	var date = new moment();
	return date;
}

//helper function
exports.isHoliday = isHoliday; 

function isHoliday(date, numDays, calendar){

	if(calendar === undefined && typeof numDays === 'string'){
		calendar = numDays;
		numDays = null;
	}

	calendar = calendar || 'UK';
	var clonedDate = new moment(date);
	if(numDays){
		clonedDate.add(numDays, 'days');
	}
	return BANK_HOLIDAYS[calendar].some(function(element){
		return clonedDate.isSame(element, 'day');
	});
};

//helper function
function isSameMonth(originalDate, numDaysRoll){

	var newDate = moment(originalDate);
	newDate.add(numDaysRoll, 'days');
	// console.log(originalDate, newDate);
	// console.log('isSameMonth', originalDate.month(), newDate.month());
	return originalDate.isSame(newDate, 'month');
}

//helper function
exports.isWeekDay = isWeekDay;

function isWeekDay (date, numDays){

	var clonedDate = new moment(date);
	if(numDays){
		clonedDate.add(numDays, 'days');
	}

	return [0, 6].indexOf(clonedDate.day()) === -1;
}

function isBusinessDay(date, calendar){
	return isWeekDay(date) && !isHoliday(date, calendar);
}

function rollDate(date, rollDayForwards, modified, calendar){

	if(!isBusinessDay(date, calendar)){
		// console.log(date.date() + '/' + date.month() + '/' + date.year() + ' is not a business day. Rolling date...');
		var i = 0;

		var businessDayFound = false,
		 	incrementer = rollDayForwards ? 1 : -1;

		while(!businessDayFound){

			i++;
			// console.log(incrementer, 'incrementer');

			//for modifiedFollowing and modifiedPrevious 
			//if the rolled date is in another month, roll the date the oppouisute way
			if(modified && !isSameMonth(date, incrementer)){
				
				// console.log('reversing incrementer', i);
				incrementer *= -1;
				//reverse this iteration of the loops increment
			}

			// console.log('adding date', incrementer);
			date.add(incrementer, 'days');
			if(isBusinessDay(date, calendar)){
				// console.log('businessDayFound', i);
				businessDayFound = true;
			} 
		}
	}

	return date;
}
