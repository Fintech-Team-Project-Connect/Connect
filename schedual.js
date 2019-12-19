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

/*
크론이 할 일

- 5초마다 반복되는 일 실행
- 뭘 반복하는지? sql문! 즉, 시스템이 반복적으로 DB에 접근
- sql이 표현하고자 하는 바? 이체했는지 아닌지를 체크! 이체 안 했으면 이체 완료로 변경
- 언제 변경하느냐? 우리가 설정한 날에
- 무엇에 대한 이체건인지? 어떤 스터디인지!
- 얼마를 이체해야하는지? 어떤 스터디카페인지!
*/

// * 크론 Job 스케줄러(일정 시간마다 반복되는 작업 자동화) - 출금이체
cron.schedule('*/5 * * * * *', () => {

    console.log('출금이체 대기 중입니다.');

    var sql = "SELECT * FROM connect.cron c JOIN connect.user u ON u.uId = c.moneyFrom WHERE transfer = ? AND sDate = ?";
    connection.query(sql, [0, '2019-01-01'], function(error, results, fields) {
   
        if (error)
            throw error;
        else
        {
            for(var i = 0; i < results.length; i++) { // 이체되지 않은 건들이 존재하는 만큼 반복
                
                console.log('\n* 출금이체되지 않은 내역들 출력 results -> ');
                console.log(results[0]);
                
                var countNum = Math.floor(Math.random() * 1000000000) + 1;
                var bankTranId = "T991599850U" + countNum;

                var option = { 
                    method: 'POST',
                    url: 'https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num',
                    headers: {
                        Authorization: 'Bearer ' + results[0].accessToken // 사용자의 acessToken에 대한 접근 권한이 없으므로, DB에서 가져옴
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
                    
                    var updateSQL = "UPDATE cron SET transfer = 1 WHERE cronId = ?";
                    connection.query(updateSQL, [results[0].cronId], function(err, result) {
                        if(err){
                            console.error(err);
                            throw err;
                        }
                        else {
                            console.log('\n* 출금이체 성공 body -> ')
                            console.log(body);
                        }
                    })
        
                });
            }
        }
    });
});

// * 크론 Job 스케줄러(일정 시간마다 반복되는 작업 자동화) - 입금이체
cron.schedule('*/5 * * * * *', () => {

    console.log('입금이체 대기 중입니다.');

    var accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJUOTkxNTk5ODUwIiwic2NvcGUiOlsib29iIl0sImlzcyI6Imh0dHBzOi8vd3d3Lm9wZW5iYW5raW5nLm9yLmtyIiwiZXhwIjoxNTgzOTg5Mzc4LCJqdGkiOiJiMWQ0MDNkYS1kMTZlLTQ1ZDYtOTM0OC1mMjRmYTgxNmIwNDUifQ.WXaGocfB_wbvBZ2xs4HlSioXtyUBoX4L1iVeFprqRQU"
    var sql = "SELECT * FROM cron c JOIN study s ON c.moneyTo = s.cafe_cAccount WHERE c.transfer = ? AND s.sDate = ?;";
    
    
    
    connection.query(sql, [0, '2019-11-11'], function(error, results, fields) {
   
        if (error)
            throw error;
        else
        {
            for(var i = 0; i < results.length; i++) { // 이체되지 않은 건들이 존재하는 만큼 반복
                
                console.log('\n* 입금이체되지 않은 내역들 출력 results -> ');
                console.log(results[0]);
                
                var countNum = Math.floor(Math.random() * 1000000000) + 1;
                var bankTranId = "T991599850U" + countNum;

                var option = { 
                    method: 'POST',
                    url: 'https://testapi.openbanking.or.kr/v2.0/transfer/deposit/fin_num',
                    headers: {
                        Authorization: 'Bearer ' + accessToken // 사용자의 accessToken이 아닌, 우리App의 것이므로 그냥 값 고정으로 사용
                    },
                    json :
                    {
                        "cntr_account_type" : "N",
                        "cntr_account_num" : "2222222222",
                        "wd_pass_phrase" : "NONE",
                        "wd_print_content" : "스터디비용출금",
                        "name_check_option" : "on",
                        "tran_dtime" : "20191218135100",
                        "req_cnt" : "1",
                        "req_list" :
                        [
                            {
                                "tran_no" : "1",
                                "bank_tran_id": bankTranId,
                                "fintech_use_num": "199159985057870944512374",
                                "print_content": "스터디비용입금",
                                "tran_amt": "15000",
                                "req_client_name": "서용진",
                                "req_client_bank_code" : "097",
                                "req_client_account_num" : "2222222222",
                                "req_client_num": "2222222222",
                                "transfer_purpose": "TR"
                            }
                        ]
                    },
                }
                request(option, function (error, response, body) {
                    
                    var updateSQL = "UPDATE cron SET transfer = 1 WHERE cronId = ?";
                    connection.query(updateSQL, [results[0].cronId], function(err, result) {
                        if(err){
                            console.error(err);
                            throw err;
                        }
                        else {
                            console.log('\n* 입금이체 성공 body -> ')
                            console.log(body);
                        }
                    })
        
                });
            }
        }
    });
});