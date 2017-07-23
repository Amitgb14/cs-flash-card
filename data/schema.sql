drop table if exists cards;
create table cards (
  id integer primary key autoincrement,
  type tinyint not null, /* 1 for vocab, 2 for code */
  topic text not null,
  front text not null,
  back text not null,
  category_type text not null,
  known boolean default 0
);
