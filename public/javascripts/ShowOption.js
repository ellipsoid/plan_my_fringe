function ShowOption(id, title, venue) {
  // inherit properties from SelectableOption
  SelectableOption.call(this);

  // override default value of 'selectable'
  this.selectable = true;

  this.id = id;
  this.title = title;
  this.venue = venue;
  this.showings = [];
  this.selectedShowing = null;
}

// inherit methods from SelectableOption's prototype
ShowOption.prototype = Object.create(SelectableOption.prototype);
ShowOption.prototype.constructor = ShowOption;

ShowOption.prototype.addShowing = function(showing) {
  show = this;
  show.showings.push(showing);
  showing.addMethodHandler("select", show.showingSelected.bind(this));
  showing.addMethodHandler("deselect", show.showingDeselected.bind(this));
};

ShowOption.prototype.canSelect = function(showing) {
  show = this;
  if (!show.selected) {
    return false;
  } else if (show.selectedShowing == null || show.selectedShowing == showing) {
    return true;
  } else {
    return false;
  }
};

ShowOption.prototype.showingSelected = function(showingToSelect) {
  show = this;
  if (show.selectedShowing != showingToSelect) {
    // select showing
    show.selectedShowing = showingToSelect;

    // have all showings check whether they are selectable
    show.showings.forEach(function(showing) {
      showing.updateSelectable();
    });
  }
};

ShowOption.prototype.showingDeselected = function(showing) {
  show = this;
  if (show.selectedShowing == showing) {
    show.selectedShowing = null;

    // have all showings check whether they are selectable
    show.showings.forEach(function(showing) {
      showing.updateSelectable();
    });
  }
};
