var fs = require('fs'),
	moment = require('moment'),
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

function loadHolidaysFromFile(filepath, callback){

	fs.readFile(filepath, function(err, data){

		console.log(filepath);

		if(err){
			server.emit('error loading file', err, filepath);
			callback(err);
		}

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
		server.emit('loaded');
		callback();
	});

};

exports.loadHolidaysFromFile = loadHolidaysFromFile;

exports.following = function (date, calendar){

	if (!isWeekDay(date) && !isHoliday(date, calendar)) {
		rollDate(date, true, false, calendar);
	}

	return date;
};

exports.modifiedFollowing = function (date, calendar){

	if (!isWeekDay(date) && !isHoliday(date, calendar)){
		rollDate(date, true, true, calendar);
	}
	return date;
};

exports.previous = function (date, calendar){

	if (!isWeekDay(date) && !isHoliday(date, calendar)){
		rollDate(date, false, false, calendar);
	}
	return date;
};

exports.modifiedPrevious = function (date, calendar){

	if (!isWeekDay(date) && !isHoliday(date, calendar)){
		rollDate(date, false, true, calendar);
	}
	return date;
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
	return originalDate.isSame(newDate, 'month');
}

//helper function
exports.isWeekDay = isWeekDay;

function isWeekDay (date){
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
