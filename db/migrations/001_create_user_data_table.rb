

Sequel.migration do
  up do
    create_table(:selections) do
      String	:uid
      String	:json
    end
  end

  down do
    drop_table(:selections)
  end
end
