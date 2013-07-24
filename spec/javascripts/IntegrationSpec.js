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
    venue = new Venue(314, "Some damn venue");
    show = new Show(showId, title, venue);
  };

  var createShowing = function() {
    showingId = 789;
    createTimeSlot();
    createShow();
    showing = new Showing(showingId, show, timeSlot);
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
    expect(showing.show).toBe(show);
    expect(showing.timeSlot).toBe(timeSlot);
    expect(showing.selected).toBe(false);
    expect(showing.selectable).toBe(false);
  });

  it("canSelect works on time and show", function() {
    createShowing();
    expect(showing.show.canSelect(showing)).toBe(false);
    expect(showing.timeSlot.canSelect(showing)).toBe(false);
  });

  it("Showing becomes selectable when show and timeslot selected", function() {
    createShowing();
    expect(showing.selectable).toBe(false); // sanity check
    show.select();
    time.select();
    expect(showing.selectable).toBe(true);
  });

  it("Showing becomes unselectable when timeslot taken by a selected showing", function() {
    createShowing();
    var otherShowing = new Showing(000, show, timeSlot);
    show.select();
    timeSlot.select();
    expect(showing.selectable).toBe(true); // sanity check
    
    otherShowing.select();
    expect(showing.selectable).toBe(false);
  });

  it("Showing becomes selectable again when conflicting timeslot deselected", function() {
    createShowing();
    var otherShowing = new Showing(000, show, timeSlot);
    show.select();
    timeSlot.select();
    expect(showing.selectable).toBe(true); // sanity check
    
    otherShowing.select();
    expect(showing.selectable).toBe(false); // sanity check

    otherShowing.deselect();
    expect(showing.selectable).toBe(true);
  });


  ///
  //  WARNING!! Tests after this point are not atomic!
  //  A change or error in one will affect all the tests afterwards
  ///

  var stageMockDataSet = function() {
    // create two days
    day1 = new Day(new Date(2013, 8, 1));
    day2 = new Day(new Date(2013, 8, 2));

    // create two times per day
    timeOfDay1 = new TimeOfDay(new Date(0,0,0,17,30,0,0));
    timeOfDay2 = new TimeOfDay(new Date(0,0,0,19,0,0,0));

    // create four timeslots
    timeSlot1 = new TimeSlot(1, day1, timeOfDay1);
    timeSlot2 = new TimeSlot(2, day1, timeOfDay2);
    timeSlot3 = new TimeSlot(3, day2, timeOfDay1);
    timeSlot4 = new TimeSlot(4, day2, timeOfDay2);

    // create two venues
    venue1 = new Venue(1, "Venue 1");
    venue2 = new Venue(2, "Venue 2");

    // create four shows
    show1 = new Show(1, "Title 1", venue1);
    show2 = new Show(2, "Title 2", venue1);
    show3 = new Show(3, "Title 3", venue2);
    show4 = new Show(4, "Title 4", venue2);

    // create eight showings
    // in the first venue, shows go AABB
    // in the second venue, shows go ABAB

    // showings for venue1
    showing1 = new Showing(1, show1, timeSlot1);
    showing2 = new Showing(2, show1, timeSlot2);
    showing3 = new Showing(3, show2, timeSlot3);
    showing4 = new Showing(4, show2, timeSlot4);

    // showings for venue2
    showing5 = new Showing(5, show3, timeSlot1);
    showing6 = new Showing(6, show4, timeSlot2);
    showing7 = new Showing(7, show3, timeSlot3);
    showing8 = new Showing(8, show4, timeSlot4);
  };

  it("defaults loaded correctly for selected and selectable", function() {
    stageMockDataSet();

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

  it("updates correctly with first time and show selected", function() {
    stageMockDataSet();

    // case 1 - select a show and time
    timeSlot1.select();
    show1.select();

    expect(showing1.selectable).toBe(true);
    expect(showing2.selectable).toBe(false);
    expect(showing3.selectable).toBe(false);
    expect(showing4.selectable).toBe(false);
    expect(showing5.selectable).toBe(false);
    expect(showing6.selectable).toBe(false);
    expect(showing7.selectable).toBe(false);
    expect(showing8.selectable).toBe(false);
  });

  it("updates correctly when more shows and times selected", function() {
    // case 2 - select more shows and times
    show2.select();
    show3.select();
    timeSlot2.select();
    timeSlot3.select();

    expect(showing1.selectable).toBe(true);
    expect(showing2.selectable).toBe(true);
    expect(showing3.selectable).toBe(true);
    expect(showing4.selectable).toBe(false);
    expect(showing5.selectable).toBe(true);
    expect(showing6.selectable).toBe(false);
    expect(showing7.selectable).toBe(true);
    expect(showing8.selectable).toBe(false);
  });

  it("updates correctly when a showing is selected", function() {
    // case 3 - select a showing
    showing1.select();

    // check selections
    expect(showing1.selected).toBe(true);
    expect(showing2.selected).toBe(false);
    expect(showing3.selected).toBe(false);
    expect(showing4.selected).toBe(false);
    expect(showing5.selected).toBe(false);
    expect(showing6.selected).toBe(false);
    expect(showing7.selected).toBe(false);
    expect(showing8.selected).toBe(false);

    // showing2 conflicts for being the same show, and showing 5 conflicts for
    // being the same time - both should be made unselectable
    expect(showing1.selectable).toBe(true);
    expect(showing2.selectable).toBe(false);
    expect(showing3.selectable).toBe(true);
    expect(showing4.selectable).toBe(false);
    expect(showing5.selectable).toBe(false);
    expect(showing6.selectable).toBe(false);
    expect(showing7.selectable).toBe(true);
    expect(showing8.selectable).toBe(false);
  });

  it("updates correctly when a show is deselected", function() {
    // case 4
    show3.deselect();

    // check selections
    expect(showing1.selected).toBe(true);
    expect(showing2.selected).toBe(false);
    expect(showing3.selected).toBe(false);
    expect(showing4.selected).toBe(false);
    expect(showing5.selected).toBe(false);
    expect(showing6.selected).toBe(false);
    expect(showing7.selected).toBe(false);
    expect(showing8.selected).toBe(false);

    expect(showing1.selectable).toBe(true);
    expect(showing2.selectable).toBe(false);
    expect(showing3.selectable).toBe(true);
    expect(showing4.selectable).toBe(false);
    expect(showing5.selectable).toBe(false);
    expect(showing6.selectable).toBe(false);
    expect(showing7.selectable).toBe(false);
    expect(showing8.selectable).toBe(false);
  });

  it("updates correctly when a time is deselected", function() {
    // case 5
    timeSlot3.deselect();

    // check selections
    expect(showing1.selected).toBe(true);
    expect(showing2.selected).toBe(false);
    expect(showing3.selected).toBe(false);
    expect(showing4.selected).toBe(false);
    expect(showing5.selected).toBe(false);
    expect(showing6.selected).toBe(false);
    expect(showing7.selected).toBe(false);
    expect(showing8.selected).toBe(false);

    expect(showing1.selectable).toBe(true);
    expect(showing2.selectable).toBe(false);
    expect(showing3.selectable).toBe(false);
    expect(showing4.selectable).toBe(false);
    expect(showing5.selectable).toBe(false);
    expect(showing6.selectable).toBe(false);
    expect(showing7.selectable).toBe(false);
    expect(showing8.selectable).toBe(false);
  });

  it("updates correctly when a showing is deselected", function() {
    // case 6
    timeSlot2.select();
    timeSlot3.select();
    show2.select();
    show3.select();

    // sanity check - should match case 3
    expect(showing1.selectable).toBe(true);
    expect(showing2.selectable).toBe(false);
    expect(showing3.selectable).toBe(true);
    expect(showing4.selectable).toBe(false);
    expect(showing5.selectable).toBe(false);
    expect(showing6.selectable).toBe(false);
    expect(showing7.selectable).toBe(true);
    expect(showing8.selectable).toBe(false);

    showing1.deselect();

    // check selections
    expect(showing1.selected).toBe(false);
    expect(showing2.selected).toBe(false);
    expect(showing3.selected).toBe(false);
    expect(showing4.selected).toBe(false);
    expect(showing5.selected).toBe(false);
    expect(showing6.selected).toBe(false);
    expect(showing7.selected).toBe(false);
    expect(showing8.selected).toBe(false);

    expect(showing1.selectable).toBe(true);
    expect(showing2.selectable).toBe(true);
    expect(showing3.selectable).toBe(true);
    expect(showing4.selectable).toBe(false);
    expect(showing5.selectable).toBe(true);
    expect(showing6.selectable).toBe(false);
    expect(showing7.selectable).toBe(true);
    expect(showing8.selectable).toBe(false);
  });

  it("updates correctly when the show for a selected showing is deselected", function() {
    stageMockDataSet();

    show1.select();
    show2.select();
    show3.select();
    timeSlot1.select();
    timeSlot2.select();
    timeSlot3.select();

    showing1.select();

    // sanity check
    expect(showing1.selected).toBe(true);
    expect(showing2.selected).toBe(false);
    expect(showing3.selected).toBe(false);
    expect(showing4.selected).toBe(false);
    expect(showing5.selected).toBe(false);
    expect(showing6.selected).toBe(false);
    expect(showing7.selected).toBe(false);
    expect(showing8.selected).toBe(false);

    expect(showing1.selectable).toBe(true);
    expect(showing2.selectable).toBe(false);
    expect(showing3.selectable).toBe(true);
    expect(showing4.selectable).toBe(false);
    expect(showing5.selectable).toBe(false);
    expect(showing6.selectable).toBe(false);
    expect(showing7.selectable).toBe(true);
    expect(showing8.selectable).toBe(false);

    // deselect show for selected showing
    show1.deselect();

    expect(showing1.selected).toBe(false);
    expect(showing2.selected).toBe(false);
    expect(showing3.selected).toBe(false);
    expect(showing4.selected).toBe(false);
    expect(showing5.selected).toBe(false);
    expect(showing6.selected).toBe(false);
    expect(showing7.selected).toBe(false);
    expect(showing8.selected).toBe(false);

    expect(showing1.selectable).toBe(false);
    expect(showing2.selectable).toBe(false);
    expect(showing3.selectable).toBe(true);
    expect(showing4.selectable).toBe(false);
    expect(showing5.selectable).toBe(true);
    expect(showing6.selectable).toBe(false);
    expect(showing7.selectable).toBe(true);
    expect(showing8.selectable).toBe(false);
  });

});
