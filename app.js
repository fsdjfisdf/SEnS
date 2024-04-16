const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yourDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const mongoose = require('mongoose');

const workLogSchema = new mongoose.Schema({
    title: String,
    date: Date,
    startTime: String,
    endTime: String,
    workers: [{ name: String, role: String }],
    actions: String,
    results: String,
    // 추가 필드
});

const WorkLog = mongoose.model('WorkLog', workLogSchema);

const express = require('express');
const app = express();
const WorkLog = require('./models/workLog');  // 모델 불러오기

app.use(express.json());

// 작업 로그 생성
app.post('/worklogs', async (req, res) => {
    try {
        const newLog = new WorkLog(req.body);
        await newLog.save();
        res.status(201).send(newLog);
    } catch (error) {
        res.status(400).send(error);
    }
});

// 작업 로그 읽기
app.get('/worklogs', async (req, res) => {
    try {
        const logs = await WorkLog.find({});
        res.status(200).send(logs);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


document.getElementById('fetchLogsButton').addEventListener('click', async () => {
    const response = await fetch('/worklogs');
    const logs = await response.json();
    console.log(logs);
});
