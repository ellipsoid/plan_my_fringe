function Showing(id, show, timeSlot) {
  // inherit properties from Selectable
  Selectable.call(this);

  showing = this;

  showing.id = id;

  // link show with this showing so both have reference to the other
  showing.show = show;
  show.addShowing(showing);
  show.addMethodHandler("select", showing.updateSelectable.bind(this));
  show.addMethodHandler("deselect", showing.updateSelectable.bind(this));

  // link time with this showing so both have reference to the other
  showing.timeSlot = timeSlot;
  timeSlot.addShowing(showing);
  timeSlot.addMethodHandler("select", showing.updateSelectable.bind(this));
  timeSlot.addMethodHandler("deselect", showing.updateSelectable.bind(this));

  showing.updateSelectable();
}

// inherit methods from Selectable's prototype
Showing.prototype = Object.create(Selectable.prototype);
Showing.prototype.constructor = Showing;

Showing.prototype.updateSelectable = function() {
  showing = this;
  // check that both show and time allow this showing to be selected
  if (showing.show.canSelect(showing) && 
      showing.timeSlot.canSelect(showing)) {
    showing.makeSelectable();
  } else {
    showing.makeUnselectable();
  }
};
