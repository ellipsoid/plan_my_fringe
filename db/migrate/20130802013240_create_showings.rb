class CreateShowings < ActiveRecord::Migration
  def change
    create_table :showings do |t|
      t.string :id
      t.references :show, index: true
      t.references :time_slot, index: true

      t.timestamps
    end
    add_index :showings, :id
  end
end
