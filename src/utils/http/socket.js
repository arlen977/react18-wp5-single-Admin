// @ts-nocheck
// import Aes from "@/utils/crypto";
// import { RSA } from "@/utils/crypto/encrypt";
// import Storage from "@/utils/storage";

// const storage = new Storage();
// 返回秘钥
// const rspSecret = storage.reduxStorageS("rspSecret");
// const rspIv = storage.reduxStorageS("rspIv");

const wsUrl = window.envConfig[process.env.APP_ENV].wsUrl

const promiseBreaker = () => {
    let resolve, reject;
    let promise = new Promise((s, j) => {
        // eslint-disable-line
        resolve = s;
        reject = j;
        setTimeout(reject, 15 * 1000, "pending time up");
    });
    return Object.assign(promise, { resolve, reject });
};

export default class WSocket {
    constructor({
        url = "", // 连接客户端地址
        name = "", // soket 连接名称 实例名称
        data = "", //携带参数
        pingTime = 50000, // 发送心跳包间隔，默认 50000 毫秒
        pongTime = 30000, // 最长未接收消息的间隔，默认 70000 毫秒
        reconnectTimeout = 4000, // 每次重连间隔
        reconnectLimit = 10, // 最大重连次数
        pingMsg = JSON.stringify({ command: 2 }), // 心跳包数据
    }) {
        this.ws = null;
        // this.url = (url || modeUrlObj[process.env.REACT_APP_ENV].soketURL) + RSA.encrypt(JSON.stringify(data)); // rsa 加密
        this.url = (url || wsUrl) + data;
        this.name = name;
        this.data = data;
        this.pingTime = pingTime;
        this.pongTime = pongTime;
        this.reconnectTimeout = reconnectTimeout;
        this.reconnectLimit = reconnectLimit;
        this.pingMsg = pingMsg;

        this.pingTimer = null; // 心跳包定时器
        this.pongTimer = null; // 接收消息定时器
        this.reconnectTimer = null; // 重连定时器
        this.reconnectCount = 0; // 当前的重连次数
        this.lockReconnect = false; // 锁定重连
        this.lockReconnectTask = false; // 锁定重连任务队列
        this.forbidReconnect = false; // 是否为手动关闭连接

        this.listeners = []; // 事件监听 返回数据

        this.promiseOpen = promiseBreaker(); //確定open之後 發送數據

        this.connect();
    }

    isOpen(ws) {
        return ws.readyState === ws.OPEN;
    }

    connect() {
        // const that = this;
        this.ws = new WebSocket(this.url);
        this.ws.addEventListener("open", event => {
            console.log(`[ws] ${this.name} 连接成功`, event);
            this.promiseOpen.resolve();
            this.listeners.forEach(listener => listener(event, "open"));
            this.clearAllTimer();
            this.heartCheck();
            this.reconnectCount = 0;
            // 解锁，可以重连
            this.lockReconnect = false;
        });

        this.ws.addEventListener("message", event => {
            // let data = JSON.parse(Aes.decryption(event.data, rspSecret, rspIv));
            let data = JSON.parse(event.data);
            console.log(`[ws] ${this.name} 收到message`, data);
            // 除了心跳信息 返回数据
            if (data?.cmd !== 1) {
                this.listeners.forEach(listener => listener(data));
            } else {
                this.send(JSON.stringify({ command: 2 }));
            }
            // 超时定时器
            clearTimeout(this.pongTimer);
            this.pongTimer = setTimeout(() => {
                this.readyReconnect();
            }, this.pongTime);
        });

        this.ws.addEventListener("error", event => {
            console.log(`[ws] ${this.name} 错误error`, event);
            this.readyReconnect();
        });

        this.ws.addEventListener("close", event => {
            console.log(`[ws] ${this.name} 关闭close:`, event.code, event.reason);
            this.readyReconnect();
        });
    }

    // 关闭连接
    close() {
        // 如果手动关闭连接，不再重连
        console.log(`[ws] ${this.name} 手动关闭close`);
        this.clearAllTimer();
        this.forbidReconnect = true;
        this.listeners = [];
        this.ws && this.ws.close();
    }
    // 取消當前訂閱
    cancel(code) {
        this.send(JSON.stringify({ command: 400, data: { cmd: code } }));
    }
    // 发送数据
    async send(msg) {
        if (!this.isOpen(this.ws)) {
            this.clearAllTimer();
            this.reconnect();
            return;
        }
        await this.promiseOpen;
        this.ws.send(msg);
        console.log("[ws] send message:", msg);
    }
    // 监听连接
    listen(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
    // 心跳机制
    heartCheck() {
        this.pingTimer = setTimeout(() => {
            this.send(this.pingMsg);
            this.heartCheck();
        }, this.pingTime);
    }
    // // 准备重连
    readyReconnect() {
        // 避免循环重连，当一个重连任务进行时，不进行重连
        if (this.lockReconnectTask) return;
        this.lockReconnectTask = true;
        this.clearAllTimer();
        this.reconnect();
    }

    // // 重连
    reconnect() {
        console.log("重连次数", this.reconnectCount);
        if (this.forbidReconnect) return;
        if (this.lockReconnect) return;
        if (this.reconnectCount > this.reconnectLimit) return;

        // 加锁，禁止重连
        this.lockReconnect = true;
        this.reconnectCount += 1;
        this.connect();
        this.reconnectTimer = setTimeout(() => {
            // 解锁，可以重连
            this.lockReconnect = false;
            this.reconnect();
        }, this.reconnectTimeout);
    }
    // 清空所有定时器
    clearAllTimer() {
        clearTimeout(this.pingTimer);
        clearTimeout(this.pongTimer);
        clearTimeout(this.reconnectTimer);
    }
}
