const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/worklog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("We are connected to the database!");
});

const workLogSchema = new mongoose.Schema({
    title: String,
    workers: [{ name: String, role: String }],
    actions: String,
    results: String,
    date: Date,
    startTime: String,
    endTime: String
});

const WorkLog = mongoose.model('WorkLog', workLogSchema);

// 작업 이력 가져오기
app.get('/worklogs', async (req, res) => {
    try {
        const worklogs = await WorkLog.find();
        res.json(worklogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 작업 이력 저장하기
app.post('/worklogs', async (req, res) => {
    const worklog = new WorkLog(req.body);
    try {
        const newWorkLog = await worklog.save();
        res.status(201).json(newWorkLog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 데이터 불러오기
fetch('http://localhost:3000/worklogs')
    .then(response => response.json())
    .then(data => console.log(data));

// 데이터 저장하기
fetch('http://localhost:3000/worklogs', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(workLogData)
}).then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch((error) => console.error('Error:', error));








// 로그인 상태를 추적하는 변수
var isLoggedIn = false;


document.addEventListener('DOMContentLoaded', function() {
    calculateTodayWorkHours(); // 페이지 로드 시 오늘의 작업 시간 계산
    calculateTodayWorkCount(); // 페이지 로드 시 오늘의 작업 건수 계산
});

// 로그인 버튼 클릭 이벤트 수정
document.getElementById('loginButton').addEventListener('click', function(event) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const users = {
        "admin": {"password": "password123", "level": "1", "skill": "10%", "name": "admin"},
        "320020": {"password": "320020", "level": "4", "skill": "60%", "name": "정현우"}
    };

    if (users[username] && users[username].password === password) {
        isLoggedIn = true;
        loggedInUser = users[username]; // 로그인된 사용자의 정보를 전역 변수에 저장
        updateLoggedInUI(username); // 로그인된 사용자의 UI를 업데이트하는 함수 호출
        openTab(event, 'LoggedInEng');  // 'event' 전달
    } else {
        alert('Invalid username or password.');
    }
});

function updateLoggedInUI(username) {
    calculateTodayWorkHours();
    calculateTodayWorkCount();
    document.getElementById('userSkillGraph').style.width = loggedInUser.skill;
    document.getElementById('loggedInUserLevel').textContent = `Level: ${loggedInUser.level}`;
    document.getElementById('loggedInUserSkill').textContent = `Skill: ${loggedInUser.skill}`;
    document.getElementById('loggedInUserName').textContent = `Name: ${loggedInUser.name}`;
    document.getElementById('userSearchPanel').style.display = username === "320020" ? 'block' : 'none';
}

document.getElementById('searchButton').addEventListener('click', function() {
    searchUser();
});

function searchUser() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const users = {
        "admin": {"password": "password123", "level": "1", "skill": "10%", "name": "admin"},
        "320020": {"password": "320020", "level": "4", "skill": "60%", "name": "정현우"}
    };
    const results = Object.values(users).filter(user => user.name.toLowerCase().includes(input));
    const resultsHTML = results.map(user =>
        `<div class="user-info">
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Level:</strong> ${user.level}</p>
            <p><strong>Skill:</strong> ${user.skill}</p>
        </div>`
    ).join('');
    document.getElementById('searchResults').innerHTML = resultsHTML;
}










function displayTotalWorkHours(userName) {
    const workLogs = JSON.parse(localStorage.getItem('workLogs')) || [];
    let totalMinutes = 0;

    workLogs.forEach(log => {
        if (JSON.parse(log.workers).some(worker => worker.name === userName)) {
            const startTime = new Date(log.date + ' ' + log.startTime);
            const endTime = new Date(log.date + ' ' + log.endTime);
            const duration = (endTime - startTime) / 60000; // 분 단위로 변환
            totalMinutes += duration;
        }
    });

    const totalHours = (totalMinutes / 60).toFixed(2); // 시간 단위로 변환 및 소수점 둘째 자리까지 표시
    document.getElementById('loggedInUserTotalHours').textContent = `Total Work Hours: ${totalHours} hours`;
}


function calculateTodayWorkHours() {
    const today = new Date().toISOString().slice(0, 10); // 오늘 날짜를 YYYY-MM-DD 형식으로 얻기
    const workLogs = JSON.parse(localStorage.getItem('workLogs')) || [];
    let totalMinutes = 0;

    workLogs.forEach(log => {
        if (JSON.parse(log.workers).some(worker => worker.name === loggedInUser.name) && log.date === today) {
            const startTime = new Date(log.date + ' ' + log.startTime);
            const endTime = new Date(log.date + ' ' + log.endTime);
            const duration = (endTime - startTime) / 60000; // 작업 시간을 분 단위로 계산
            totalMinutes += duration;
        }
    });

    const totalHours = (totalMinutes / 60).toFixed(2); // 총 작업 시간을 시간 단위로 변환
    document.getElementById('todayWorkHours').textContent = `오늘의 작업 시간: ${totalHours} 시간`;
}

function calculateTodayWorkCount() {
    const today = new Date().toISOString().slice(0, 10); // 오늘 날짜를 YYYY-MM-DD 형식으로 얻기
    const workLogs = JSON.parse(localStorage.getItem('workLogs')) || [];
    let count = 0;

    workLogs.forEach(log => {
        if (JSON.parse(log.workers).some(worker => worker.name === loggedInUser.name) && log.date === today) {
            count++; // 오늘 날짜에 해당하고 현재 로그인한 사용자의 작업이면 카운트 증가
        }
    });

    document.getElementById('todayWorkCount').textContent = `오늘의 작업 건수: ${count} 건`;
}

function calculateWorkDetailsInRange() {
    const startDate = document.getElementById('startDatePickerForWork').value;
    const endDate = document.getElementById('endDatePickerForWork').value;
    const workLogs = JSON.parse(localStorage.getItem('workLogs')) || [];
    let totalHours = 0, totalCount = 0;
    let setupHours = 0, setupCount = 0;
    let relocationHours = 0, relocationCount = 0;
    let maintenanceHours = 0, maintenanceCount = 0;

    if (!startDate || !endDate) {
        alert('시작 날짜와 종료 날짜를 모두 선택해주세요.');
        return;
    }

    workLogs.forEach(log => {
        const logDate = new Date(log.date);
        const startRange = new Date(startDate);
        const endRange = new Date(endDate);
        if (logDate >= startRange && logDate <= endRange) {
            const startTime = new Date(log.date + ' ' + log.startTime);
            const endTime = new Date(log.date + ' ' + log.endTime);
            const duration = (endTime - startTime) / 3600000; // 시간 단위로 변환

            totalHours += duration;
            totalCount++;

            switch(log.workType) {
                case 'SET UP':
                    setupHours += duration;
                    setupCount++;
                    break;
                case 'RELOCATION':
                    relocationHours += duration;
                    relocationCount++;
                    break;
                case 'MAINTENANCE':
                    maintenanceHours += duration;
                    maintenanceCount++;
                    break;
            }
        }
    });

    document.getElementById('totalHours').textContent = totalHours.toFixed(2) + ' 시간';
    document.getElementById('totalCount').textContent = totalCount + ' 건';
    document.getElementById('setupHoursRange').textContent = setupHours.toFixed(2) + ' 시간';
    document.getElementById('setupCountRange').textContent = setupCount + ' 건';
    document.getElementById('relocationHoursRange').textContent = relocationHours.toFixed(2) + ' 시간';
    document.getElementById('relocationCountRange').textContent = relocationCount + ' 건';
    document.getElementById('maintenanceHoursRange').textContent = maintenanceHours.toFixed(2) + ' 시간';
    document.getElementById('maintenanceCountRange').textContent = maintenanceCount + ' 건';
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    // 로그인이 필요한 탭들에 대해 로그인 상태 확인
    var loginRequiredTabs = ['LoggedInEng', 'WorkingAnalysis', 'History', 'HistoryLog'];
    if (loginRequiredTabs.includes(tabName) && !isLoggedIn) {
        alert('로그인을 해야 사용 가능한 TAB 입니다.');
        return; // 로그인하지 않은 상태에서는 접근을 허용하지 않음
    }

    // 'Work History' 탭과 'Working Analysis' 탭에 대한 특별한 로직 처리
    if (tabName === 'HistoryLog') {
        displayWorkLogs(); // 저장된 작업 이력을 불러와 화면에 표시
    }
    else if (tabName === 'WorkingAnalysis') {
        // 시작 날짜와 종료 날짜가 모두 선택되었는지 확인
        const startDate = document.getElementById('startDatePickerForWork').value;
        const endDate = document.getElementById('endDatePickerForWork').value;
        if (startDate && endDate) {
            calculateWorkDetailsInRange(); // 'Working Analysis' 탭의 데이터 처리
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 페이지 로딩 시 첫 번째 탭을 자동으로 열어주는 로직
    document.getElementsByClassName("tablinks")[0].click();

    // 'Clear Work History' 버튼에 대한 클릭 이벤트 리스너 추가
    document.getElementById('clearHistoryButton').addEventListener('click', function() {
        // 사용자에게 작업 이력을 모두 지울 것인지 확인
        if (confirm('Are you sure you want to clear all work history? This action cannot be undone.')) {
            // 로컬 스토리지에서 'workLogs' 항목 삭제
            localStorage.removeItem('workLogs');
            alert('All work history has been cleared.');
            // 작업 이력 화면 업데이트 함수 호출
            displayWorkLogs();
        }
    });
});




document.getElementById('saveButton').addEventListener('click', function() {
    // 먼저, 로컬 스토리지에서 기존의 작업 로그를 불러옵니다.
    let workLogs = JSON.parse(localStorage.getItem('workLogs')) || [];

    // 입력 필드에서 값 가져오기
    const workDate = document.getElementById('workDate').value;
    const workStartTime = document.getElementById('workStartTime').value;
    const workEndTime = document.getElementById('workEndTime').value;
    // 작업자 이름과 역할을 수집합니다.
    const workerNames = Array.from(document.querySelectorAll('[name="worker[]"]')).map(input => input.value.trim());
    const workerRoles = Array.from(document.querySelectorAll('[name="workerRole[]"]')).map(select => select.value);

    // 수집된 데이터를 바탕으로 workers 배열을 생성합니다.
    const workers = workerNames.map((name, index) => ({ name, role: workerRoles[index] }));
    const workTitle = document.getElementById('workTitle').value;
    const repPart = document.getElementById('repPart').value;
    const workCause = document.getElementById('workCause').value;
    const workGroup = document.getElementById('workGroup').value;
    const sop = document.getElementById('sop').value;
    const tsGuide = document.getElementById('tsGuide').value;
    const warranty = document.getElementById('warranty').value;
    const workSite = document.getElementById('workSite').value;
    const workLine = document.getElementById('workLine').value; // LINE 정보 추가
    const workEquipmentType = document.getElementById('workEquipmentType').value;
    const equipmentName = document.getElementById('equipmentName').value;
    const workStatus = document.getElementById('workStatus').value;
    const noneTime = document.getElementById('noneTime').value;
    const moveTime = document.getElementById('moveTime').value;
    const workType = document.getElementById('workType').value;
    const workType2 = document.getElementById('workType2').value;
    const additionalWorkType = document.getElementById('additionalWorkType').value;
    const transferItem = document.getElementById('transferItem').value;
    const actionValues = Array.from(document.querySelectorAll('[name="action[]"]')).map(input => input.value);
    const resultValues = Array.from(document.querySelectorAll('[name="result[]"]')).map(input => input.value);

    // 모든 필드의 입력 여부 확인
    if (!workDate || !workStartTime || !workEndTime || workerNames.includes("") || workerRoles.includes("") || !workTitle 
    || !workCause || actionValues.includes("") || resultValues.includes("") || !workGroup || !workSite || !workEquipmentType 
    || !equipmentName || !workStatus || !noneTime || !moveTime || !workType || !workType2 || !warranty || !transferItem || !sop || !tsGuide) {
        alert('모든 필드를 입력해주세요.');
        return;
    }

    // 새로운 작업 로그 객체 생성
    const newWorkLog = {
        date: workDate,
        startTime: workStartTime,
        endTime: workEndTime,
        workers: JSON.stringify(workers), // workers 배열을 문자열로 변환하여 저장
        title: workTitle,
        repPart: repPart,
        cause: workCause,
        group: workGroup,
        sop: sop,
        tsGuide: tsGuide,
        warranty: warranty,
        site: workSite,
        equipmentType: workEquipmentType,
        workType: workType,
        workType2: workType2,
        transferItem: transferItem,
        eqName : equipmentName,
        status : workStatus,
        noneTime : noneTime,
        moveTime : moveTime,
        additionalWorkType: additionalWorkType,
        actions: actionValues.join("\n"), // 'action' 필드 값들을 개행 문자로 구분하여 하나의 문자열로 합침
        results: resultValues.join("\n"), // 'result' 필드 값들을 개행 문자로 구분하여 하나의 문자열로 합침
        line : workLine,
    };

    // 새로운 작업 로그를 배열에 추가하고, 로컬 스토리지에 저장
    workLogs.push(newWorkLog);
    localStorage.setItem('workLogs', JSON.stringify(workLogs));

    alert('작업 이력이 저장되었습니다.');

    // 작업 이력을 화면에 다시 표시하는 함수를 호출 (이 함수를 별도로 정의해야 함)
    displayWorkLogs();
});

document.getElementById('workGroup').addEventListener('change', updateTransferItems);

function updateTransferItems() {
    const groupSelection = document.getElementById('workGroup').value;
    const transferItemSelect = document.getElementById('transferItem');
    const transferItemOptions = {
        "PEE1": ["FCIP", "CHUCK", "TM ROBOT REP"],
        "PEE2": ["SLOT VALVE", "SLIT DOOR"],
        // 추가 그룹 옵션
    };

    // 기존 옵션 초기화
    transferItemSelect.innerHTML = '<option value="SELECT">SELECT</option>';

    // 선택된 GROUP에 맞는 Transfer Item 옵션 추가
    if (transferItemOptions[groupSelection]) {
        transferItemOptions[groupSelection].forEach(function(item) {
            const option = document.createElement('option');
            option.value = option.textContent = item;
            transferItemSelect.appendChild(option);
        });
    }
}

document.getElementById('exportToExcelButton').addEventListener('click', function() {
    const workLogs = JSON.parse(localStorage.getItem('workLogs')) || [];
    const now = new Date(); // 현재 날짜와 시간을 정의

    if (workLogs.length === 0) {
        alert('저장된 작업 이력이 없습니다.');
        return;
    }

    const modifiedWorkLogs = workLogs.map(log => {
        // 'workers' 필드가 문자열로 저장되었다면 파싱, 그렇지 않다면 직접 사용
        const workers = typeof log.workers === 'string' ? JSON.parse(log.workers) : log.workers;
        const workerInfo = workers.map(worker => `${worker.name} (${worker.role})`).join(", ");

        return {
            ...log,
            workers: workerInfo,
            actions: typeof log.actions === 'string' ? log.actions : log.actions.join("\n"),
            results: typeof log.results === 'string' ? log.results : log.results.join("\n")
        };
    });

    /* xlsx 라이브러리를 사용하여 작업 로그를 엑셀 파일로 변환 */
    const worksheet = XLSX.utils.json_to_sheet(modifiedWorkLogs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "WorkLogs");

    const fileName = `WorkLogs_${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
});


document.getElementById('saveToExcel2Button').addEventListener('click', function() {
    const workLogs = JSON.parse(localStorage.getItem('workLogs')) || [];
    let excelData = [];

    workLogs.forEach(log => {
        const workers = JSON.parse(log.workers || "[]");

        if (workers.length) {
            workers.forEach(worker => {
                // 로그 데이터 복사 및 작업자 이름과 역할 추가
                const logCopy = {
                    ...log,
                    Worker: worker.name, // 'Worker' 열에 작업자 이름을 추가
                    Role: worker.role // 'Role' 열에 작업자 역할을 추가
                };
                delete logCopy.workers; // 원본 'workers' 필드 삭제
                excelData.push(logCopy);
            });
        } else {
            // 작업자 정보가 없는 경우도 고려
            excelData.push(log);
        }
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Work Logs");
    XLSX.writeFile(workbook, 'WorkLogs.xlsx');
});


document.getElementById('workType').addEventListener('change', function() {
    // 'SET UP'이 선택되었는지 확인합니다.
    if (this.value === 'SET UP'|| this.value === 'RELOCATION') {
        // 'SET UP'이 선택되면, 추가 옵션을 보여줍니다.
        document.getElementById('additionalOptions').style.display = 'block';
    } else {
        // 다른 옵션이 선택되면, 추가 옵션을 숨깁니다.
        document.getElementById('additionalOptions').style.display = 'none';
    }
});

document.getElementById('workType').addEventListener('change', function() {
    var workType = this.value;
    var transferItemContainer = document.getElementById('transferItemContainer');
    var transferItemSelect = document.getElementById('transferItem');

    if (workType === 'MAINT') {
        transferItemContainer.style.display = 'block';  // TRANSFER ITEM 선택 상자 보여주기

        // 기존 옵션 초기화
        transferItemSelect.innerHTML = '<option value="SELECT">SELECT</option>';

        // GROUP에 따른 Transfer Item 옵션 정의
        const transferItemOptions = {
            "PEE1": ["FCIP", "CHUCK", "TM ROBOT REP"],
            "PEE2": ["SLOT VALVE", "SLIT DOOR"],
            // 필요한 경우 PEE3 등에 대한 옵션도 추가할 수 있습니다.
        };

        // 사용자가 이전에 선택한 그룹 값 사용
        const groupSelection = document.getElementById('workGroup').value;

        // 선택된 GROUP에 맞는 Transfer Item 옵션 추가
        if (transferItemOptions[groupSelection]) {
            transferItemOptions[groupSelection].forEach(function(item) {
                const option = document.createElement('option');
                option.value = option.textContent = item;
                transferItemSelect.appendChild(option);
            });
        }
    } else {
        transferItemContainer.style.display = 'none';  // TRANSFER ITEM 선택 상자 숨기기
    }
});

document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('deleteLogButton')) {
        const doNotAskAgain = localStorage.getItem('doNotAskToDeleteWorkLog') === 'true';
        
        if (!doNotAskAgain && !confirm("정말 지우시겠습니까?")) {
            return; // 사용자가 '아니오'를 선택한 경우, 여기서 함수 실행을 중단합니다.
        }
        
        // 여기에 작업 이력 삭제 로직을 추가...
    }
});

// 페이지 로딩 시 첫 번째 탭을 자동으로 열어주는 로직
document.addEventListener('DOMContentLoaded', function() {
    document.getElementsByClassName("tablinks")[0].click();
    const doNotAskCheckbox = document.getElementById('doNotAskCheckbox');
    const doNotAskAgain = localStorage.getItem('doNotAskToDeleteWorkLog') === 'true';
    doNotAskCheckbox.checked = doNotAskAgain;

    // '해당 질문을 다시 묻지 않기' 체크박스 변경 이벤트 리스너
    doNotAskCheckbox.addEventListener('change', function(e) {
        localStorage.setItem('doNotAskToDeleteWorkLog', e.target.checked.toString());
    });
});

document.getElementById('printInformButton').addEventListener('click', function() {
    const title = document.getElementById('workTitle').value;
    const status = document.getElementById('workStatus').value;
    
    // .join('<br>-. ') 대신 각 텍스트 내의 모든 줄바꿈을 <br>로 변경
    const actionValues = Array.from(document.querySelectorAll('[name="action[]"]')).map(input => input.value.replace(/\n/g, '<br>')).join("<br>-. ");
    const resultValues = Array.from(document.querySelectorAll('[name="result[]"]')).map(input => input.value.replace(/\n/g, '<br>')).join("<br>-. ");

    const cause = document.getElementById('workCause').value;
    const workerValues = Array.from(document.querySelectorAll('[name="worker[]"]')).map(input => input.value).join(", ");
    const startTime = document.getElementById('workStartTime').value;
    const endTime = document.getElementById('workEndTime').value;
    const noneTime = document.getElementById('noneTime').value;
    const moveTime = document.getElementById('moveTime').value;
    const sop = document.getElementById('sop').value; // SOP 값 가져오기
    const tsGuide = document.getElementById('tsGuide').value; // T/S Guide 값 가져오기

    // 인폼 양식 생성 및 출력
    const informContent = `
        <strong>${title}</strong><br><br>
        1) STATUS<br>
        -. ${status}<br>
        <br>
        2) ACTION<br>
        -. ${actionValues}<br>
        <br>
        3) CAUSE<br>
        -. ${cause}<br>
        <br>
        4) RESULT<br>
        -. ${resultValues}<br>
        <br>
        5) SOP 및 T/S Guide 활용<br>
        -. ${sop} / ${tsGuide}<br>
        <br>
        작업자: ${workerValues}<br>
        작업시간: ${startTime} - ${endTime}<br>
        (None: ${noneTime}, Move: ${moveTime})
    `;

    document.getElementById('informContent').innerHTML = informContent;
    document.getElementById('informContent').style.display = 'block';
});

document.getElementById('copyInformButton').addEventListener('click', function() {
    // 'informContent'의 내용을 가져오기
    const informContentElement = document.getElementById('informContent');

    // HTML을 텍스트로 변환하는 과정을 개선
    let textToCopy = informContentElement.innerText;

    // 클립보드에 텍스트 복사
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            alert('Inform content copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy inform content: ', err);
            alert('Copying failed, please try manually.');
        });
});

let workerCount = 1; // 'worker' 필드의 초기 개수
let actionCount = 1; // 'ACTION' 필드의 초기 개수
let resultCount = 1; // 'RESULT' 필드의 초기 개수

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', function(e) {
        // "+" 버튼 클릭 이벤트 처리
        if (e.target && e.target.classList.contains('addRow')) {
            const field = e.target.dataset.field;
            const container = document.getElementById(`${field}Fields`);

            // 새로운 필드 컨테이너 생성
            const fieldContainer = document.createElement('div');
            fieldContainer.classList.add('field-container');

            // 입력 필드 추가
            const newInput = document.createElement('input');
            newInput.setAttribute('type', 'text');
            newInput.setAttribute('name', `${field}[]`);
            newInput.classList.add('field-input');
            fieldContainer.appendChild(newInput);

            // "Worker" 섹션에 대한 추가 로직
            if (field === 'worker') {
                // Main/Support 드롭다운 추가
                const newSelect = document.createElement('select');
                newSelect.setAttribute('name', `${field}Role[]`);
                ['Main', 'Support'].forEach(optionValue => {
                    const option = document.createElement('option');
                    option.value = optionValue;
                    option.textContent = optionValue;
                    newSelect.appendChild(option);
                });
                fieldContainer.appendChild(newSelect);
            }

            // 추가/제거 버튼 컨테이너
            const buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('add-remove-buttons');

            // "-" 버튼 추가
            const removeButton = document.createElement('button');
            removeButton.textContent = '-';
            removeButton.type = 'button';
            removeButton.classList.add('removeRow', 'smallButton', 'button');
            // 수정된 "-" 버튼 이벤트 리스너
            removeButton.addEventListener('click', function() {
                const allFields = container.querySelectorAll('.field-container');
                if (allFields.length > 1) {
                    fieldContainer.remove();
                }
            });
            buttonsContainer.appendChild(removeButton);

            fieldContainer.appendChild(buttonsContainer);
            container.appendChild(fieldContainer);
        }
        // "-" 버튼 클릭 이벤트 처리 - 이 부분은 삭제 로직을 위의 수정된 "-" 버튼 리스너로 대체하므로 제거됩니다.
    });
});


document.getElementById('workSite').addEventListener('change', function() {
    const siteSelection = this.value;
    const lineSelect = document.getElementById('workLine');
    
    // 기존 옵션 초기화
    lineSelect.innerHTML = '<option value="SELECT">SELECT</option>';

    // SITE에 따른 LINE 옵션 정의
    const lineOptions = {
        "PT": ["P1F", "P1D", "P2F", "P2D", "P3F", "P3D", "S5"],
        "HS": ["12L", "15L", "16L", "17L"],
        "IC": ["M14", "M16"],
        "CJ": ["M11", "M12", "M15"],
        "PSKH": ["PSKH"] // PSKH의 경우 선택할 수 있는 하나의 옵션만 존재
    };

    // 선택된 SITE에 맞는 LINE 옵션 추가
    if (lineOptions[siteSelection]) {
        lineOptions[siteSelection].forEach(function(line) {
            const option = document.createElement('option');
            option.value = option.textContent = line;
            lineSelect.appendChild(option);
        });
    }
});

document.querySelectorAll('.removeRow').forEach(button => {
    button.addEventListener('click', function() {
        const field = this.getAttribute('data-field');
        if (field === 'action' && actionCount > 1) {
            const fieldToRemove = document.getElementById(`workAction${actionCount}`);
            fieldToRemove.parentNode.removeChild(fieldToRemove);
            actionCount--;
        } else if (field === 'result' && resultCount > 1) {
            const fieldToRemove = document.getElementById(`workResult${resultCount}`);
            fieldToRemove.parentNode.removeChild(fieldToRemove);
            resultCount--;
        } else if (field === 'worker' && workerCount > 1) {
            const fieldToRemove = document.getElementById(`workworker${workerCount}`);
            fieldToRemove.parentNode.removeChild(fieldToRemove);
            workerCount--;
        }
    });
});

document.getElementById('resetButton').addEventListener('click', function() {
    if (confirm("RESET 하시겠습니까?")) {
        // 기본 입력 필드 초기화
        document.getElementById('workDate').value = '';
        document.getElementById('workStartTime').value = '';
        document.getElementById('workEndTime').value = '';
        document.getElementById('workTitle').value = '';
        document.getElementById('repPart').value = '';
        document.getElementById('workCause').value = '';
        document.getElementById('workGroup').value = 'SELECT';
        document.getElementById('sop').value = 'Not Utilized (No Need)';
        document.getElementById('tsGuide').value = 'Not Utilized (No Need)';
        document.getElementById('transferItem').value = 'SELECT';
        document.getElementById('warranty').value = 'SELECT';
        document.getElementById('workSite').value = 'SELECT';
        document.getElementById('workLine').value = 'SELECT';
        document.getElementById('workEquipmentType').value = 'SELECT';
        document.getElementById('equipmentName').value = '';
        document.getElementById('workStatus').value = '';
        document.getElementById('noneTime').value = '';
        document.getElementById('moveTime').value = '';
        document.getElementById('workType').value = 'SELECT';
        document.getElementById('workType2').value = 'SELECT';
        document.getElementById('workType2').value = 'SELECT';
        document.getElementById('additionalWorkType').value = 'SELECT';

        // 동적으로 추가된 모든 필드를 초기화하고 제거, 단 최소 한 개의 입력란은 남깁니다.
        const resetDynamicFields = (containerId) => {
            const container = document.getElementById(containerId);
            while (container.children.length > 1) {
                container.removeChild(container.lastChild);
            }
            // 첫 번째 입력란을 초기화합니다.
            const firstField = container.querySelector('.field-container');
            if (firstField) {
                firstField.querySelector('input').value = '';
                const select = firstField.querySelector('select');
                if (select) select.value = 'Main'; // 'worker' 섹션에 대한 처리
            }
        };

        resetDynamicFields('workerFields');
        resetDynamicFields('actionFields');
        resetDynamicFields('resultFields');

        // 추가 옵션 숨기기
        document.getElementById('additionalOptions').style.display = 'none';

        // 정보 표시 부분 숨기기
        document.getElementById('informContent').style.display = 'none';
    }
});

document.getElementById('resetSearchButton').addEventListener('click', function() {
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('searchWorker').value = '';
    document.getElementById('searchWorkTitle').value = '';

    displayWorkLogs({}); // 모든 조건을 비우고 로그를 다시 표시
});

function displayWorkLogs(searchParams) {
    const workLogs = JSON.parse(localStorage.getItem('workLogs')) || [];
    const filteredLogs = workLogs.filter(log => {
        // 날짜 구간 검색 조건
        const logDate = new Date(log.date);
        const start = searchParams.startDate ? new Date(searchParams.startDate) : null;
        const end = searchParams.endDate ? new Date(searchParams.endDate) : null;
        const matchesDate = start && end ? (logDate >= start && logDate <= end) : true;
        
        // 작업자 검색 조건
        const matchesWorker = searchParams.worker ? JSON.parse(log.workers).some(worker => worker.name.toLowerCase().includes(searchParams.worker.toLowerCase())) : true;
        
        // 작업 제목 검색 조건
        const matchesWorkTitle = searchParams.workTitle ? log.title.toLowerCase().includes(searchParams.workTitle.toLowerCase()) : true;

        return matchesDate && matchesWorker && matchesWorkTitle;
    });
    const workLogDisplay = document.getElementById('workLogDisplay');
    workLogDisplay.innerHTML = '';

    filteredLogs.reverse().forEach((log, index) => {
        const workers = JSON.parse(log.workers);
        const workerNames = workers.map(worker => worker.name).join(", ");
        const actions = log.actions.split("\n").map(action => `<li>${action}</li>`).join("");
        const results = log.results.split("\n").map(result => `<li>${result}</li>`).join("");

        const logElement = document.createElement('div');
        logElement.className = 'history-item';
        logElement.innerHTML = `
            <div class="history-summary">
                <h3>${log.title}</h3>
                <p>Worker: ${workerNames}</p>
                <p>Date: ${log.date}</p>
                <button class="detailsToggle">↓</button>
            </div>
            <div class="history-details" style="display: none;">
                <p>Start Time: ${log.startTime}</p>
                <p>End Time: ${log.endTime}</p>
                <p>Group: ${log.group}</p>
                <p>Site: ${log.site}</p>
                <p>Line: ${log.line}</p>
                <p>Equipment Type: ${log.equipmentType}</p>
                <p>Warranty: ${log.warranty}</p>
                <p>Title: ${log.title}</p>
                <p>Worker: ${workerNames}</p>
                <p>None time: ${log.noneTime}</p>
                <p>Move time: ${log.moveTime}</p>
                <p>Status: ${log.status}</p>
                <p>EQ Name: ${log.eqName}</p>
                <p>Rep Part: ${log.repPart}</p>
                <p>Action: ${log.actions.replace(/\n/g, "<br>")}</p>
                <p>Cause: ${log.cause}</p>
                <p>Result: ${log.results.replace(/\n/g, "<br>")}</p>
                <p>Work Type: ${log.workType}</p>
                <p>Additional Work Type: ${log.additionalWorkType}</p>
                <p>sop: ${log.sop}</p>
                <p>tsGuide: ${log.tsGuide}</p>
                <p>Work Type2: ${log.workType2}</p>
                <p>Transfer Item: ${log.transferItem}</p>
                <button class="deleteLogButton" data-index="${index}">Delete</button>
            </div>
        `;
        workLogDisplay.appendChild(logElement);
    });

    document.querySelectorAll('.detailsToggle').forEach(button => {
        button.addEventListener('click', function() {
            const details = this.closest('.history-item').querySelector('.history-details');
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
            this.classList.toggle('rotated'); // 버튼에 'rotated' 클래스를 토글
        });
    });

    // 이벤트 리스너를 "X" 버튼에 바인딩
    document.querySelectorAll('.deleteLogButton').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            workLogs.splice(index, 1); // 해당 인덱스의 로그를 삭제
            localStorage.setItem('workLogs', JSON.stringify(workLogs.reverse())); // 변경된 배열을 로컬 스토리지에 다시 저장하고 배열 순서를 원래대로 되돌림
            displayWorkLogs(); // 변경된 로그를 화면에 다시 표시
        });
    });

    document.getElementById('searchButton').addEventListener('click', function() {
        const searchParams = {
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            worker: document.getElementById('searchWorker').value,
            workTitle: document.getElementById('searchWorkTitle').value,
        };
        displayWorkLogs(searchParams);
    });
}

// 작업 유형 드롭다운 변경 시 호출될 함수
document.getElementById('workType').addEventListener('change', function() {
    updateFieldsBasedOnSelection();
});

document.getElementById('additionalWorkType').addEventListener('change', function() {
    updateFieldsBasedOnSelection();
});

// 선택에 따라 필드를 업데이트하는 함수
function updateFieldsBasedOnSelection() {
    const workType = document.getElementById('workType').value;
    const setupItem = document.getElementById('additionalWorkType').value;

    // SET UP과 FAB IN이 선택되었을 때 자동으로 필드를 채우기
    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'FAB IN') {
        document.getElementById('workStatus').value = 'Setup 설비반입';
        document.getElementById('workCause').value = 'SET-UP으로 인한 설비 반입';

        resetAndFillFields('action', ['All Module 반입 완료', '설비 위치 확인(Bay를 입력하세요)', 'Cable box 반입 완료', '펜스 설치 완료', 'AC rack 반입 완료']);
        resetAndFillFields('result', ['설비 반입 완료']);
    }

    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'INSTALLATION PREPARATION') {
        document.getElementById('workStatus').value = 'Template 타공 확인';
        document.getElementById('workCause').value = 'Template 타공 확인';

        resetAndFillFields('action', ['설비 타공 확인 완료 ( Bay를 작성하세요. )', 'Hole Grating 4,4,2,2 확인', 'Grating 주위 Template 타공 확인'])
        resetAndFillFields('result', ['타공 확인 완료']);
    }

    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'DOCKING') {
        document.getElementById('workStatus').value = 'Set up으로 인한 Docking';
        document.getElementById('workCause').value = 'Set up으로 인한 Docking';

        resetAndFillFields('action', ['OHT Line 확인, LP Center 확인 완료', 'EFEM 정위치 완료','All Module Docking 완료','EFEM, TM Level 완료','Accessory part, Protection Bar 장착', '지진방지 BKT, CTC, Portable Rack 장착', 'ALL PM 내부 HOOK UP 완료', 'Exhaust Port 장착 완료', 'GAS LINE 장착 완료'])
        resetAndFillFields('result', ['Docking 완료', '내부 Hook up 완료']);
    }

    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'DOCKING') {
        document.getElementById('workStatus').value = 'Set up으로 인한 Docking';
        document.getElementById('workCause').value = 'Set up으로 인한 Docking';

        resetAndFillFields('action', ['OHT Line 확인, LP Center 확인 완료', 'EFEM 정위치 완료','All Module Docking 완료','EFEM, TM Level 완료','Accessory part, Protection Bar 장착', '지진방지 BKT, CTC, Portable Rack 장착', 'ALL PM 내부 HOOK UP 완료', 'Exhaust Port 장착 완료', 'GAS LINE 장착 완료'])
        resetAndFillFields('result', ['Docking 완료', '내부 Hook up 완료']);
    }

    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'CABLE HOOK UP') {
        document.getElementById('workStatus').value = 'Set up으로 인한 Cable hook up';
        document.getElementById('workCause').value = 'Set up으로 인한 Cable hook up';

        resetAndFillFields('action', ['ALL PM TM CABLE 포설 완료', 'ODT 1s ADJ','Cable 재단 완료','RACK SIGNAL TOWER 설치 완료'])
        resetAndFillFields('result', ['Cable hook up 완료']);
    }

    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'PUMP CABLE HOOK UP') {
        document.getElementById('workStatus').value = 'Set up 으로 인한 Pump cable hook up';
        document.getElementById('workCause').value = 'Set up으로 인한 Pump cable hook up';

        resetAndFillFields('action', ['Rack <-> Pump power, signal cable 포설 완료', 'Pump단 Cable 주기 완료','주변정리 완료'])
        resetAndFillFields('result', ['Pump Cable hook up 완료']);
    }

    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'CABLE HOOK UP : SILICON 마감') {
        document.getElementById('workStatus').value = 'SET UP 으로 인한 SILICON 마감';
        document.getElementById('workCause').value = 'SET UP 으로 인한 SILICON 마감';

        resetAndFillFields('action', ['Rack 상부 실리콘 마감 완료', '빛 투과 없음 확인 완료','Agv 포설 확인 후 Pump hole hole 실리콘 마감 완료'])
        resetAndFillFields('result', ['Silicon 마감 완료']);
    }

    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'POWER TURN ON') {
        document.getElementById('workStatus').value = 'SET UP 으로 인한 Power turn on';
        document.getElementById('workCause').value = 'SET UP 으로 인한 Power turn on';

        resetAndFillFields('action', ['AC Rack turn on 완료', '설비 Power turn on 완료','EDA, EFEM PC 원격 연결 확인 완료','Utility 및 TM FFU 관련 Alarm 제외 Clear 완료'])
        resetAndFillFields('result', ['Power turn on 완료']);
    }

    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'UTILITY TURN ON') {
        document.getElementById('workStatus').value = 'SET UP 으로 인한 Utility turn on';
        document.getElementById('workCause').value = 'SET UP 으로 인한 Utility turn on';

        resetAndFillFields('action', ['Utility turn on sheet 작성 필요', 'CDA, VAC Turn on 완료','PCW Turn ON 완료','ALL PM 유량 7.0~7.3 수준(수정 필요)'])
        resetAndFillFields('result', ['Utility turn on 완료']);
    }

    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'GAS TURN ON') {
        document.getElementById('workStatus').value = 'SET UP 으로 인한 Gas turn on';
        document.getElementById('workCause').value = 'SET UP 으로 인한 Gas turn on';

        resetAndFillFields('action', ['ALL PM Purge N2 Turn on 완료', 'ALL PM O2 Turn on 완료','ALL PM N2 Turn on 완료'])
        resetAndFillFields('result', ['Gas turn on 완료']);
    }

    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'TEACHING LEVELING') {
        document.getElementById('workStatus').value = 'SET UP 으로 인한 TEACHING LEVELING';
        document.getElementById('workCause').value = 'SET UP 으로 인한 Teaching LEVELING';

        resetAndFillFields('action', ['ALL PM CHAMBER LEVELING 완료', 'TEMP UP 이전 PIN HEIGHT 측정 완료','EFEM PICK, ARM LEVELING 완료','TM PICK 장착 완료','TM 380mm 및 경향성 ADJ 완료','BM LEVELING 완료','TEMP UP 완료'])
        resetAndFillFields('result', ['LEVELING 완료']);
    }

    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'TEACHING') {
        document.getElementById('workStatus').value = 'SET UP 으로 인한 Teaching';
        document.getElementById('workCause').value = 'SET UP 으로 인한 Teaching';

        resetAndFillFields('action', ['ALL PM temp up 후 pin height adj 및 메모장 저장 완료', 'EFEM - TM 직교 완료','EFEM - TM 연결 완료','LP teaching 완료','TM Z축 Teaching 완료','EFEM Z축 Teaching 완료','ALL PM 미세 Teaching 완료','ALL PM SIGNLE TEACHING 완료'])
        resetAndFillFields('result', ['Teaching 진행 중', 'Teaching 완료']);
    }

    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'PART INSTALLATION') {
        document.getElementById('workStatus').value = 'SET UP 으로 인한 PART INSTALLATION PROCESS KIT 장착';
        document.getElementById('workCause').value = 'SET UP 으로 인한 PART INSTALLATION';

        resetAndFillFields('action', ['ALL PM TOP LID CLEAN', 'ALL PM PROCESS KIT 장착','PROCESS KIT S/N 메모장 작성 완료','장착 후 PUMPING 및 TEMP UP 완료'])
        resetAndFillFields('result', ['PART INSTALLATION 완료']);
    }

    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'LEAK CHECK') {
        document.getElementById('workStatus').value = 'SET UP 으로 인한 LEAK CHECK';
        document.getElementById('workCause').value = 'SET UP 으로 인한 LEAK CHECK';

        resetAndFillFields('action', ['ALL PM LEAK CHECK : SPIC IN', 'ALL PM O2, N2 GAS LEAK CHECK : SPEC IN'])
        resetAndFillFields('result', ['LEAK CHECK 완료']);
    }

    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'CUSTOMER CERTIFICATION 중간인증 준비') {
        document.getElementById('workStatus').value = 'SET UP 으로 인한 중간인증 준비';
        document.getElementById('workCause').value = 'SET UP 으로 인한 중간인증 준비';

        resetAndFillFields('action', ['RACK 8계통 진행 완료', 'EFEM, TM, PM, SUB UNIT 8계통 진행 완료', 'GAS BOX 1, 2 우레탄 시트 부착 완료', '중간인증 관련 서류 준비 완료'])
        resetAndFillFields('result', ['중간 인증 준비 진행 중', '중간 인증 준비 완료']);
    }

    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'CUSTOMER CERTIFICATION(PIO 장착)') {
        document.getElementById('workStatus').value = 'SET UP 으로 인한 PIO SENSOR 장착';
        document.getElementById('workCause').value = 'SET UP 으로 인한 PIO SENSOR 장착';

        resetAndFillFields('action', ['ALL LP PIO SESNSOR 장착', 'ALL LP PIO AUTO/MANUAL 정상 점등 확인', 'PIO SENSOR S/N 메모장 작성 완료'])
        resetAndFillFields('result', ['PIO SENSOR 장착완료']);
    }

    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'CUSTOMER CERTIFICATION 사전중간인증') {
        document.getElementById('workStatus').value = 'SET UP 으로 인한 사전중간인증';
        document.getElementById('workCause').value = 'SET UP 으로 인한 사전중간인증';

        resetAndFillFields('action', ['Leak Check 정상', 'Interlock Check sheet, Gas Box 도면 확인', 'Gas Box Open alarm check', 'Light Curtain alarm check', 'Protection bar alarm check', 'EFEM SIDE DOOR alarm check','LM GUIDE 구동 간 간섭 CHECK', 'MAIN RACK 확인','중간 인증 Pass'])
        resetAndFillFields('result', ['사전중간인증 완료']);
    }

    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'CUSTOMER CERTIFICATION 중간인증') {
        document.getElementById('workStatus').value = 'SET UP 으로 인한 중간인증';
        document.getElementById('workCause').value = 'SET UP 으로 인한 중간인증';

        resetAndFillFields('action', ['Leak Check 정상', 'Interlock Check sheet, Gas Box 도면 확인', 'Gas Box Open alarm check', 'Light Curtain alarm check', 'Protection bar alarm check', 'EFEM SIDE DOOR alarm check','LM GUIDE 구동 간 간섭 CHECK', 'MAIN RACK 확인','중간 인증 Pass'])
        resetAndFillFields('result', ['중간인증 완료']);
    }

    if ((workType === 'SET UP' || workType === 'RELOCATION') && setupItem === 'TTTM') {
        document.getElementById('workStatus').value = 'TTTM';
        document.getElementById('workCause').value = 'TTTM';

        resetAndFillFields('action', ['설비 사양 작성(O)', 'EC MATCHING(O)', 'PIRANI CAL(O)', 'PIN UP/DOWN TIME ADJ(O)', 'ALL PM PIN HEIGHT ADJ(O)', 'ALL PM DOOR SPEED ADJ(O)','PUMPING/VENTING TIME ADJ(O)', 'C/S PIN SPEED ADJ(O)','MFC ZERO CAL(O)', 'TEMP AUTO TUNE(O)', 'APC AUTO LEARN(O)', 'GAS PRESSURE 35.5 ADJ(O)', 'APC PARTIAL CHECK(O)', 'GAS PARTIAL CHECK(O)', 'FCIP CAL(O)', 'EPD CAL(O)', 'LEAK CHECK 값 작성(O)', 'PURGE N2 값 확인(O)' ,'TTTM SHEET 작성(O)', 'LP MARGIN CHECK(O)'])
        resetAndFillFields('result', ['TTTM 완료']);
    }
}

// 필드를 동적으로 추가하고 초기 값을 설정하는 함수
function resetAndFillFields(field, values) {
    const container = document.getElementById(`${field}Fields`);
    container.innerHTML = '';  // 기존 필드 초기화
    values.forEach(value => addField(field, value));
}

document.addEventListener('DOMContentLoaded', function() {
    const addAction = document.getElementById('actionAdd');
    const resultAdd = document.getElementById('resultAdd');

    addAction.addEventListener('click', function() {
        addField('action');
    });

    resultAdd.addEventListener('click', function() {
        addField('result');
    });
});

function addField(field, value = '') {
    const container = document.getElementById(`${field}Fields`);
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'field-container';

    const textarea = document.createElement('textarea');
    textarea.className = 'field-input';
    textarea.name = `${field}[]`;
    textarea.value = value; // Set initial value

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'add-remove-buttons';

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.textContent = '+';
    addButton.className = 'smallButton button';
    addButton.addEventListener('click', function() {
        addField(field);
    });

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = '-';
    removeButton.className = 'smallButton button';
    removeButton.addEventListener('click', function() {
        if (container.children.length > 1) {
            container.removeChild(fieldContainer);
        } else {
            alert("At least one input is required.");
        }
    });

    buttonsContainer.appendChild(addButton);
    buttonsContainer.appendChild(removeButton);

    fieldContainer.appendChild(textarea);
    fieldContainer.appendChild(buttonsContainer);
    container.appendChild(fieldContainer);

    // Adjust the textarea height based on its content
    autoResizeTextArea(textarea);
}

function autoResizeTextArea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}

document.getElementById('equipmentName').addEventListener('input', updateTitleBasedOnSelection);
document.getElementById('additionalWorkType').addEventListener('change', updateTitleBasedOnSelection);
document.getElementById('workType').addEventListener('change', updateTitleBasedOnSelection);
document.getElementById('warranty').addEventListener('change', updateTitleBasedOnSelection);

function updateTitleBasedOnSelection() {
    const eqName = document.getElementById('equipmentName').value;
    const setupItem = document.getElementById('additionalWorkType').value;
    const workType = document.getElementById('workType').value;
    const warranty = document.getElementById('warranty').value;

    let title = '';

    // TITLE 필드 기본 조합 로직
    if (eqName && setupItem !== 'SELECT' && (workType === 'SET UP' || workType === 'RELOCATION')) {
        title = `${eqName} ${setupItem}`;
    }

    // 'IN'이 Warranty에서 선택된 경우 추가 문구 삽입
    if (warranty === 'WI') {
        title += ' (위험작업, TBM O)';
    }

    document.getElementById('workTitle').value = title; // 최종 타이틀 설정
}

