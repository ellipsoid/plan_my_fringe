function TimeUtility() {
}

var padStringWithZeroes = function(string, count) {
  var zeroesString = "";
  for (var i=0; i<count; i++) {
    zeroesString += "0";
  }

  // replace last zeroes with string
  var paddedString = zeroesString.slice(0, (count - string.length)) + string;
  return paddedString;
};

TimeUtility.prototype.timeStringFor = function(datetime) {
  // pad with zeroes to make 2-digit string
  var minutesString = padStringWithZeroes(datetime.getMinutes().toString(), 2);
  var hoursString = padStringWithZeroes(datetime.getHours().toString(), 2);
  return hoursString + ":" + minutesString;
};

TimeUtility.prototype.datetimeStringFor = function(datetime) {
  var dateString = datetime.toDateString();
  var timeString = this.timeStringFor(datetime);
  return dateString + " " + timeString;
};
