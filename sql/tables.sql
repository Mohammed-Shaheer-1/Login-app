-- users Table

CREATE TABLE users(
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(25) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    profile varchar(255)  NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
)
CREATE INDEX username_index
ON users (username);


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
    FOREIGN KEY (userId) REFERENCES  users(id),
    FOREIGN KEY (email) REFERENCES  users(email)
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

CREATE TABLE login_attempts(
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    userId INT(11) NOT NULL,
    blocked_at TIMESTAMP DEFAULT NULL,
    blocked_ip  VARCHAR(45),
    attempt_count INT,
    blocked_until DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES  users(id)
);




    
DELIMITER //

CREATE EVENT reset_login_attempts
ON SCHEDULE
    EVERY 1 MINUTE
    STARTS CURRENT_TIMESTAMP 
DO
    BEGIN
        DECLARE user_id INT;
        SELECT lg.userId INTO user_id
        FROM login_attempts lg
        WHERE lg.blocked_at IS NOT NULL;

        UPDATE login_attempts 
        SET  blocked_until = STR_TO_DATE(NOW(), '%Y-%m-%d %H:%i:%s')
        WHERE login_attempts.userId = user_id;
    END //

DELIMITER ;


-- updated one 


DELIMITER //

CREATE EVENT reset_login_attempts
ON SCHEDULE
    EVERY 1 MINUTE
    STARTS CURRENT_TIMESTAMP 
DO
    BEGIN
        DECLARE user_id INT;
        SELECT lg.userId INTO user_id
        FROM login_attempts lg
        WHERE lg.blocked_at IS NOT NULL;

        UPDATE login_attempts 
        SET  blocked_until = NULL, blocked_at = NULL ,attempt_count = NULL
        WHERE login_attempts.userId = user_id;
    END //

DELIMITER ;
