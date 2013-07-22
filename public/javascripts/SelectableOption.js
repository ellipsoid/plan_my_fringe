function SelectableOption() {
  this.methodHandlers = {select:[],deselect:[]};
  this.selected = false;
  this.selectable = false;
};

SelectableOption.prototype.addMethodHandler = function(methodName, methodHandler) {
  // create new array of handlers for method if none exists
  this.methodHandlers[methodName] = this.methodHandlers[methodName] || [];

  // add handler to array for this method
  this.methodHandlers[methodName].push(methodHandler);
};

SelectableOption.prototype.select = function() {
  var option = this;
  option.selected = true;
  option.methodHandlers["select"].forEach(function(methodHandler) {
    // execute methodHandler
    methodHandler(option);
  });
};

SelectableOption.prototype.deselect = function() {
  var option = this;
  option.selected = false;
  option.methodHandlers["deselect"].forEach(function(methodHandler) {
    // execute methodHandler
    methodHandler(option);
  });
};

SelectableOption.prototype.invertSelection = function() {
  // do not set property directly, call setter so methodHandlers are called
  if (this.selected)
  {
    this.deselect();
  } else {
    this.select();
  }
};

SelectableOption.prototype.makeSelectable = function() {
  this.selectable = true;
};

SelectableOption.prototype.makeUnselectable = function() {
  this.selectable = false;
  // cannot have an option unselectable but also selected
  if (this.selected) {
    this.deselect();
  }
};
