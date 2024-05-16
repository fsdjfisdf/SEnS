const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// JSON 바디 파서를 사용하여 JSON 요청을 처리
app.use(bodyParser.json());

// 정적 파일을 서빙하기 위해 public 디렉토리를 사용
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: '3.37.165.84',
  user: 'root',
  password: '000000', // 실제 비밀번호로 대체
  database: 'work_log_db'
});

db.connect(err => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err);
    return;
  }
  console.log('데이터베이스에 연결되었습니다.');
});

app.post('/log', (req, res) => {
  const { task_name, worker, task_result, task_cause } = req.body;
  const query = 'INSERT INTO work_log (task_name, worker, task_result, task_cause) VALUES (?, ?, ?, ?)';

  db.query(query, [task_name, worker, task_result, task_cause], (err, result) => {
    if (err) {
      res.status(500).send('작업 로그 추가 실패.');
    } else {
      res.status(200).send('작업 로그가 성공적으로 추가되었습니다.');
    }
  });
});

app.get('/logs', (req, res) => {
  const query = 'SELECT * FROM work_log';

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('로그 불러오기 실패.');
    } else {
      res.status(200).json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
