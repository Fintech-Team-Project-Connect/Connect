// ret, var, const.. 찾아볼 것
var request = require('request');
var express = require("express");
var cron = require('node-cron');

var jwt = require('jsonwebtoken');
var tokenKey = "fintech_tokenKey";
var auth = require('./lib/auth');

var app = express();
var port = process.env.PORT|| 3000;

/* MySQL 연동 */
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost', // database end-point
    port     : '3306',
    user     : 'root', // 접속할 db 계정
    password : 'root', // db 계정 비밀번호
    database : 'connect' // 현재 사용할 데이터베이스
});
connection.connect();

/* public 정적 파일로 */
app.use(express.static(__dirname + '/public'));

/* EJS 사용 */
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); // ejs를 view engine으로 사용
app.engine('html', require('ejs').renderFile);

/* 글 깨지지 않도록 파싱..? */
app.use(express.json());
app.use(express.urlencoded({extended:false}));

/* View 라우터, 기능 라우터 구분 */

// * 회원가입 창
app.get("/signup", function(req, res) {
    res.render('signup')
})

// * 로그인 창
app.get('/login', function (req, res) {
    res.render('login')
})

// * 
app.get('/intro', function (req, res) {
    res.render('intro')
})

// * 
app.get('/join', function (req, res) {
    res.render('join')
})

// * 
app.get('/studyInfo', function (req, res) {
    res.render('studyInfo')
})

// * 스터디 목록 창
app.get('/main', function (req, res) {
    res.render('main')
    //res.render('main_bak')
})

// * 스터디 상세 창
app.get('/studyMain', function (req, res) {
    res.render('studyMain')
})

// * 잔액조회 창
app.get('/balance', function (req, res) {
    res.render('balance')
})

// * QR코드 창
app.get('/qrCode', function(req, res) {
    res.render('qrCode');
})

// * QR코드 리더기
app.get('/qrReader', function(req, res) {
    res.render('qrReader');
})

// * jwt 토큰 인증 모듈
app.get('/authTest', auth, function (req, res) {
    res.json('로그인된 사용자')
})

// * Callback URL
app.get("/authResult", function(req, res) {

    // * 2.1.1. 사용자인증 API (3-legged)
    var authCode = req.query.code; // authorization_code(사용자인증 성공 시 반환되는 코드)
    console.log("\n* 사용자 인증 API를 통하여 획득한 authorization Code(사용자 동의를 받았다는 의미) -> " + authCode);
    
    // * 2.1.2 사용자 토큰발급 API (3-legged)
    var option = {
        method : "POST",
        url : "https://testapi.openbanking.or.kr/oauth/2.0/token",
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"
        },
        form : {
            code : authCode,
            client_id : "jiZLSQbk36kwtN0xPAaKXDkccUpEK2Tdsd55yD89",
            client_secret : "m1E9mrzXsJQgoaFVEq2D6vzv0kOf3F0mNbD3jHdD",
            redirect_uri : "http://localhost:3000/authResult",
            grant_type : "authorization_code"
        }
    }
    // 사용자인증 API를 통하여 획득한 authCode를 이용하여 오픈뱅킹에 Access Token을 요청함
    request(option, function (error, response, body) {

        // accessToken, refreshToken, userSeqNo 값이 회원가입 창에 자동으로 입력됨
        var accessRequestResult = JSON.parse(body);

        // 새로운 창을 열어서 accessToken, refreshToken, userSeqNo 값 확인하게끔
        res.render('resultChild', {data : accessRequestResult} )
    });
})

// * 회원가입
app.post('/user', function(req, res) {

    var id = req.body.id;
    var password = req.body.password;
    var name = req.body.name;
    var account = req.body.account;
    var phone = req.body.phone;
    var accessToken = req.body.accessToken;
    var refreshToken = req.body.refreshToken;
    var userSeqNo = req.body.userSeqNo;

    // postman으로 날리면 아래 콘솔 창 찍힘(accessToken, refreshToken, userSeqNo는 입력해도 안 찍힘)
    console.log('\n* 입력한 회원가입 정보 확인(in Server) -> \n- id : ' + id + '\n- password : ' + password + '\n- name : ' + name + '\n- account : ' + account + '\n- phone : ' + phone);

    var sql = "INSERT INTO user(uId, uPassword, uName, uAccount, uPhone, accessToken, refreshToken, userSeqNo) VALUES(?, ?, ?, ?, ?, ?, ?, ?);"

    connection.query(sql, [id, password, name, account, phone, accessToken, refreshToken, userSeqNo], function (error, results, fields) {

        if (error) 
            console.log('\n * error -> ' + error);
        res.json('회원가입 성공'); // '회원가입 성공' -> 이 문자는 postman으로 날렸을 때 확인 가능
    });
})

// * 로그인
app.post('/login', function(req, res) {

    var id = req.body.id;
    var password = req.body.password;
    var sql = "SELECT * FROM user WHERE uId = ?;"

    console.log('\n* 입력한 로그인 정보 확인(in Server) -> \n- id : ' + id + '\n- password : ' + password);

    connection.query(sql, [id], function(error, results, fields) {
        if (error) throw error;      
        console.log('\n* results -> ')
        console.log(results);

        if(results.length < 1) {
            console.log('\n* 사용자가 없습니다.');
        }
        else {
            if(results[0].uPassword == password) {
                // 우리 서비스에 접근하기 위한 토큰(like 입장권)임 (accessToken과 발행 주체가 다름)
                jwt.sign(
                    {
                        uId : results[0].uId,
                        uPassword : results[0].uPassword,
                    },
                    tokenKey,
                    {
                        expiresIn : '1d',
                        issuer : 'fintech.admin',
                        subject : 'user.login.info'
                    },
                    function(err, token) {
                        console.log('\n* 로그인 성공\n* 토큰 값 -> ')
                        res.json(token);
                    }
                )
            }
            else {
                console.log('\n* 등록정보가 없습니다.');
            }
        }
    });
})

// * 스터디 목록
app.post('/studyList', auth, function(req, res) {

    var uId = req.decoded.uId;
    var sql_1 = 'SELECT * FROM manage JOIN study ON manage.study_sId = study.sId WHERE manage.user_uId = ?;'
    var sql_2 = 'SELECT * FROM cafe JOIN study ON cafe.cAccount = study.cafe_cAccount WHERE study.cafe_cAccount in '

    connection.query(sql_1, [uId], function(error, results_1, fields) {
        if (error) throw error;
        console.log('\n* sql_1 results_1 -> ')
        console.log(results_1);

        // sql_2은 in 구문을 사용
        var inSQL = "";
        for(var i = 0; i < results_1.length; i++) {
            inSQL = inSQL + '\'' + results_1[i].cafe_cAccount + '\''

            if(i != results_1.length - 1) {
               inSQL = inSQL + ','
            }
        }
        console.error('\n* inSQL -> ' + inSQL);
        var resultSQL = '(' + inSQL + ')';
        console.log('\n* (sql_2 + resultSQL) -> ' + (sql_2 + resultSQL));

        connection.query(sql_2 + resultSQL, [], function(error, results_2, fields) {
            if (error) throw error;
            console.log('\n* sql_2 results_2 -> ')
            console.log(results_2);
            res.send(results_2);
        });  
    });
})

// * 2.2.1. 사용자정보조회 API
app.post('/userData', auth, function(req, res) {

    var uId = req.decoded.uId
    console.log('\n* req.decoded 확인 -> ');
    console.log(req.decoded);

    var sql = 'SELECT * FROM user WHERE uId =?'

    connection.query(sql, [uId], function(error, results, fields) {
        if (error) throw error;
        console.log('\n* 사용자정보조회 results -> ')
        console.log(results);
        
        var option = {
            method : "get",
            url : "https://testapi.openbanking.or.kr/v2.0/user/me",
            headers : {
                Authorization : "Bearer " + results[0].accessToken
            },
            qs : {
                user_seq_no : results[0].userSeqNo // user_seq_no -> 이거는 오픈뱅킹에서 만든 스펠링 규칙임
            }
        }
        request(option, function (error, response, body) {
            console.log('\n* body -> ' + body);
            
            var resultObject = JSON.parse(body); // response를 뿌려줄 때, json 타입으로 바꿔서 보여주도록 in 개발자도구
            res.send(resultObject);
        });
    });
})

// 2.3.1. 잔액조회 API : 핀테크이용번호 사용
app.post("/balance", auth, function(req, res) {
    
    // 은행거래고유번호 자동으로 생성되게끔
    var countNum = Math.floor(Math.random() * 1000000000) + 1;
    var bankTranId = "T991599850U" + countNum;
    
    var uId = req.decoded.uId;
    var finUseNum = req.body.fin_use_num;
    console.log('\n* userId 확인(DB의 accessToken을 가져오기 위한 것이어서, id든 email이든 상관x) -> ' + uId);
    console.log('* finUseNum 확인 -> ' + finUseNum)
   
    var accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzUxNDQ0Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1ODIwMDI4ODIsImp0aSI6IjU4M2E5NDY4LTI3ZmMtNGE4Yi1hNTk0LTUwYjU5YmVlY2FiNyJ9.oADLU04YVaa4SqK5_hYZNqnzr_ZENfbx8QwbR_0gM1A"
    var sql = 'SELECT * FROM user WHERE uId = ?'

    connection.query(sql, [uId], function(error, results, fields) {
        if (error) throw error;
        console.log('\n* 잔액조회 result -> ')
        console.log(results[0]);
        
        var option = { 
            method: 'GET',
            url: 'https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num',
            qs: {
                bank_tran_id: bankTranId,
                fintech_use_num: finUseNum,
                tran_dtime: '20191206141100'
            },
            headers: {
                Authorization: 'Bearer ' + results[0].accessToken
            }
        }
        request(option, function (error, response, body) {
            if(error) {
                console.log(error);
            }
            else {
                var jsonResult = JSON.parse(body).balance_amt;
                res.json(jsonResult);
                console.log('\n* 잔액 -> ' + jsonResult);
            }
        });
    });
})

// * 2.3.2. 거래내역조회 API
app.post("/transaction_list", auth, function(req, res) {
    
    // 은행거래고유번호 자동으로 생성되게끔
    var countNum = Math.floor(Math.random() * 1000000000) + 1;
    var bankTranId = "T991599850U" + countNum;
    
    var uId = req.decoded.uId;
    var finUseNum = req.body.fin_use_num;
   
    var accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzUxNDQ0Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1ODIwMDI4ODIsImp0aSI6IjU4M2E5NDY4LTI3ZmMtNGE4Yi1hNTk0LTUwYjU5YmVlY2FiNyJ9.oADLU04YVaa4SqK5_hYZNqnzr_ZENfbx8QwbR_0gM1A"
    var sql = 'SELECT * FROM user WHERE uId = ?'

    connection.query(sql, [uId], function(error, results, fields) {
        if (error) throw error;
        
        var option = { 
            method: 'GET',
            url: 'https://testapi.openbanking.or.kr/v2.0/account/transaction_list/fin_num',
            qs: {
                bank_tran_id: bankTranId,
                fintech_use_num: finUseNum,
                inquiry_type: 'A',
                inquiry_base: 'D',
                from_date: '20190101',
                to_date: '20190101',
                sort_order: 'D',
                tran_dtime: '20191206141100',
            },
            headers: {
                Authorization: 'Bearer ' + results[0].accessToken
            }
        }
        request(option, function (error, response, body) {
            if(error) {
                console.log(error);
            }
            else {
                console.log('\n* body -> ' + body);
                var resultObject = JSON.parse(body);
                res.json(resultObject);
            }
        });
    });
})

// * 2.5.1 출금이체 API
app.post('/withdraw', auth, function(req, res) {

    // 은행거래고유번호 자동으로 생성되게끔
    var countNum = Math.floor(Math.random() * 1000000000) + 1;
    var bankTranId = "T991599850U" + countNum;
    
    var uId = req.decoded.uId;
    var finUseNum = req.body.fin_use_num;
   
    var accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzUxNDQ0Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE1ODIwMDI4ODIsImp0aSI6IjU4M2E5NDY4LTI3ZmMtNGE4Yi1hNTk0LTUwYjU5YmVlY2FiNyJ9.oADLU04YVaa4SqK5_hYZNqnzr_ZENfbx8QwbR_0gM1A"
    var sql = 'SELECT * FROM user WHERE uId = ?'

    connection.query(sql, [uId], function(error, results, fields) {
        if (error) throw error;
        
        var option = { 
            method: 'POST',
            url: 'https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num',
            headers: {
                Authorization: 'Bearer ' + results[0].accessToken
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
            console.log('\n* 출금이체 body -> ')
            console.log(body);

            var resultObject = body;
            if(resultObject.rsp_code == "A0000") { // 출금이체가 성공할 경우
                res.json(1);
            } 
            else {
                res.json(resultObject.rsp_code)
            }
        });
    });    
})

// * 2.5.2. 입금이체 API
app.post('/deposit', auth, function(req, res) {

    // 은행거래고유번호 자동으로 생성되게끔
    var countNum = Math.floor(Math.random() * 1000000000) + 1;
    var bankTranId = "T991599850U" + countNum;
    
    var uId = req.decoded.uId;
    var finUseNum = req.body.fin_use_num;
   
    var accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJUOTkxNTk5ODUwIiwic2NvcGUiOlsib29iIl0sImlzcyI6Imh0dHBzOi8vd3d3Lm9wZW5iYW5raW5nLm9yLmtyIiwiZXhwIjoxNTgzOTg5Mzc4LCJqdGkiOiJiMWQ0MDNkYS1kMTZlLTQ1ZDYtOTM0OC1mMjRmYTgxNmIwNDUifQ.WXaGocfB_wbvBZ2xs4HlSioXtyUBoX4L1iVeFprqRQU"
    var sql = 'SELECT * FROM user WHERE uId = ?'

    connection.query(sql, [uId], function(error, results, fields) {
        if (error) throw error;
        
        var option = { 
            method: 'POST',
            url: 'https://testapi.openbanking.or.kr/v2.0/transfer/deposit/fin_num',
            headers: {
                Authorization: 'Bearer ' + accessToken
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
            console.log('\n* 입금이체 body -> ')
            console.log(body);

            var resultObject = body;
            if(resultObject.rsp_code == "A0000") { // 입금이체가 성공할 경우
                res.json(1);
            } 
            else {
                res.json(resultObject.rsp_code)
            }
        });
    });    
})

// * 크론 Job 스케줄러(일정 시간마다 반복되는 작업 자동화)
cron.schedule('*/10 * * * * *', () => {
    console.log('info', 'running a task every minute / ' + new Date());
});

app.listen(port);
console.log("Listening on port ", port);