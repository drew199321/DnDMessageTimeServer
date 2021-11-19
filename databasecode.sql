drop database if exists dnd_db;
create database dnd_db;
use dnd_db;

set names utf8mb4;
set character_set_client = utf8mb4;

create table users(
	username varchar(255) not null,
    userid int(255) not null auto_increment,
	passwrd varchar(255) not null,
    usertype int(255),
    primary key(userid)
) engine=storage_engine auto_increment=1 ;

create table message(
	msgid varchar(255) not null,
    msgtime datetime not null,
    msgcontent varchar(255),
	userid int(255) not null,
	primary key(msgid),
	foreign key (userid) references users(userid)
) engine=storage_engine auto_increment=1 ;

