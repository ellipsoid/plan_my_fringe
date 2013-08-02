class CreateShows < ActiveRecord::Migration
  def change
    create_table :shows do |t|
      t.string :title
      t.references :venue, index: true

      t.timestamps
    end
    add_index :shows, :id
  end
end
