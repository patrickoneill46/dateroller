var expect = require('chai').expect,
    moment = require('moment'),
    dateroller = require('../index');

var saturdayEndOfMonth, sundayEndOfMonth, weekday;

describe('Roll Dates', function() {

  before(function(done){
    dateroller.loadHolidaysFromFile('test/data/holidays.json', done);
  });

  beforeEach(function(){
    saturdayEndOfMonth = new moment('29/11/2014', 'DD-MM-YYYY');
    sundayEndOfMonth = new moment('30/11/2014', 'DD-MM-YYYY');
    saturdayStartOfMonth = new moment('1/11/2014', 'DD-MM-YYYY');
    sundayStartOfMonth = new moment('2/11/2014', 'DD-MM-YYYY');
    weekday = new moment('26/11/2014', 'DD-MM-YYYY');
  });

  it('Following', function(){

      //saturday, end of the month
      dateroller.following(saturdayEndOfMonth);
      expect(saturdayEndOfMonth.date()).to.equal(1);
      expect(saturdayEndOfMonth.month()).to.equal(11);

      //sunday, end of the month
      dateroller.following(sundayEndOfMonth);
      expect(sundayEndOfMonth.date()).to.equal(1);
      expect(sundayEndOfMonth.month()).to.equal(11);

      //weekday
      dateroller.following(weekday);
      expect(weekday.date()).to.equal(26);
      expect(weekday.month()).to.equal(10);
  });

  it('Modified Following', function(){

      //saturday, end of the month
      dateroller.modifiedFollowing(saturdayEndOfMonth);
      expect(saturdayEndOfMonth.date()).to.equal(28);
      expect(saturdayEndOfMonth.month()).to.equal(10);

      //sunday, end of the month
      dateroller.modifiedFollowing(sundayEndOfMonth);
      expect(sundayEndOfMonth.date()).to.equal(28);
      expect(sundayEndOfMonth.month()).to.equal(10);

      //weekday
      dateroller.modifiedFollowing(weekday);
      expect(weekday.date()).to.equal(26);
      expect(weekday.month()).to.equal(10);
  });

  it('Previous', function(){

      // saturday, start of the month
      dateroller.previous(saturdayStartOfMonth);
      expect(saturdayStartOfMonth.date()).to.equal(31);
      expect(saturdayStartOfMonth.month()).to.equal(9);

      //sunday, start of the month
      dateroller.previous(sundayStartOfMonth);
      expect(sundayStartOfMonth.date()).to.equal(31);
      expect(sundayStartOfMonth.month()).to.equal(9);

      dateroller.previous(weekday);
      expect(weekday.date()).to.equal(26);
      expect(weekday.month()).to.equal(10);
      //weekday
  });

  it('Modified Previous', function(){

      //saturday, start of the month
      dateroller.modifiedPrevious(saturdayStartOfMonth);
      expect(saturdayStartOfMonth.date()).to.equal(3);
      expect(saturdayStartOfMonth.month()).to.equal(10);

      //sunday, start of the month
      dateroller.modifiedPrevious(sundayStartOfMonth);
      expect(sundayStartOfMonth.date()).to.equal(3);
      expect(sundayStartOfMonth.month()).to.equal(10);

      //weekday
      dateroller.modifiedPrevious(weekday);
      expect(weekday.date()).to.equal(26);
      expect(weekday.month()).to.equal(10);
  });

  it('Holiday checker', function(){

    var xmas = new moment('25-12-2014', 'DD-MM-YYYY');
    var xmasEve = new moment('24-12-2014', 'DD-MM-YYYY');

    expect(dateroller.isHoliday(xmas)).to.be.true;

    expect(dateroller.isHoliday(xmasEve)).to.be.false;
    expect(dateroller.isHoliday(xmasEve, 1)).to.be.true;

  });

  it('Weekend checker', function(){

    var saturday = new moment('1-11-2014', 'DD-MM-YYYY');
    expect(dateroller.isWeekDay(saturday)).to.be.false;

  });
});
