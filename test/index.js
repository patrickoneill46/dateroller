var chai = require('chai'),
    fs = require('fs'),
    moment = require('moment'),
    dateroller = require('../index');

var saturdayEndOfMonth = '29/11/2014',
    sundayEndOfMonth = '30/11/2014',
    saturdayStartOfMonth = '1/11/2014',
    sundayStartOfMonth = '2/11/2014',
    weekday = '26/11/2014',
    xmas = '25-12-2014',
    xmasEve = '24-12-2014',
    mayday = '04-05-2015';

describe('Dateroller', function() {

  before(function(done){
    fs.readFile('test/data/holidays.json', function(err, data){

        if(err){
            done(err);
        }
        dateroller.setHolidays(JSON.parse(data));
        done();
    });
  });

  beforeEach(function(){
  });

  it('Following', function(){

      var rolledDate;
      //saturday, end of the month
      rolledDate = dateroller.following(saturdayEndOfMonth);
      chai.assert.equal(1, rolledDate.date());
      chai.assert.equal(11, rolledDate.month());

      //sunday, end of the month
      rolledDate = dateroller.following(sundayEndOfMonth);
      chai.assert.equal(1, rolledDate.date());
      chai.assert.equal(11, rolledDate.month());

      //weekday
      rolledDate = dateroller.following(weekday);
      chai.assert.equal(26, rolledDate.date());
      chai.assert.equal(10, rolledDate.month());

      //mayday bank holiday
      rolledDate = dateroller.following(mayday);
      chai.assert.equal(5, rolledDate.date());
      chai.assert.equal(4, rolledDate.month());
  });

  it('Modified Following', function(){


      var rolledDate;
      //saturday, end of the month
      rolledDate = dateroller.modifiedFollowing(saturdayEndOfMonth);
      chai.assert.equal(28, rolledDate.date());
      chai.assert.equal(10, rolledDate.month());

      //sunday, end of the month
      rolledDate = dateroller.modifiedFollowing(sundayEndOfMonth);
      chai.assert.equal(28, rolledDate.date());
      chai.assert.equal(10, rolledDate.month());

      //weekday
      rolledDate = dateroller.modifiedFollowing(weekday);
      chai.assert.equal(26, rolledDate.date());
      chai.assert.equal(10, rolledDate.month());

      //mayday bank holiday
      rolledDate = dateroller.modifiedFollowing(mayday);
      chai.assert.equal(5, rolledDate.date());
      chai.assert.equal(4, rolledDate.month());

  });

  it('Previous', function(){

      var rolledDate;
      //saturday, end of the month
      rolledDate = dateroller.previous(saturdayStartOfMonth);
      chai.assert.equal(31, rolledDate.date());
      chai.assert.equal(9, rolledDate.month());

      //sunday, end of the month
      rolledDate = dateroller.previous(sundayStartOfMonth);
      chai.assert.equal(31, rolledDate.date());
      chai.assert.equal(9, rolledDate.month());

      //weekday
      rolledDate = dateroller.previous(weekday);
      chai.assert.equal(26, rolledDate.date());
      chai.assert.equal(10, rolledDate.month());

      //mayday bank holiday
      rolledDate = dateroller.previous(mayday);
      chai.assert.equal(1, rolledDate.date());
      chai.assert.equal(4, rolledDate.month());

  });

  it('Modified Previous', function(){

    rolledDate = dateroller.modifiedPrevious(saturdayStartOfMonth);
    chai.assert.equal(3, rolledDate.date());
    chai.assert.equal(10, rolledDate.month());

    //sunday, end of the month
    rolledDate = dateroller.modifiedPrevious(sundayStartOfMonth);
    chai.assert.equal(3, rolledDate.date());
    chai.assert.equal(10, rolledDate.month());

    //weekday
    rolledDate = dateroller.modifiedPrevious(weekday);
    chai.assert.equal(26, rolledDate.date());
    chai.assert.equal(10, rolledDate.month());

    //mayday bank holiday
    rolledDate = dateroller.modifiedPrevious(mayday);
    chai.assert.equal(1, rolledDate.date());
    chai.assert.equal(4, rolledDate.month());

  });

  it('Holiday checker', function(){

    chai.assert.isTrue(dateroller.isHoliday(xmas));
    chai.assert.isFalse(dateroller.isHoliday(xmasEve));
  });

  it('Weekend checker', function(){

    chai.assert.isFalse(dateroller.isWeekDay(saturdayStartOfMonth));
    chai.assert.isTrue(dateroller.isWeekDay(weekday));
  });

  it('parses input', function(){

    var badDate = dateroller.isHoliday('s');
    chai.assert.isFalse(badDate);
  });
});
