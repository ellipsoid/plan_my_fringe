var stripTimeOfDayInfo = function(datetime) {
  var performanceDay = new Date(datetime.getFullYear(),
    datetime.getMonth(),
    datetime.getDate());
  return performanceDay;
};

function PerformanceDay(datetime) {
  this.datetime = stripTimeOfDayInfo(datetime);
  this.timeSlots = [];
};

PerformanceDay.prototype.includes = function(datetime) {
  var sameYear = datetime.getFullYear() === this.datetime.getFullYear();
  var sameMonth = datetime.getMonth() === this.datetime.getMonth();
  var sameDate = datetime.getDate() === this.datetime.getDate();

  return sameYear && sameMonth && sameDate;
};

PerformanceDay.prototype.addTimeSlot = function(timeSlot) {
  this.timeSlots.push(timeSlot);
};

PerformanceDay.prototype.toString = function() {
  return this.datetime.toDateString();
};
