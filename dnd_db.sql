use dnd;
drop table if exists messages;
drop table if exists users;


set names utf8mb4;
set character_set_client = utf8mb4;

create table users(
	userid int not null auto_increment primary key,
	username varchar(25) not null,
	passwrd varchar(25) not null,
	usertype int not null
) engine=innodb auto_increment=1;

create table messages(
	msgid varchar(120) not null primary key,
  userid int not null,
	time_of datetime not null,
  content varchar(120) not null,
  type varchar(120) not null,
	foreign key (userid) references users(userid)
) engine=innodb auto_increment=1;

