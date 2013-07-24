function TimeSlot(id, day, timeOfDay) {
  // inherit properties from Selectable
  Selectable.call(this);
  // override defaul value of 'selectable'
  this.selectable = true;

  this.id = id;

  this.day = day;
  day.addTimeSlot(this);

  this.timeOfDay = timeOfDay;
  timeOfDay.addTimeSlot(this);

  this.showings = [];
  this.selectedShowing = null;
}

// inherit methods from Selectable's prototype
TimeSlot.prototype = Object.create(Selectable.prototype);
TimeSlot.prototype.constructor = TimeSlot;

TimeSlot.prototype.timeString = function() {
  return this.timeOfDay.toString();
};

TimeSlot.prototype.dateString = function() {
  return this.day.toString();
};

TimeSlot.prototype.addShowing = function(showing) {
  time = this;
  time.showings.push(showing);
  showing.addMethodHandler("select", time.showingSelected.bind(this));
  showing.addMethodHandler("deselect", time.showingDeselected.bind(this));
};

TimeSlot.prototype.canSelect = function(showing) {
  time = this;
  if (!time.selected) {
    return false;
  } else if (time.selectedShowing == null || time.selectedShowing == showing) {
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

    // have all showings check whether they are selectable
    time.showings.forEach(function(showing) {
      showing.updateSelectable();
    });
  }
};
