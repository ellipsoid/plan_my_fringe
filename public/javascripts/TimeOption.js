function TimeOption(datetime, timeUtility) {
  this.datetime = datetime;
  this.timeUtility = timeUtility;
}

TimeOption.prototype.timeString = function() {
  return this.timeUtility.timeStringFor(this.datetime);
};

TimeOption.prototype.datetimeString = function() {
  return this.timeUtility.datetimeStringFor(this.datetime);
};
