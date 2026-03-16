create extension if not exists "pgcrypto";

create type node_type as enum (
  'system',
  'star',
  'planet',
  'moon',
  'dwarf_planet',
  'asteroid_belt',
  'ring_system',
  'asteroid',
  'comet'
);

-- Simple tree structure table
create table nodes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type node_type not null,
  parent_id uuid references nodes(id) on delete cascade,
  renderable boolean default false
);

-- Detailed information table
create table node_details (
  id uuid primary key default gen_random_uuid(),
  node_id uuid not null unique references nodes(id) on delete cascade,
  description text,
  stats jsonb default '{}'::jsonb,
  facts jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Solar System
with solar_system_node as (
  insert into nodes (name, type, renderable)
  values ('solar-system', 'system', false)
  returning id
)
insert into node_details (node_id, description, stats)
select id, '"The Solar System, located in the Milky Way Galaxy, is our celestial neighborhood. Our Solar System consists of 8 planets, several dwarf planets, hundreds of moons, and millions of asteroids, comets, and meteoroids. They are all bound by gravity to the Sun, which is the star at the center of the Solar System." - National Air and Space Museum', '{
    "age": "4.6 billion",
    "known_minor_planets": 1528003,
    "number_of_planets": 8,
    "number_of_dwarf_planets": 5
  }'::jsonb
from solar_system_node;

-- Sun
with sun_node as (
  insert into nodes (name, type, parent_id, renderable)
  values ('sun', 'star', (select id from nodes where name = 'solar-system'), true)
  returning id
)
insert into node_details (node_id, description, stats)
select id, 'Our Sun is a 4.5 billion year old star at the center of our Solar System. Its gravity holds our Solar System together, keeping everything from planets to small pieces of debris, in orbit around it." - National Air and Space Museum', '{
    "age": "4.5 billion"
    }'::jsonb
from sun_node;

-- Mercury 
with mercury_node as (
  insert into nodes (name, type, parent_id, renderable)
  values ('mercury', 'planet', (select id from nodes where name = 'solar-system'), true)
  returning id
)
insert into node_details (node_id, description, stats)
select id, '"Mercury is the closest planet to the Sun, and the smallest planet in our solar system. Mercury is named for the swiftest of the ancient Roman gods." - NASA', '{
    "age": "4.5 billion"
    }'::jsonb
from mercury_node;

-- Venus 
with venus_node as (
  insert into nodes (name, type, parent_id, renderable)
  values ('venus', 'planet', (select id from nodes where name = 'solar-system'), true)
  returning id
)
insert into node_details (node_id, description, stats)
select id, '"Venus is the second planet from the Sun, and the sixth largest planet. It''s the hottest planet in our solar system. Venus is named for the ancient Roman goddess of love and beauty, who was known as Aphrodite to the ancient Greeks. Most features on Venus are named for women. It''s the only planet named after a female god." - NASA', '{
    "age": "4.5 billion"
    }'::jsonb
from venus_node;

-- Earth 
with earth_node as (
  insert into nodes (name, type, parent_id, renderable)
  values ('earth', 'planet', (select id from nodes where name = 'solar-system'), true)
  returning id
)
insert into node_details (node_id, description, stats)
select id, '"Earth is the third planet from the Sun and the only astronomical object known to harbor life.  Its unique combination of water, atmosphere, and geology makes it distinct in the solar system." - The Solar System Wiki', '{
    "age": "4.5 billion"
    }'::jsonb
from earth_node;

-- Moon
with moon_node as (
  insert into nodes (name, type, parent_id, renderable)
  values ('moon', 'moon', (select id from nodes where name = 'earth'), true)
  returning id
)
insert into node_details (node_id, description, stats)
select id, '"The Moon is Earth''s nearest neighbor. Because of tidal forces, it completes one revolution every 655 hours. So, one "side" of the Moon is always facing the Earth, and the other "side" is always facing away from the Earth." - NASA Glenn Research Center', '{
    "age": "4.5 billion"
    }'::jsonb
from moon_node;

-- Mars
with mars_node as (
  insert into nodes (name, type, parent_id, renderable)
  values ('mars', 'planet', (select id from nodes where name = 'solar-system'), true)
  returning id
)
insert into node_details (node_id, description, stats)
select id, '"Mars is the fourth planet from the Sun, and the seventh largest. It''s the only planet we know of inhabited entirely by robots. It''s dry, rocky, and bitter cold. Mars was named by the ancient Romans for their god of war because its reddish color was reminiscent of blood." - NASA', '{
    "age": "4.5 billion"
    }'::jsonb
from mars_node;

-- Jupiter
with jupiter_node as (
  insert into nodes (name, type, parent_id, renderable)
  values ('jupiter', 'planet', (select id from nodes where name = 'solar-system'), true)
  returning id
)
insert into node_details (node_id, description, stats)
select id, '"Jupiter is the fifth planet from the Sun, and the largest in the solar system, by far — more than twice as massive as the other planets combined. Jupiter, being the biggest planet, gets its name from the king of the ancient Roman gods." - NASA', '{
    "age": "4.5 billion"
    }'::jsonb
from jupiter_node;

-- Saturn
with saturn_node as (
  insert into nodes (name, type, parent_id, renderable)
  values ('saturn', 'planet', (select id from nodes where name = 'solar-system'), true)
  returning id
)
insert into node_details (node_id, description, stats)
select id, '"Saturn is the sixth planet from the Sun, and the second largest in the solar system. Saturn is a massive ball made mostly of hydrogen and helium. Saturn is not the only planet to have rings, but none are as spectacular or as complex as Saturns." - NASA', '{
    "age": "4.5 billion"
    }'::jsonb
from saturn_node;

-- Uranus
with uranus_node as (
  insert into nodes (name, type, parent_id, renderable)
  values ('uranus', 'planet', (select id from nodes where name = 'solar-system'), true)
  returning id
)
insert into node_details (node_id, description, stats)
select id, '"Uranus is the seventh planet from the Sun, and the third largest planet in our solar system. Uranus is very cold and windy. It is surrounded by faint rings, and more than two dozen small moons. It rotates at a nearly 90-degree angle from the plane of its orbit. This unique tilt makes Uranus appear to spin on its side." - NASA ', '{
    "age": "4.5 billion"
    }'::jsonb
from uranus_node;

-- Neptune
with neptune_node as (
  insert into nodes (name, type, parent_id, renderable)
  values ('neptune', 'planet', (select id from nodes where name = 'solar-system'), true)
  returning id
)
insert into node_details (node_id, description, stats)
select id, '"Neptune is the eighth, and most distant planet from the Sun. Most (80% or more) of the planets mass is made up of a hot dense fluid of "icy" materials – water, methane, and ammonia – above a small, rocky core. Of the giant planets, Neptune is the densest." - NASA', '{
    "age": "4.5 billion"
    }'::jsonb
from neptune_node;