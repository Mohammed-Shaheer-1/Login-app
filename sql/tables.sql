-- users Table

CREATE TABLE users(
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(25) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL ,
    last_name VARCHAR(255) NOT NULL ,
    mobile varchar(255) UNIQUE NOT NULL,
    address varchar(255)  NOT NULL,
    profile varchar(255)  NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
)
CREATE INDEX email_index
ON users (email);


CREATE TABLE details(
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    userId INT(11) NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL ,
    last_name VARCHAR(255) NOT NULL ,
    mobile varchar(15) UNIQUE NOT NULL,
    profile varchar(255)  NOT NULL,
    address VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES  users(id)
);
-- user insertion
DELIMITER //
CREATE PROCEDURE insertUsers(username VARCHAR(255), password VARCHAR(255), profile VARCHAR(255), email VARCHAR(255))
BEGIN
		INSERT INTO users (users.username, users.password, users.profile, users.email) VALUES(username,password,profile,email);
END ;

--user details insertion
DELIMITER //
CREATE PROCEDURE insertUserDetails(user_id INT(11), first_name VARCHAR(255),last_name VARCHAR(255),email  VARCHAR(255),mobile VARCHAR(15),address VARCHAR(255), profile VARCHAR(255))
BEGIN
INSERT INTO details(details.userId,details.first_name,details.last_name,details.email,details.mobile,details.address,details.profile) VALUES(userId,first_name,last_name,email,mobile,address,profile);
END ;