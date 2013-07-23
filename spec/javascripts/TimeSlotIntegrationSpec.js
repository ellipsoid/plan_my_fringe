describe("IntegrationTests", function() {
  var timeId;
  var datetime;
  var day;
  var timeOfDay;
  var timeSlot;

  var showId;
  var title;
  var venue;
  var show;

  var showingId;
  var showing;

  var createTimeSlot = function() {
    timeId = 123;
    datetime = new Date(2013, 8, 1, 17, 30, 0, 0);
    day = new Day(datetime);
    timeOfDay = new TimeOfDay(datetime);
    timeSlot = new TimeSlot(timeId, day, timeOfDay);
  };

  var createShow = function() {
    showId = 456;
    title = "Some damn title";
    venue = "Some damn venue";
    show = new ShowOption(showId, title, venue);
  };

  var createShowing = function() {
    showingId = 789;
    createTimeSlot();
    createShow();
    showing = new ShowingOption(showingId, show, timeSlot);
  };

  it("TimeSlot can initialize with real objects", function() {
    createTimeSlot();
    expect(timeSlot.id).toEqual(timeId);
    expect(timeSlot.day).toBe(day);
    expect(timeSlot.timeOfDay).toBe(timeOfDay);
    expect(timeSlot.selected).toBe(false);
    expect(timeSlot.selectable).toBe(true);
  });

  it("Show can initialize with real objects", function() {
    createShow();
    expect(show.id).toEqual(showId);    
    expect(show.venue).toEqual(venue);
    expect(show.title).toEqual(title);
    expect(show.selected).toBe(false);
    expect(show.selectable).toBe(true);
  });

  it("Showing can initialize with real objects", function() {
    createShowing();
    expect(showing.showOption).toBe(show);
    expect(showing.timeOption).toBe(timeSlot);
    expect(showing.selected).toBe(false);
    expect(showing.selectable).toBe(false);
  });

  it("selections update correctly with mock data", function() {
    // create two days
    var day1 = new Day(new Date(2013, 8, 1));
    var day2 = new Day(new Date(2013, 8, 2));

    // create two times per day
    var timeOfDay1 = new TimeOfDay(new Date(0,0,0,17,30,0,0));
    var timeOfDay2 = new TimeOfDay(new Date(0,0,0,19,0,0,0));

    // create four timeslots
    var timeSlot1 = new TimeSlot(1, day1, timeOfDay1);
    var timeSlot2 = new TimeSlot(2, day1, timeOfDay2);
    var timeSlot3 = new TimeSlot(3, day2, timeOfDay1);
    var timeSlot4 = new TimeSlot(4, day2, timeOfDay2);

    // create two venues
    var venue1 = "Venue 1";
    var venue2 = "Venue 2";

    // create four shows
    var show1 = new ShowOption(1, "Title 1", venue1);
    var show2 = new ShowOption(2, "Title 2", venue1);
    var show3 = new ShowOption(3, "Title 3", venue2);
    var show4 = new ShowOption(4, "Title 4", venue2);

    // create eight showings
    // in the first venue, shows go AABB
    // in the second venue, shows go ABAB

    // showings for venue1
    var showing1 = new ShowingOption(1, show1, timeSlot1);
    var showing2 = new ShowingOption(2, show1, timeSlot2);
    var showing3 = new ShowingOption(3, show2, timeSlot3);
    var showing4 = new ShowingOption(4, show2, timeSlot4);

    // showings for venue2
    var showing5 = new ShowingOption(5, show3, timeSlot1);
    var showing6 = new ShowingOption(6, show4, timeSlot2);
    var showing7 = new ShowingOption(7, show3, timeSlot3);
    var showing8 = new ShowingOption(8, show4, timeSlot4);


    // collect instances into list of same type
    var timeSlots = [timeSlot1, timeSlot2, timeSlot3, timeSlot4];
    var shows = [show1, show2, show3, show4];
    var showings = [showing1, showing2, showing3, showing4, 
      showing5, showing6, showing7, showing8];


    // check default selection properties

    // timeslots
    timeSlots.forEach(function(timeSlot) {
      expect(timeSlot.selected).toBe(false);
    });

    // shows
    shows.forEach(function(show) {
      expect(show.selected).toBe(false);
    });

    // showings
    showings.forEach(function(showing) {
      expect(showing.selected).toBe(false);
      expect(showing.selectable).toBe(false);
    });

  });

});
