describe("OptionCollection", function() {

  beforeEach(function() {
    collection = new OptionCollection();
  });

  it("should have no options on initialization", function() {
    expect(collection.options).toEqual([]);
  });

  it("should add options with 'push'", function() {
    var option = "dummy option";
    collection.push(option);
    expect(collection.options).toEqual([option]);
  });

});
