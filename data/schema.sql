drop table if exists cards;
drop table if exists topics;
create table topics (
  id integer primary key autoincrement,
  topic text not null,
  category text not null
);

create table cards (
  id integer primary key autoincrement,
  type tinyint not null, /* 1 for vocab, 2 for code */
  topic text not null,
  front text not null,
  back text not null,
  category text not null,
  priority tinyint default 5,
  known boolean default 0
);
