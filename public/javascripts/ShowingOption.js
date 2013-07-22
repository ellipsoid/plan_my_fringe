function ShowingOption(showOption, timeOption) {
  this.showOption = showOption;
  this.timeOption = timeOption;
  this.selected = false;
  this.selectable = false;
  this.updateSelectable();
}

ShowingOption.prototype.updateSelectable = function() {
  // check that both show and time allow this showing to be selected
  if (this.showOption.canSelect(this) && this.timeOption.canSelect(this)) {
    this.selectable = true;
  } else {
    this.selectable = false;
  }
};

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
};

ShowingOption.prototype.deselect = function() {
  this.selected = false;
};
