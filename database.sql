drop database if exists cri;
create database cri;
use cri;

create table users(
	id int(11) auto_increment,
	username varchar(20),
	user_password varchar(60),
	user_created timestamp,
	constraint users_PK primary key(id)
);

create table friendlist(
	userID int(11),
	friendID int(11),
	constraint friends_PK primary key(userID, friendID),
	constraint users_FK foreign key (userID) references users (id),
	constraint friend_user_FK foreign key (friendID) references users (id)
);

create table groups(
	id int(11) auto_increment,
	groupname varchar(255),
	group_created timestamp,
	constraint group_PK primary key (id)
);
create table group_users(
	userID int(11),
	groupID int(11),
	constraint group_users_PK primary key(userID, groupID)
);


INSERT INTO users (username, user_password) VALUES ("11pm", "password");
INSERT INTO users (username, user_password) VALUES ("halldor32", "password");
INSERT INTO users (username, user_password) VALUES ("aalex315","password");

INSERT INTO friendlist (userID, friendID) values (1, 2);
INSERT INTO friendlist (userID, friendID) values (2, 1);

INSERT INTO groups(groupname) VALUES ("The best call ever");

INSERT INTO group_users (userID, groupID) VALUES (1, 1);
INSERT INTO group_users (userID, groupID) VALUES (2, 1);

-- get user details
delimiter $$
DROP procedure if exists login $$

create procedure login(_username varchar(20), _password varchar(60))
begin
	SELECT * FROM users WHERE username = _username AND user_password = _password;
end $$;
delimiter ;

-- 
delimiter $$
drop procedure if exists friends $$

create procedure friends(_id varchar(1))
begin
	SELECT u2.id, u2.username FROM friendlist
    INNER JOIN users u1 ON friendlist.userID = u1.id
    INNER JOIN users u2 ON friendlist.friendID = u2.id
    WHERE u1.id = _id;
end $$

delimiter ;

delimiter $$
drop procedure if exists createGroup $$

create procedure createGroup(_groupname varchar(255))
begin
	INSERT INTO groups(groupname) VALUES (_groupname);
end $$

delimiter ;

delimiter $$
drop procedure if exists joinGroup $$

create procedure joinGroup(_groupID int, _userID int)
begin
	INSERT INTO group_users (userID, groupID) VALUES (_groupID, _userID);
end $$
delimiter ;

delimiter $$
drop procedure if exists getGroup $$

create procedure getGroup(_groupID int)
begin
	SELECT * from users
	INNER JOIN group_users
	ON users.id = group_users.userID
	INNER JOIN groups
	ON group_users.groupID = groups.id
	WHERE groups.id = _groupID;
end $$

delimiter $$

create procedure getUserGroups(_userID int)
begin
	SELECT groups.* from users
	INNER JOIN group_users
	ON users.id = group_users.userID
	INNER JOIN groups
	ON group_users.groupID = groups.id
	WHERE users.id = _userID;
end $$

delimiter ;

delimiter $$
drop procedure if exists inGroup $$

create procedure inGroup(_userID varchar(1), _groupID varchar(1))
begin
	SELECT * from users
	INNER JOIN group_users
	ON users.id = group_users.userID
	INNER JOIN groups
	ON group_users.groupID = groups.id
	WHERE users.id = _userID AND groups.id = _groupID;
end $$
