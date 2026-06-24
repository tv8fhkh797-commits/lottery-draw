// 获取页面DOM元素
const imgFileDom = document.getElementById('imgFile');
const importBtn = document.getElementById('importBtn');
const statusLight = document.getElementById('statusLight');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const drawScreen = document.getElementById('showName');
const drawImg = document.getElementById('drawImg');
const emptyTip = drawScreen.querySelector('.empty-tip');
const recordListDom = document.getElementById('recordList');

let timer = null; // 滚动定时器
let allPhotoList = []; // 所有上传照片对象 {url:图片地址,name:文件名}
let winnerIndexArr = []; // 已中奖照片下标，去重

// 1、点击上传按钮触发图片选择
importBtn.onclick = () => imgFileDom.click();

// 2、监听图片多选上传
imgFileDom.onchange = function(e) {
    const fileArr = Array.from(e.target.files);
    if(fileArr.length === 0) return;

    // 清空旧照片
    allPhotoList = [];
    // 遍历读取每张图片
    fileArr.forEach(file => {
        const reader = new FileReader();
        reader.onload = ev => {
            allPhotoList.push({
                url: ev.target.result,
                name: file.name.replace(/\.\w+$/, '') // 去掉后缀当名字
            });
        };
        reader.readAsDataURL(file);
    });

    // 等待全部图片读取完成
    setTimeout(() => {
        if(allPhotoList.length === 0) {
            alert("未识别到图片，请重新上传！");
            return;
        }
        // 点亮成功指示灯
        statusLight.classList.add('success');
        alert(`成功导入${allPhotoList.length}张小朋友照片！`);
        // 重置大屏显示
        emptyTip.style.display = "block";
        drawImg.style.display = "none";
    }, 600);
}

// 3、开始滚动抽奖（循环切换照片）
startBtn.onclick = function() {
    if(allPhotoList.length === 0) {
        alert("请先上传小朋友照片！");
        return;
    }
    // 筛选还没中过奖的照片
    const canDrawList = allPhotoList.filter((_, index) => !winnerIndexArr.includes(index));
    if(canDrawList.length === 0) {
        alert("所有小朋友都抽过啦，请重置！");
        return;
    }

    // 清除旧计时器，开始快速滚动图片
    clearInterval(timer);
    timer = setInterval(() => {
        // 随机取一张未中奖照片
        const randomIdx = Math.floor(Math.random() * canDrawList.length);
        const randomPhoto = canDrawList[randomIdx];
        emptyTip.style.display = "none";
        drawImg.style.display = "block";
        drawImg.src = randomPhoto.url;
    }, 90);
}

// 4、停止抽奖，定格中奖照片
stopBtn.onclick = function() {
    clearInterval(timer);
    if(allPhotoList.length === 0) return;

    const canDrawList = allPhotoList.filter((_, index) => !winnerIndexArr.includes(index));
    const randomIdx = Math.floor(Math.random() * canDrawList.length);
    const winnerPhoto = canDrawList[randomIdx];
    // 获取原始下标，存入中奖数组去重
    const realIndex = allPhotoList.findIndex(item => item.url === winnerPhoto.url);
    winnerIndexArr.push(realIndex);

    // 定格中奖照片
    emptyTip.style.display = "none";
    drawImg.style.display = "block";
    drawImg.src = winnerPhoto.url;

    // 添加到中奖记录（小头像+名字）
    const li = document.createElement('li');
    li.innerHTML = `<img src="${winnerPhoto.url}">${winnerPhoto.name}`;
    recordListDom.appendChild(li);
}

// 5、重置：仅清空中奖记录，保留照片库、绿灯不灭
resetBtn.onclick = function() {
    clearInterval(timer);
    // 大屏恢复初始提示文字
    emptyTip.style.display = "block";
    drawImg.style.display = "none";
    drawImg.src = "";
    // 清空中奖记录数组，允许所有人重新参与抽奖
    winnerIndexArr = [];
    // 清空页面展示的中奖名单
    recordListDom.innerHTML = "";
    // 不执行熄灭绿灯代码，指示灯保持绿色
    // statusLight.classList.remove('success');
    // 不清除 allPhotoList 照片库，不重置上传文件
}