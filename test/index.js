var expect = require('chai').expect,
    moment = require('moment'),
    dateroller = require('../index')([]);

var saturdayEndOfMonth, sundayEndOfMonth, weekday;

describe('Roll Dates', function() {

  beforeEach(function(){
    saturdayEndOfMonth = new moment('29/11/2014', 'DD-MM-YYYY');
    sundayEndOfMonth = new moment('30/11/2014', 'DD-MM-YYYY');
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
});
