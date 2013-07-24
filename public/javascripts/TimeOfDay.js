var stripDateInfo = function(datetime) {
  var timeOfDay = new Date(0, 0, 0,
    datetime.getHours(),
    datetime.getMinutes(),
    datetime.getSeconds(),
    datetime.getMilliseconds()
  );

  return timeOfDay;
};

function TimeOfDay(datetime) {
  this.datetime = stripDateInfo(datetime);
  this.timeSlots = [];
};

TimeOfDay.prototype.includes = function(datetime) {
  var newTimeOfDay = stripDateInfo(datetime);
  return this.datetime.getTime() == newTimeOfDay.getTime();
};

TimeOfDay.prototype.addTimeSlot = function(timeSlot) {
  this.timeSlots.push(timeSlot);
};

TimeOfDay.prototype.toString = function() {
  var fullTimeString = this.datetime.toLocaleTimeString();
  // remove the seconds part of time string
  var shortTimeString = fullTimeString.replace(/:\d\d /," ");
  return shortTimeString;
};
