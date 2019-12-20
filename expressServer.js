// ret, var, const.. 찾아볼 것
var request = require('request');
var express = require("express");
var cron = require('node-cron');

var jwt = require('jsonwebtoken');
var tokenKey = "fintech_tokenKey";
var auth = require('./lib/auth');
var moment = require('moment');

var app = express();
var port = process.env.PORT|| 3000;

/* MySQL 연동 */
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost', // database end-point
    port     : '3306',
    user     : 'root', // 접속할 db 계정
<<<<<<< HEAD
    password : 'root', // db 계정 비밀번호
=======
    password : 'zrzrzr24', // db 계정 비밀번호
>>>>>>> a4f5e09a9f8b6e98e73e38dc447773e6435571cc
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

// * 첫 화면
app.get("/intro", function(req, res) {
    res.render('intro')
})

// * 회원가입 창
app.get("/signup", function(req, res) {
    res.render('signup')
})

// * 로그인 창
app.get('/login', function (req, res) {
    res.render('login')
})

// * 스터디 개설자/참여자 선택 창
app.get('/selectUser', function (req, res) {
    res.render('selectUser')
})

// * 스터디 개설자 창
app.get('/createStudy', function (req, res) {
    res.render('createStudy')
})

// * 스터디 참여자 창
app.get('/joinStudy', function (req, res) {
    res.render('joinStudy')
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

// * 스터디원 추가 창
app.get('/addUser', function (req, res) {
    res.render('addUser')
})

app.get('/example', function (req, res) {
    res.render('example')
})

// * 스터디 개설자 창
app.get('/manageStudy', function (req, res) {
    res.render('manageStudy')
})

app.get("/penaltyManage", function(req, res) {
    res.render('penaltyManage')
})

app.get("/addPenalty", function(req, res) {
    res.render('addPenalty')
})

app.get("/studyManage", function(req, res) {
    res.render('studyManage')
})

// * jwt 토큰 인증 모듈
app.get('/authTest', auth, function (req, res) {
    res.json('로그인된 사용자')
})

// * Callback URL
app.get("/authResult", function(req, res) {

    // * 2.1.1. 사용자인증 API (3-legged)
    var authCode = req.query.code; // authorization_code(사용자인증 성공 시 반환되는 코드)
    //console.log("\n* 사용자 인증 API를 통하여 획득한 authorization Code(사용자 동의를 받았다는 의미) -> " + authCode);
    
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
    //console.log('\n* 입력한 회원가입 정보 확인(in Server) -> \n- id : ' + id + '\n- password : ' + password + '\n- name : ' + name + '\n- account : ' + account + '\n- phone : ' + phone);

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

    //console.log('\n* 입력한 로그인 정보 확인(in Server) -> \n- id : ' + id + '\n- password : ' + password);

    connection.query(sql, [id], function(error, results, fields) {
        if (error) throw error;      
        //console.log('\n* results -> ')
        //console.log(results);

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
<<<<<<< HEAD
    var sql_2 = 'SELECT * FROM cafe JOIN study ON cafe.cAccount = study.cafe_cAccount WHERE sId = ? '

    connection.query(sql_1, [uId], function(error, results_1, fields) {
        if (error) throw error;
=======
    var sql_2 = 'SELECT * FROM cafe JOIN study ON cafe.cAccount = study.cafe_cAccount WHERE study.sId in '

    connection.query(sql_1, [uId], function(error, results_1, fields) {
        if (error) throw error;
        //console.log('\n* sql_1 results_1 -> ')
        //console.log(results_1);
>>>>>>> a4f5e09a9f8b6e98e73e38dc447773e6435571cc

        var counter = 0;
        var resList = [];

        for(var i = 0; i < results_1.length; i++) {
<<<<<<< HEAD
=======
            inSQL = inSQL + '\'' + results_1[i].sId + '\''
>>>>>>> a4f5e09a9f8b6e98e73e38dc447773e6435571cc

            connection.query(sql_2, [results_1[i].sId], function(error, results_2, fields) {
                if (error) {
                    throw error
                }
                else {
                    console.log(this.sql);

                    resList.push(results_2);
                    console.log(results_2);

                    counter++;
                    if(counter == results_1.length) {
                        console.log('\n* resList 확인 -> ');
                        console.log(resList);
                        console.log('\n* resList[i] 확인 -> ');
                        console.log(resList[0]);

                        res.json(resList);
                    }
                }
            });
        }
<<<<<<< HEAD
=======
        //console.error('\n* inSQL -> ' + inSQL);
        var resultSQL = '(' + inSQL + ')';
        console.log('\n* (sql_2 + resultSQL) -> ' + (sql_2 + resultSQL));

        connection.query(sql_2 + resultSQL, [], function(error, results_2, fields) {
            if (error) throw error;
            //console.log('\n* sql_2 results_2 -> ')
            //console.log(results_2);
            res.send(results_2);
        });  
>>>>>>> a4f5e09a9f8b6e98e73e38dc447773e6435571cc
    });
})

// * 2.2.1. 사용자정보조회 API
app.post('/userData', auth, function(req, res) {

    var uId = req.decoded.uId
    //console.log('\n* req.decoded 확인 -> ');
    //console.log(req.decoded);

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
                "cntr_account_type": "N",// -> 고정값
                "cntr_account_num": "1111111111", // 약정계좌/계정 번호
                "dps_print_content": "스터디비용입금",  // 입금계좌인자내역
                "fintech_use_num": "199159985057870944710718", // 출금계좌핀테크이용번호
                "wd_print_content" : "스터디비용출금", // 출금계좌인자내역
                "tran_amt": "3000", // 거래금액
                "tran_dtime": "20191218141900", // 요청일시
                "req_client_name": "스터디원1", // 요청고객성명
                "req_client_fintech_use_num" : "199159985057870944710718", // 요청고객핀테크이용번호
                "req_client_num": "1111111111", // 요청고객회원번호
                "transfer_purpose": "TR"// -> 고정값
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
                "cntr_account_type" : "N", // -> 고정값
                "cntr_account_num" : "약정계좌번호",
                "wd_pass_phrase" : "NONE",// -> 고정값
                "wd_print_content" : "스터디비용출금", // 출금계좌인자내역
                "name_check_option" : "on",// -> 고정값
                "tran_dtime" : "20191218135100", // 요청일시
                "req_cnt" : "1", // 입금요청건수
                "req_list" :
                [
                    {
                        "tran_no" : "1", // 거래순번
                        "bank_tran_id": bankTranId,
                        "fintech_use_num": "핀테크이용번호",
                        "print_content": "스터디비용입금", // 입금계좌인자내역
                        "tran_amt": "15000", // 거래금액
                        "req_client_name": "서용진", //요청고객성명
                        "req_client_bank_code" : "097", // 요청고객계좌
                        "req_client_account_num" : "2222222222", // 요청고객계좌번호
                        "req_client_num": "2222222222", // 요청고객회원번호
                        "transfer_purpose": "TR"// -> 고정값
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

// * 스터디 개설
var arr = [];
var i = 0;
app.post('/addUser', auth, function(req, res1) {

    var id = req.body.studyUser;
    var uId = req.decoded.uId;
    var sId = 0;
    var sql = "SELECT * FROM connect.user WHERE uId = ? ;"
    console.log('\n* 검색한 아이디 확인(in Server) -> \n- id : ' + id);

    connection.query(sql, [id], function(error, results, fields) {
        if (error) throw error;
        if(results.length < 1) {
            console.log('\n* 사용자가 없습니다.');
            res1.json('검색된 사용자 없음');
        }
        else {
            arr[i] = id;
            console.log(id + '를 담았습니다.')
            res1.json('검색된 사용자 있음');
            i++;
        }
    });

    app.post('/createStudy', auth, function(req, res) {
        var studyName = req.body.studyName;
        var cafeAccount = req.body.cafeAccount;
        var monNum = req.body.monNum;
        var dayNum =req.body.dayNum;
        var year = new Date().getFullYear();
        var studyDay = year + '-' + monNum + '-' + dayNum;
        var cafeTrans = req.body.cafeTrans;
        var indiTrans = req.body.indiTrans;
        var cost;
        var payDay = year + '-' + monNum + '-' + (dayNum-indiTrans);

        if (monNum < new Date().getMonth() +1) {
            year += 1;
            studyDay = year + '-' + monNum + '-' + dayNum;
        }
        console.log(studyDay);
        //console.log('\n* 입력한 스터디 정보 확인(in Server) -> \n- 스터디 이름 : ' + studyName + '\n- 스터디 카페 계좌 : ' + cafeAccount + '\n- 스터디 개설자 : ' + uId);
    
        // 스터디 정보 저장
        var sql1 = "INSERT INTO study( sName, sDate, indiTrans, cafeTrans, sAccount, sBalance, sPenalty, cafe_cAccount) VALUES( ?, ?, ?, ?, ?, ?, ?, ?);"
        connection.query(sql1, [studyName, studyDay, indiTrans, cafeTrans, cafeAccount, 0, 0, cafeAccount], function (error, results, fields) {
    
            if (error) 
            console.log('\n * error -> ' + error);
            //console.log(results.insertId);  
            sId = results.insertId;
            
            // 해당 카페의 비용 추출
            var sql2 = "SELECT cost FROM cafe where cAccount = ?;"
            connection.query(sql2,[cafeAccount],function(error,results,fields){
                if(error){
                    console.log('sql2에러');
                    console.log('\n * error -> ' + error);

                }else{
                    cost = results[0].cost ;
                    console.log(results[0].cost);
                }
            })
            // 지금 로그인중인 사용자 manage에 추가
            var sql3 = "INSERT INTO manage(user_uId, study_sId, manager) VALUES( ?, ?, ?);"
            connection.query(sql3, [uId, sId, 1], function (error, results, fields) {
                if (error) 
                    console.log('\n * error -> ' + error);       
                    res.json('새로운 모임 성공');

                // cron 에 로그인중인 사용자 출금내용 저장
                var sql6 = "INSERT INTO cron ( moneyFrom, moneyTo, cost, transfer, sDate) VALUES( ?, ?, ?, ? ,?);"
                connection.query(sql6, [uId, cafeAccount, cost, 0, payDay],function(error,results,fields){
                    if(error){
                        console.log('sql6에러');
                        console.log('\n * error -> ' + error);
                    }else{
                        console.log("cron에 등록되었습니다.");
                        }
                    })

                    for (var a = 0; a < arr.length; a++) {
                        // 추가한 스터디원들 manage에 추가
                        var sql4 = "INSERT INTO manage ( user_uId, study_sId, manager) VALUES( ?, ?, ?);"
                         connection.query(sql4, [arr[a], sId, 0], function (error, results, fields) {
                            if (error) 
                            console.log('\n * error -> ' + error);
                        });
                        // cron 에 스터디원들 출금내용 저장
                        var sql5 = "INSERT INTO cron ( moneyFrom, moneyTo, cost, transfer, sDate) VALUES( ?, ?, ?, ? ,?);"
                        connection.query(sql5, [arr[a], cafeAccount, cost, 0, payDay],function(error,results,fields){
                            if(error){
                            console.log('sql5에러');
                            console.log('\n * error -> ' + error);
                            }else{
                                console.log("cron에 등록되었습니다.");
                            }
                        })
                    }
            });
        });
    })
})
// * 스터디원 목록
app.post('/userList', auth, function(req, res) {

    var uId = req.decoded.uId;
    var sId = req.body.sId;
    console.log('유저리스트로 전달한 sId : ' + sId);
    var sql_1 = 'SELECT manage.user_uId FROM manage WHERE manage.study_sId = ? ;'
    var sql_2 = 'SELECT user.uPhone, user.uName FROM user WHERE user.uId in '

    connection.query(sql_1, [sId], function(error, results_1, fields) {
        if (error) throw error;
        console.log('\n* user sql_1 results_1 -> ')
        console.log(results_1);

        // sql_2은 in 구문을 사용
        var inSQL = "";
        for(var i = 0; i < results_1.length; i++) {
            inSQL = inSQL + '\'' + results_1[i].user_uId + '\''

            if(i != results_1.length - 1) {
               inSQL = inSQL + ','
            }
        }
        //console.error('\n* inSQL -> ' + inSQL);
        var resultSQL = '(' + inSQL + ')';
        console.log('\n* (sql_2 + resultSQL) -> ' + (sql_2 + resultSQL));

        connection.query(sql_2 + resultSQL, [], function(error, results_2, fields) {
            if (error) throw error;
            console.log('\n* user sql_2 results_2 -> ')
            console.log(results_2);
            res.send(results_2);
        });  
    });
})

// * 스터디 목록
app.post('/manageList', auth, function(req, res) {

    var uId = req.decoded.uId;
    var sql_1 = 'SELECT manage.study_sId FROM user, manage WHERE user.uId = ? AND manage.user_uId = ? AND manage.manager = 1;'
    var sql_2 = 'SELECT * FROM study WHERE study.sId in '

    connection.query(sql_1, [uId, uId], function(error, results_1, fields) {
        if (error) throw error;
        console.log('\n* manage sql_1 results_1 -> ')
        console.log(results_1);

        // sql_2은 in 구문을 사용
        var inSQL = "";
        for(var i = 0; i < results_1.length; i++) {
            inSQL = inSQL + '\'' + results_1[i].study_sId + '\''

            if(i != results_1.length - 1) {
               inSQL = inSQL + ','
            }
        }
        //console.error('\n* inSQL -> ' + inSQL);
        var resultSQL = '(' + inSQL + ')';
        console.log('\n* (sql_2 + resultSQL) -> ' + (sql_2 + resultSQL));

        connection.query(sql_2 + resultSQL, [], function(error, results_2, fields) {
            if (error) throw error;
            console.log('\n* manage sql_2 results_2 -> ')
            console.log(results_2);
            res.send(results_2);
        });  
    });
})

app.post('/penaltyList', auth, function(req, res) {

    var uId = req.decoded.uId;
    var sId = req.body.sId;

    var sql_1 = 'SELECT uId FROM penalty WHERE penalty.sId = ? ;'
    var sql_2 = 'select user.uName, penalty.pDate, penalty.pDetail, penalty.pAmount FROM user JOIN penalty ON user.uId = penalty.uId WHERE user.uId in '
    
    connection.query(sql_1, [sId], function(error, results_1, fields) {
        if (error) throw error;
        console.log('\n* penalty sql_1 results_1 -> ')
        console.log(results_1);

        // sql_2은 in 구문을 사용
        var inSQL = "";
        for(var i = 0; i < results_1.length; i++) {
            inSQL = inSQL + '\'' + results_1[i].uId + '\''

            if(i != results_1.length - 1) {
               inSQL = inSQL + ','
            }
        }
        //console.error('\n* inSQL -> ' + inSQL);
        var resultSQL = '(' + inSQL + ')';
        console.log('\n* (sql_2 + resultSQL) -> ' + (sql_2 + resultSQL));

        connection.query(sql_2 + resultSQL, [], function(error, results_2, fields) {
            if (error) throw error;
            console.log('\n* manage sql_2 results_2 -> ')
            console.log(results_2);
            res.send(results_2);
        });  
    });
})

app.post('/addPenalty', auth, function(req, res) {

    var sId = req.body.sId;
    var pId = req.body.pId;
    var pAmount = req.body.pAmount;
    var pDetail = req.body.pDetail;
    var pDate = req.body.pDate;
    var date = new Date();

    console.log (req.body);

    var sql = "INSERT INTO penalty (sId, uId, pAmount, pDate, pDetail) VALUES(?, ?, ?, ?, ?);"

    var ac = '0000-0000';
    connection.query(sql, [sId, pId, pAmount, pDate, pDetail], function(error, results1, fields) {
        if (error) throw error;
        console.log('result1 ->' + results1);
        res.json('insert 성공');

        var sql2 = "INSERT INTO cron (moneyFrom, moneyTo, cost, transfer, sDate) VALUES(?, ?, ?, ?, ?);"
        connection.query(sql2, [pId, ac, pAmount, 0, date], function(error, results2, fields) {
            if (error) throw error;
            var sql3 = "UPDATE study SET sBalance = ? WHERE sId = ? ;"
                connection.query(sql3, [pAmount, sId], function(error, results3, fields) {
                    if (error) throw error;
            
                    });
            });
    });

});

app.listen(port);
console.log("Listening on port ", port);