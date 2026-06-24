// 获取页面元素
const nameListDom = document.getElementById('nameList');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const showNameDom = document.getElementById('showName');
const recordListDom = document.getElementById('recordList');
// 新增：Excel导入相关元素
const excelFileDom = document.getElementById('excelFile');
const importBtn = document.getElementById('importBtn');

let timer = null; // 滚动定时器
let allNames = []; // 全部参与人
let winnerList = []; // 已中奖名单

// -------------------------- 新增：Excel导入核心逻辑 --------------------------
// 点击导入按钮，触发文件选择
importBtn.onclick = function () {
    excelFileDom.click(); // 触发隐藏的文件选择框
}

// 监听文件选择变化，读取解析Excel
excelFileDom.onchange = function (e) {
    const file = e.target.files[0];
    if (!file) return;

    // 校验文件格式
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
        alert('请上传.xlsx或.xls格式的Excel文件！');
        return;
    }

    // 读取Excel文件
    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            // 解析Excel文件
            const workbook = XLSX.read(event.target.result, { type: 'binary' });
            // 读取第一个工作表（Sheet）
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            // 把工作表转换成二维数组
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // 提取第一列的人名，过滤空行和空值
            const nameList = data
                .map(row => row[0]) // 取每行第一列
                .filter(name => name && String(name).trim() !== ''); // 过滤空值

            if (nameList.length === 0) {
                alert('Excel第一列没有读取到有效人名，请检查文件！');
                return;
            }

            // 把人名用换行符拼接，填充到文本框里
            nameListDom.value = nameList.join('\n');
            alert(`成功导入${nameList.length}个参与人！`);

        } catch (error) {
            alert('Excel文件解析失败，请检查文件是否损坏！');
            console.error(error);
        }
    };
    reader.readAsBinaryString(file);
}
// -----------------------------------------------------------------------------

// 开始抽奖
startBtn.onclick = function () {
    // 读取输入框名单，切割成数组
    const rawText = nameListDom.value.trim();
    if (!rawText) {
        alert('请先输入参与名单！');
        return;
    }
    allNames = rawText.split('\n').filter(item => item.trim() !== '');

    // 过滤掉已经中过奖的人，不重复中奖
    const canDraw = allNames.filter(name => !winnerList.includes(name));
    if (canDraw.length === 0) {
        alert('所有人都已经抽过奖，请重置！');
        return;
    }

    // 滚动名字动画
    clearInterval(timer);
    timer = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * canDraw.length);
        showNameDom.innerText = canDraw[randomIndex];
    }, 80);
}

// 停止抽奖，确定中奖人
stopBtn.onclick = function () {
    clearInterval(timer);
    if (!allNames.length) return;

    const rawText = nameListDom.value.trim();
    allNames = rawText.split('\n').filter(item => item.trim() !== '');
    const canDraw = allNames.filter(name => !winnerList.includes(name));

    // 随机选出中奖者
    const randomIndex = Math.floor(Math.random() * canDraw.length);
    const winner = canDraw[randomIndex];
    showNameDom.innerText = `恭喜：${winner}`;

    // 存入中奖记录
    winnerList.push(winner);
    const li = document.createElement('li');
    li.innerText = winner;
    recordListDom.appendChild(li);
}

// 重置所有记录
resetBtn.onclick = function () {
    clearInterval(timer);
    showNameDom.innerText = '等待开始抽奖';
    winnerList = [];
    recordListDom.innerHTML = '';
    excelFileDom.value = ''; // 清空已选文件
}