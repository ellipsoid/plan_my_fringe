require 'spec_helper'

describe Venue do

  it "should have a valid factory" do
    FactoryGirl.build(:venue).should be_valid
  end

  it "should require a name" do
    FactoryGirl.build(:venue, :name => "").should_not be_valid
  end

end
