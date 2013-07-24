function ShowingOption(id, showOption, timeSlot) {
  // inherit properties from SelectableOption
  SelectableOption.call(this);

  showing = this;

  showing.id = id;

  // link show with this showing so both have reference to the other
  showing.showOption = showOption;
  showOption.addShowing(showing);
  showOption.addMethodHandler("select", showing.updateSelectable.bind(this));
  showOption.addMethodHandler("deselect", showing.updateSelectable.bind(this));

  // link time with this showing so both have reference to the other
  showing.timeSlot = timeSlot;
  timeSlot.addShowing(showing);
  timeSlot.addMethodHandler("select", showing.updateSelectable.bind(this));
  timeSlot.addMethodHandler("deselect", showing.updateSelectable.bind(this));

  showing.updateSelectable();
}

// inherit methods from SelectableOption's prototype
ShowingOption.prototype = Object.create(SelectableOption.prototype);
ShowingOption.prototype.constructor = ShowingOption;

ShowingOption.prototype.updateSelectable = function() {
  showing = this;
  // check that both show and time allow this showing to be selected
  if (showing.showOption.canSelect(showing) && 
      showing.timeSlot.canSelect(showing)) {
    showing.makeSelectable();
  } else {
    showing.makeUnselectable();
  }
};
