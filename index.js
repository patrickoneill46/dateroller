var	moment = require('moment'),
	EventEmitter = require('events').EventEmitter;

var BANK_HOLIDAYS = {},
    DATE_FORMAT = {
        US: 'MM-DD-YYYY',
        ISO: 'YYYY-MM-DD',
        UK: 'DD-MM-YYYY'
    },
    activeDateFormat = DATE_FORMAT.UK,
    events = new EventEmitter();

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

exports.setDateFormat = function(format){
    activeDateFormat = DATE_FORMAT[format];
};

exports.addDateFormat = function(name, sample, format){
    if ( new moment(sample, format).isValid() ){
        DATE_FORMAT[name] = format;
    }
};


function parseInput(input){
	var date = new moment(input, activeDateFormat);
	if(!date.isValid()){
	    console.log('error: ', input, ' is not a valid date input');
	    return false;
	}
	return date;
}

//helper function
exports.isHoliday = isHoliday; 

function isHoliday(date, numDays, calendar){

    date = parseInput(date);

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

	var newDate = moment(originalDate, activeDateFormat);
	newDate.add(numDaysRoll, 'days');
	return originalDate.isSame(newDate, 'month');
}

//helper function
exports.isWeekDay = isWeekDay;

function isWeekDay (date, numDays){

	var clonedDate = new moment(date, activeDateFormat);
	if(numDays){
		clonedDate.add(numDays, 'days');
	}

	return [0, 6].indexOf(clonedDate.day()) === -1;
}

function isBusinessDay(date, calendar){

	return isWeekDay(date) && !isHoliday(date, calendar);
}

function rollDate(date, rollDayForwards, modified, calendar){

    date = parseInput(date);

    if(!date){
        return false;
    }

	if(!isBusinessDay(date, calendar)){

		var i = 0;

		var businessDayFound = false,
		 	incrementer = rollDayForwards ? 1 : -1;

		while(!businessDayFound){

			i++;

			//for modifiedFollowing and modifiedPrevious 
			//if the rolled date is in another month, roll the date the oppouisute way
			if(modified && !isSameMonth(date, incrementer)){
				
				incrementer *= -1;
				//reverse this iteration of the loops increment
			}

			date.add(incrementer, 'days');
			if(isBusinessDay(date, calendar)){
				businessDayFound = true;
			} 
		}
	}

	return date;
}
