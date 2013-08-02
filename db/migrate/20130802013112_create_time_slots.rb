class CreateTimeSlots < ActiveRecord::Migration
  def change
    create_table :time_slots do |t|
      t.datetime :datetime

      t.timestamps
    end
    add_index :time_slots, :id
  end
end
