var stripTimeOfDayInfo = function(datetime) {
  var day = new Date(datetime.getFullYear(),
    datetime.getMonth(),
    datetime.getDate());
  return day;
};

function Day(datetime) {
  this.datetime = stripTimeOfDayInfo(datetime);
  this.timeSlots = [];
};

Day.prototype.includes = function(datetime) {
  var testDay = stripTimeOfDayInfo(datetime);

  return this.datetime.getTime() == testDay.getTime();
};

Day.prototype.addTimeSlot = function(timeSlot) {
  this.timeSlots.push(timeSlot);
};

Day.prototype.toString = function() {
  return this.datetime.toDateString();
};
