describe("Venue", function() {
  var id;
  var name;
  var venue;

  beforeEach(function() {
    id = 123;
    name = "some venue";
    venue = new Venue(id, name);
    show = jasmine.createSpyObj('show',['toString']);
  });

  it("accepts an id and name on initialization", function() {
    expect(venue.id).toEqual(id);
    expect(venue.name).toEqual(name);
  });

  it("initializes with no shows", function() {
    expect(venue.shows).toEqual([]);
  });

  it("can add a show with 'addShow'", function() {
    venue.addShow(show)
    expect(venue.shows).toEqual([show]);
  });

});
