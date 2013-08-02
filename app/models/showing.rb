class Showing < ActiveRecord::Base
  belongs_to :show
  belongs_to :time_slot
end
