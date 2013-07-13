function ShowOption(id, title, venue) {
  this.id = id;
  this.title = title;
  this.venue = venue;
  this.selected = false;
  this.selectHandlers = [];
  this.deselectHandlers = [];
}

ShowOption.prototype.changeSelection = function() {
  // do not set property directly, call setter so handlers are called
  if (this.selected)
  {
    this.deselect();
  } else {
    this.select();
  }
};

ShowOption.prototype.select = function() {
  this.selected = true;
  this.selectHandlers.forEach(function(handler) {
    handler(this);
  });
};

ShowOption.prototype.registerSelectHandler = function(handler) {
  this.selectHandlers.push(handler);
};

ShowOption.prototype.deselect = function() {
  this.selected = false;
  this.deselectHandlers.forEach(function(handler) {
    handler(this);
  });
};

ShowOption.prototype.registerDeselectHandler = function(handler) {
  this.deselectHandlers.push(handler);
};
