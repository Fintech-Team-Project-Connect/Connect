var mysql      = require('mysql');

// connection 수립
var connection = mysql.createConnection({
    host     : '192.168.70.224', // database end-point
    port     : '3306',
    user     : 'develop', // 접속할 db 계정
    password : '1q2w3e4r', // db 계정 비밀번호
    database : 'connect' // 현재 사용할 데이터베이스
});
 
// connection.connect이후query 전송(서버에 연결하는 구문)
connection.connect();
 
connection.query('SELECT * FROM user', function (error, results, fields) {
    if (error) throw error;
    console.log('\n* 사용자 확인 -> ' + results[0].name);
});

// connection은 end하기 전까지 유지됨
connection.end();