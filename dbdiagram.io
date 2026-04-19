Table countries {
  id uuid [pk]

  name text
  name_en text

  iso_code text  // VN, US, JP...

  created_at timestamp
}


// =======================
// ADMIN LEVEL DEFINITIONS (METADATA)
// =======================
Table admin_level_definitions {
  id uuid [pk]

  country_id uuid [ref: > countries.id]

  level int               // 0,1,2,3...
  type text               // province, city, district, ward...
  name_local text
  name_en text

  created_at timestamp

  Note: "unique (country_id, level, type)"
}


// =======================
// ADMINISTRATIVE UNITS (ACTUAL TREE DATA)
// =======================
Table administrative_units {
  id uuid [pk]

  country_id uuid [ref: > countries.id]

  admin_level_definition_id uuid [ref: > admin_level_definitions.id]

  name text
  name_en text

  type text               // redundant but useful for fast query
  level int

  parent_id uuid [ref: > administrative_units.id]

  code text               // optional official code

  created_at timestamp
}


// =======================
// USER LOCATIONS
// =======================
Table user_locations {
  id uuid [pk]

  user_id uuid [ref: > users.id]

  latitude double
  longitude double

  admin_unit_id uuid [ref: > administrative_units.id]

  route text
  street_number text

  formatted_address text

  created_at timestamp
}