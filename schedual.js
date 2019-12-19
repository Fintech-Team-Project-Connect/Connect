// * npm 모듈
var request = require('request')
var cron = require('node-cron');

// * MySQL 연동
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '192.168.70.224', // database end-point
    port     : '3306',
    user     : 'develop', // 접속할 db 계정
    password : '1q2w3e4r', // db 계정 비밀번호
    database : 'connect' // 현재 사용할 데이터베이스
});
connection.connect();

// * 크론 Job 스케줄러(일정 시간마다 반복되는 작업 자동화)
cron.schedule('*/5 * * * * *', () => {

    console.log('출금 내역 시작합니다.');
    var sql = "SELECT * FROM connect.cron c JOIN connect.user u ON u.uId = c.moneyFrom WHERE transfer = 0;";

    connection.query(sql, function(error, results, fields) {
        if (error)
            throw error;
        else
        {
            for(var i = 0; i < results.length; i++){
                var element = results[0];
                var countNum = Math.floor(Math.random() * 1000000000) + 1;
                var bankTranId = "T991599850U" + countNum;
                var option = { 
                    method: 'POST',
                    url: 'https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num',
                    headers: {
                        Authorization: 'Bearer ' + element.accessToken
                    },
                    json :    
                    {
                        "bank_tran_id": bankTranId,
                        "cntr_account_type": "N",
                        "cntr_account_num": "1111111111",
                        "dps_print_content": "스터디비용입금",
                        "fintech_use_num": "199159985057870944710718",
                        "wd_print_content" : "스터디비용출금",
                        "tran_amt": "3000",
                        "tran_dtime": "20191218141900",
                        "req_client_name": "스터디원1",
                        "req_client_fintech_use_num" : "199159985057870944710718",
                        "req_client_num": "1111111111",
                        "transfer_purpose": "TR"
                    },
                }
                request(option, function (error, response, body) {
                    console.log('\n* 출금이체 성공 body -> ')
                    console.log(body);
                    var updateSQL = "UPDATE cron SET transfer = 1 WHERE cronId = ?";
                    connection.query(updateSQL, [element.cronId], function(err, result){
                        if(err){
                            console.error(err);
                            throw err;
                        }
                        else {
                            console.log("데이터 업데이트")
                        }
                    })
        
                });
            }
        }
    });
});