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

create table nodes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type node_type not null,
  parent_id uuid references nodes(id) on delete cascade,
  description text,
  stats jsonb default '{}'::jsonb,
  facts jsonb default '[]'::jsonb,
  renderable boolean default false,
  created_at timestamptz default now()
);

-- Solar System
insert into nodes (name, type, description, renderable, stats)
values (
  'solar-system',
  'system',
  '"The Solar System, located in the Milky Way Galaxy, is our celestial neighborhood. Our Solar System consists of 8 planets, several dwarf planets, hundreds of moons, and millions of asteroids, comets, and meteoroids. They are all bound by gravity to the Sun, which is the star at the center of the Solar System." - National Air and Space Museum',
  false,
  '{
    "age": "4.6 billion",
    "known_minor_planets": 1528003,
    "number_of_planets": 8,
    "number_of_dwarf_planets": 5
  }'::jsonb
);

-- Sun
insert into nodes (name, type, parent_id, description, renderable, stats)
values (
    'sun', 
    'star',
    (select if from nodes where name = 'solar-system'),
    'Our Sun is a 4.5 billion year old star at the center of our Solar System. Its gravity holds our Solar System together, keeping everything from planets to small pieces of debris, in orbit around it." - National Air and Space Museum',
    true,
    '{
    "age": "4.5 billion"
    }'::jsonb
);

-- Mercury 
insert into nodes (name, type, description, renderable, stats)
values (
    'mercury', 
    'planet',
    (select if from nodes where name = 'solar-system'),
    '"Mercury is the closest planet to the Sun, and the smallest planet in our solar system. Mercury is named for the swiftest of the ancient Roman gods." - NASA',
    true,
    '{
    "age": "4.5 billion"
    }'::jsonb
);

-- Venus 
insert into nodes (name, type, description, renderable, stats)
values (
    'venus', 
    'planet',
    (select if from nodes where name = 'solar-system'),
    '"Venus is the second planet from the Sun, and the sixth largest planet. It’s the hottest planet in our solar system. Venus is named for the ancient Roman goddess of love and beauty, who was known as Aphrodite to the ancient Greeks. Most features on Venus are named for women. It’s the only planet named after a female god." - NASA',
    true,
    '{
    "age": "4.5 billion"
    }'::jsonb
);

-- Earth 
insert into nodes (name, type, description, renderable, stats)
values (
    'earth', 
    'planet',
    (select if from nodes where name = 'solar-system'),
    '"Earth is the third planet from the Sun and the only astronomical object known to harbor life.  Its unique combination of water, atmosphere, and geology makes it distinct in the solar system." - The Solar System Wiki',
    true,
    '{
    "age": "4.5 billion"
    }'::jsonb
);

-- Mars
insert into nodes (name, type, description, renderable, stats)
values (
    'mars', 
    'planet',
    (select if from nodes where name = 'solar-system'),
    '"Mars is the fourth planet from the Sun, and the seventh largest. It’s the only planet we know of inhabited entirely by robots. It’s dry, rocky, and bitter cold. Mars was named by the ancient Romans for their god of war because its reddish color was reminiscent of blood." - NASA',
    true,
    '{
    "age": "4.5 billion"
    }'::jsonb
);

-- Jupiter
insert into nodes (name, type, description, renderable, stats)
values (
    'jupiter', 
    'planet',
    (select if from nodes where name = 'solar-system'),
    '"Jupiter is the fifth planet from the Sun, and the largest in the solar system, by far — more than twice as massive as the other planets combined. Jupiter, being the biggest planet, gets its name from the king of the ancient Roman gods." - NASA',
    true,
    '{
    "age": "4.5 billion"
    }'::jsonb
);

insert into nodes (name, type, description, renderable, stats)
values (
    'saturn',
    'planet',
    (select if from nodes where name = 'solar-system'),
    '"Saturn is the sixth planet from the Sun, and the second largest in the solar system. Saturn is a massive ball made mostly of hydrogen and helium. Saturn is not the only planet to have rings, but none are as spectacular or as complex as Saturns." - NASA',
    true,
    '{
    "age": "4.5 billion
    }'::jsonb
)

-- Uranus
insert into nodes (name, type, description, renderable, stats)
values (
    'uranus', 
    'planet',
    (select if from nodes where name = 'solar-system'),
    '"Uranus is the seventh planet from the Sun, and the third largest planet in our solar system. Uranus is very cold and windy. It is surrounded by faint rings, and more than two dozen small moons. It rotates at a nearly 90-degree angle from the plane of its orbit. This unique tilt makes Uranus appear to spin on its side." - NASA ',
    true,
    '{
    "age": "4.5 billion"
    }'::jsonb
);

-- Neptune
insert into nodes (name, type, description, renderable, stats)
values (
    'neptune', 
    'planet',
    (select if from nodes where name = 'solar-system'),
    '"Neptune is the eighth, and most distant planet from the Sun. Most (80% or more) of the planets mass is made up of a hot dense fluid of "icy" materials – water, methane, and ammonia – above a small, rocky core. Of the giant planets, Neptune is the densest." - NASA',
    true,
    '{
    "age": "4.5 billion"
    }'::jsonb
);