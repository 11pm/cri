drop database if exists cri;
create database cri;
use cri;

create table users(
	id int auto_increment,
	username varchar(20),
	user_password varchar(60),
	user_created timestamp,
	constraint users_PK primary key(id)
);

create table friendlist(
	userID int,
	friendID int,
	constraint friends_PK primary key(userID, friendID),
	constraint users_FK foreign key (userID) references users (id),
	constraint friend_user_FK foreign key (friendID) references users (id)
);