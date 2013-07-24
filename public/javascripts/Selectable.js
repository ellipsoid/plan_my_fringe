function Selectable() {
  this.methodHandlers = {select:[],deselect:[]};
  this.selected = false;
  this.selectable = false;
};

Selectable.prototype.addMethodHandler = function(methodName, methodHandler) {
  // create new array of handlers for method if none exists
  this.methodHandlers[methodName] = this.methodHandlers[methodName] || [];

  // add handler to array for this method
  this.methodHandlers[methodName].push(methodHandler);
};

Selectable.prototype.select = function() {
  var self = this;
  self.selected = true;
  self.methodHandlers["select"].forEach(function(methodHandler) {
    // execute methodHandler
    methodHandler(self);
  });
};

Selectable.prototype.deselect = function() {
  var self = this;
  self.selected = false;
  self.methodHandlers["deselect"].forEach(function(methodHandler) {
    // execute methodHandler
    methodHandler(self);
  });
};

Selectable.prototype.invertSelection = function() {
  // do not set property directly, call setter so methodHandlers are called
  if (this.selected)
  {
    this.deselect();
  } else {
    this.select();
  }
};

Selectable.prototype.makeSelectable = function() {
  this.selectable = true;
};

Selectable.prototype.makeUnselectable = function() {
  this.selectable = false;
  // cannot be unselectable while also selected
  if (this.selected) {
    this.deselect();
  }
};
