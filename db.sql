CREATE DATABASE RESUME;
USE RESUME;
create table resumerankings(
id int auto_increment primary key,
job_desc text not null,
resume_name varchar(255) not null,
score float not null,
created timestamp default current_timestamp);

select * from resumerankings;