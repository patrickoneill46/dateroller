'use strict';

var	moment = require('moment');

var BANK_HOLIDAYS = {},
    DATE_FORMAT = {},
    DEFAULT_DATE_FORMAT = 'uk',
    activeDateFormat = DEFAULT_DATE_FORMAT;

Object.defineProperties(DATE_FORMAT, {
    'us': {
        writeable: false,
        value: 'MM/DD/YYYY'
    },
    'uk': {
        writeable: false,
        value: 'DD/MM/YYYY'
    },
    'iso': {
        writeable: false,
        value: 'YYYY/MM/DD'
    }
});

function setHolidays(holidays){
    BANK_HOLIDAYS = holidays;
}

exports.setHolidays = setHolidays;

exports.following = function (date, calendar) {

	return rollDate(date, true, false, calendar);
};

exports.modifiedFollowing = function (date, calendar) {

	return rollDate(date, true, true, calendar);
};

exports.previous = function (date, calendar) {

	return rollDate(date, false, false, calendar);
};

exports.modifiedPrevious = function (date, calendar) {

	return rollDate(date, false, true, calendar);
};

exports.actual = function(date, calendar) {
	return date;
};

exports.setDateFormat = function(formatKey) {

	if(DATE_FORMAT[formatKey]) {
		activeDateFormat = DATE_FORMAT[formatKey];
		return true;
	} else {
		console.log(formatKey + ' is not a valid format');
		return false;
	}
};

exports.addDateFormat = function(name, sample, format){

    if(DATE_FORMAT[name]) {
        console.log('date format already exists');
        return false;
    }

    if (new moment(sample, format, true).isValid() ){
        DATE_FORMAT[name] = format;
        return true;
    } else {
        return false;
    }
};

function parseInput(input){
	var date = new moment(input, DATE_FORMAT[activeDateFormat]);
	console.log('ACTIVE DATE FORMAT: ', DATE_FORMAT[activeDateFormat]);
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
}

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
