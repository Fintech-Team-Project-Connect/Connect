SELECT * FROM connect.user;
SELECT * FROM connect.manage;
SELECT * FROM connect.study;
SELECT * FROM connect.cafe;
SELECT * FROM connect.cron_withdraw;
SELECT * FROM connect.cron_deposit;

SELECT * FROM manage JOIN study ON manage.study_sId = study.sId WHERE manage.user_uId = 'test1';
SELECT * FROM cafe JOIN study ON cafe.cAccount = study.cafe_cAccount WHERE study.cafe_cAccount = '2222-2222';
SELECT * FROM cafe JOIN study ON cafe.cAccount = study.cafe_cAccount WHERE study.cafe_cAccount in ('4444-4444',"2222-2222");

SELECT * FROM manage JOIN study ON manage.study_sId = study.sId WHERE manage.user_uId = 'test1';

SELECT * FROM connect.cron_withdraw c JOIN connect.user u ON u.uId = c.moneyFrom WHERE transfer = 0 AND sDate = '2019-01-01';
SELECT * FROM connect.cron_deposit c JOIN connect.user u ON u.uId = c.moneyFrom WHERE transfer = 0 AND sDate = '2019-02-02';