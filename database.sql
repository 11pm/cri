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

INSERT INTO users (username, user_password) VALUES ("11pm", "password");
INSERT INTO users (username, user_password) VALUES ("halldor32", "password");

INSERT INTO friendlist (userID, friendID) values (1, 2);

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