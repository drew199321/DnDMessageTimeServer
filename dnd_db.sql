drop database if exists dnd_db;
create database dnd_db;
use dnd_db;

set names utf8mb4;
set character_set_client = utf8mb4;

create table users(
    userid int(255) not null auto_increment primary key,
	username varchar(255) not null,
	passwrd varchar(255) not null,
    usertype int(255)
) engine=innodb auto_increment=1 ;

create table messages(
	msgid varchar(255) not null primary key,
    msgtime datetime not null,
    msgcontent varchar(255),
	userid int(255) not null,
	foreign key (userid) references users(userid)
) engine=innodb auto_increment=1 ;

