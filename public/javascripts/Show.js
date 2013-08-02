function Show(id, title, venue) {
  // inherit properties from Selectable
  Selectable.call(this);

  // override default value of 'selectable'
  this.selectable = true;

  this.id = id;
  this.title = title;
  this.venue = venue;
  venue.addShow(this);

  this.showings = [];
  this.selectedShowing = null;
}

// inherit methods from Selectable's prototype
Show.prototype = Object.create(Selectable.prototype);
Show.prototype.constructor = Show;

Show.prototype.addShowing = function(showing) {
  show = this;
  show.showings.push(showing);
  showing.addMethodHandler("select", show.showingSelected.bind(this));
  showing.addMethodHandler("deselect", show.showingDeselected.bind(this));
};

Show.prototype.canSelect = function(showing) {
  show = this;
  if (!show.selected) {
    return false;
  } else if (show.selectedShowing == null || show.selectedShowing == showing) {
    return true;
  } else {
    return false;
  }
};

Show.prototype.showingSelected = function(showingToSelect) {
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

Show.prototype.showingDeselected = function(showing) {
  show = this;
  if (show.selectedShowing == showing) {
    show.selectedShowing = null;

    // have all showings check whether they are selectable
    show.showings.forEach(function(showing) {
      showing.updateSelectable();
    });
  }
};

Show.prototype.selectableShowingsCount = function() {
  show = this;
  selectableShowings = show.showings.filter(function(showing) {
    return showing.selectable;
  });

  return selectableShowings.length;
};
