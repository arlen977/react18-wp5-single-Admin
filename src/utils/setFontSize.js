// 基准大小
const baseSize = 192;
// 设置 rem 函数
function setRem() {
    // 当前页面宽度相对于 1920 宽的缩放比例，可根据自己需要修改。
    const scale = document.documentElement.clientWidth / 1920;
    if (scale < 0.75) {
        window.afontScale = 0.75;
        document.documentElement.style.fontSize = `${baseSize * Math.min(0.7, 2)}px`;
        return;
    }
    // 设置页面根节点字体大小
    window.afontScale = scale;
    document.documentElement.style.fontSize = `${baseSize * Math.min(scale, 2)}px`;
    console.log("fon-size", document.documentElement.style.fontSize);
}
// 节流
function throttle(method, context) {
    clearTimeout(method.tid);
    method.tid = setTimeout(function () {
        method.call(context);
    }, 500);
}

setRem();

// const resizeEvt = "orientationchange" in window ? "orientationchange" : "resize";
// window.addEventListener(resizeEvt, setRem, false);
window.onresize = function () {
    throttle(setRem, window);
};
