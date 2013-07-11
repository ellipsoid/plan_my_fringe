function ShowingOption(showOption, timeOption) {
  this.showOption = showOption;
  this.timeOption = timeOption;
  this.selected = false;
  this.selectHandlers = [];
  this.deselectHandlers = [];
}

ShowingOption.prototype.changeSelection = function() {
  // do not set property directly, call setter so handlers are called
  if (this.selected)
  {
    this.deselect();
  } else {
    this.select();
  }
};

ShowingOption.prototype.select = function() {
  this.selected = true;
  this.selectHandlers.forEach(function(handler) {
    handler(this);
  });
};

ShowingOption.prototype.registerSelectHandler = function(handler) {
  this.selectHandlers.push(handler);
};

ShowingOption.prototype.deselect = function() {
  this.selected = false;
  this.deselectHandlers.forEach(function(handler) {
    handler(this);
  });
};

ShowingOption.prototype.registerDeselectHandler = function(handler) {
  this.deselectHandlers.push(handler);
};
