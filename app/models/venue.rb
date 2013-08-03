class Venue < ActiveRecord::Base
  has_many :shows

  validates :name, presence: true

end
