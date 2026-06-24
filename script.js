document.addEventListener('DOMContentLoaded', function () {
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

    let timer = null;
    let allPhotoList = [];
    let winnerIndexArr = [];

    importBtn.addEventListener('click', function () {
        imgFileDom.click();
    });

    imgFileDom.addEventListener('change', function (e) {
        const fileArr = Array.from(e.target.files);
        if (fileArr.length === 0) return;
        allPhotoList = [];
        let loadCount = 0;
        fileArr.forEach(file => {
            const reader = new FileReader();
            reader.onload = ev => {
                allPhotoList.push({
                    url: ev.target.result,
                    name: file.name.replace(/\.\w+$/, '')
                });
                loadCount++;
                if (loadCount === fileArr.length) {
                    statusLight.classList.add('success');
                    alert(`成功导入${allPhotoList.length}张小朋友照片！`);
                    emptyTip.style.display = "block";
                    drawImg.style.display = "none";
                }
            };
            reader.readAsDataURL(file);
        });
    });

    startBtn.addEventListener('click', function () {
        if (allPhotoList.length === 0) {
            alert("请先上传小朋友照片！");
            return;
        }
        const canDrawList = allPhotoList.filter((_, index) => !winnerIndexArr.includes(index));
        if (canDrawList.length === 0) {
            alert("所有小朋友都抽过啦，请重置！");
            return;
        }
        clearInterval(timer);
        timer = setInterval(() => {
            const randomIdx = Math.floor(Math.random() * canDrawList.length);
            const randomPhoto = canDrawList[randomIdx];
            emptyTip.style.display = "none";
            drawImg.style.display = "block";
            drawImg.src = randomPhoto.url;
        }, 90);
    });

    stopBtn.addEventListener('click', function () {
        clearInterval(timer);
        if (allPhotoList.length === 0) return;
        const canDrawList = allPhotoList.filter((_, index) => !winnerIndexArr.includes(index));
        const randomIdx = Math.floor(Math.random() * canDrawList.length);
        const winnerPhoto = canDrawList[randomIdx];
        const realIndex = allPhotoList.findIndex(item => item.url === winnerPhoto.url);
        winnerIndexArr.push(realIndex);

        emptyTip.style.display = "none";
        drawImg.style.display = "block";
        drawImg.src = winnerPhoto.url;

        const li = document.createElement('li');
        li.innerHTML = `<img src="${winnerPhoto.url}">${winnerPhoto.name}`;
        recordListDom.appendChild(li);
    });

    resetBtn.addEventListener('click', function () {
        clearInterval(timer);
        emptyTip.style.display = "block";
        drawImg.style.display = "none";
        drawImg.src = "";
        winnerIndexArr = [];
        recordListDom.innerHTML = "";
    });
});