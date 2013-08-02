class Show < ActiveRecord::Base
  belongs_to :venue
  has_many :showings
end
