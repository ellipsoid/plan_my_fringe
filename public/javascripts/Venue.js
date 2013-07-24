function Venue(id, name) {
  this.id = id;
  this.name = name;
  this.shows = [];
};

Venue.prototype.addShow = function(show) {
  this.shows.push(show);
};
