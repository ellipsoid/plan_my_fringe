function TimeSlot(id, calendarDate, timeOfDay) {
  // inherit properties from SelectableOption
  SelectableOption.call(this);

  this.id = id;

  this.calendarDate = calendarDate;
  calendarDate.addTimeSlot(this);

  this.timeOfDay = timeOfDay;
  timeOfDay.addTimeSlot(this);

  this.showings = [];
  this.selectedShowing = null;
}

// inherit methods from SelectableOption's prototype
TimeSlot.prototype = Object.create(SelectableOption.prototype);
TimeSlot.prototype.constructor = TimeSlot;

TimeSlot.prototype.timeString = function() {
  return this.timeOfDay.toString();
};

TimeSlot.prototype.dateString = function() {
  return this.calendarDate.toString();
};

TimeSlot.prototype.addShowing = function(showing) {
  time = this;
  time.showings.push(showing);
  showing.addMethodHandler("select", time.showingSelected);
  showing.addMethodHandler("deselect", time.showingDeselected);
};

TimeSlot.prototype.canSelect = function(showing) {
  time = this;
  if (time.selectedShowing == null || time.selectedShowing == showing) {
    return true;
  } else {
    return false;
  }
};

TimeSlot.prototype.showingSelected = function(showingToSelect) {
  time = this;
  if (time.selectedShowing != showingToSelect) {
    // select showing
    time.selectedShowing = showingToSelect;

    // have all showings check whether they are selectable
    time.showings.forEach(function(showing) {
      showing.updateSelectable();
    });
  }
};

TimeSlot.prototype.showingDeselected = function(showing) {
  time = this;
  if (time.selectedShowing == showing) {
    time.selectedShowing = null;
  }
};
