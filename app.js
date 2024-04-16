const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/worklog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const WorkLogSchema = new mongoose.Schema({
    username: String,
    workDate: Date,
    startTime: String,
    endTime: String,
    workDetails: String
});

const WorkLog = mongoose.model('WorkLog', WorkLogSchema);

// 작업 로그 저장
app.post('/worklogs', async (req, res) => {
    const workLog = new WorkLog(req.body);
    await workLog.save();
    res.status(201).send(workLog);
});

// 작업 로그 조회
app.get('/worklogs', async (req, res) => {
    const workLogs = await WorkLog.find();
    res.status(200).send(workLogs);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
