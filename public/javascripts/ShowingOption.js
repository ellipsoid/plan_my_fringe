function ShowingOption(id, showOption, timeOption) {
  // inherit properties from SelectableOption
  SelectableOption.call(this);

  this.id = id;

  // link show with this showing so both have reference to the other
  this.showOption = showOption;
  showOption.addShowing(this);

  // link time with this showing so both have reference to the other
  this.timeOption = timeOption;
  timeOption.addShowing(this);

  this.updateSelectable();
}

// inherit methods from SelectableOption's prototype
ShowingOption.prototype = Object.create(SelectableOption.prototype);
ShowingOption.prototype.constructor = ShowingOption;

ShowingOption.prototype.updateSelectable = function() {
  // check that both show and time allow this showing to be selected
  if (this.showOption.canSelect(this) && this.timeOption.canSelect(this)) {
    this.selectable = true;
  } else {
    this.selectable = false;
  }
};
