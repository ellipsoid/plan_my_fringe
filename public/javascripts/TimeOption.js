function TimeOption(id, datetime, timeUtility) {
  this.id = id;
  this.datetime = datetime;
  this.timeUtility = timeUtility;
  this.showings = [];
  this.selected = false;
  this.selectHandlers = [];
  this.deselectHandlers = [];
}

TimeOption.prototype.timeString = function() {
  return this.timeUtility.timeStringFor(this.datetime);
};

TimeOption.prototype.datetimeString = function() {
  return this.timeUtility.datetimeStringFor(this.datetime);
};

TimeOption.prototype.addShowing = function(showing) {
  this.showings.push(showing);
};

TimeOption.prototype.changeSelection = function() {
  // do not set property directly, call setter so handlers are called
  if (this.selected)
  {
    this.deselect();
  } else {
    this.select();
  }
};

TimeOption.prototype.select = function() {
  this.selected = true;
  this.selectHandlers.forEach(function(handler) {
    handler(this);
  });
};

TimeOption.prototype.registerSelectHandler = function(handler) {
  this.selectHandlers.push(handler);
};

TimeOption.prototype.deselect = function() {
  this.selected = false;
  this.deselectHandlers.forEach(function(handler) {
    handler(this);
  });
};

TimeOption.prototype.registerDeselectHandler = function(handler) {
  this.deselectHandlers.push(handler);
};
