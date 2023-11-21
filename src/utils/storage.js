class Storage {
    // constructor(options) {}

    // 存数据前处理
    _getInputData(data, options) {
        const _data = {
            data,
            keyInfo: Object.assign(options, {
                timestamp: new Date().getTime(),
            }),
        };

        return JSON.stringify(_data);
    }

    // 取数据后处理
    _getOutputData(data) {
        const _data = JSON.parse(data);

        return _data;
    }

    // 获取_key的数据 => { data, keyInfo }
    _getData(_key) {
        const _data = localStorage.getItem(_key);

        return this._getOutputData(_data);
    }

    // 特殊处理key
    _getKey(key) {
        return `__storage__${key}__`;
    }

    _remove(_key) {
        localStorage.removeItem(_key);
    }

    // 是否有效期内
    _isExpired(_key) {
        const { keyInfo } = this._getData(_key);
        const { expires, timestamp } = keyInfo;

        if (!expires) {
            return true;
        }

        return timestamp + expires * 24 * 3600 * 1000 - new Date().getTime() < 0;
    }

    // 是否只读取一次
    _isOnce(_key) {
        const { keyInfo } = this._getData(_key);
        const { isOnce } = keyInfo;

        return !!isOnce;
    }

    get(key) {
        const _key = this._getKey(key);
        const _data = this._getData(_key);

        if (!_data) {
            return null;
        }

        const isExpired = this._isExpired(_key);
        const isOnce = this._isOnce(_key);

        // 删除已过期或者只读取一次的_key
        if (isExpired || isOnce) {
            this._remove(_key);
        }

        return isExpired ? null : _data.data;
    }

    set(
        key,
        data,
        options = {
            expires: 5,
        }
    ) {
        const _key = this._getKey(key);
        const _data = this._getInputData(data, options);

        localStorage.setItem(_key, _data);
    }

    remove(key) {
        const _key = this._getKey(key);

        this._remove(_key);
    }

    once(key, data, options = {}) {
        const _key = this._getKey(key);
        const _data = this._getInputData(
            data,
            Object.assign(options, {
                isOnce: true,
            })
        );

        localStorage.setItem(_key, _data);
    }
    reduxStorage(key, type = {}) {
        return this.get(key) !== undefined && this.get(key) !== null ? this.get(key) : type;
    }
    // sessionStorage
    getS(key) {
        if (!sessionStorage.getItem(key)) return "";
        try {
            return JSON.parse(sessionStorage.getItem(key));
        } catch (err) {
            return sessionStorage.getItem(key);
        }
    }
    setS(key, data) {
        if (typeof data === "object") {
            sessionStorage.setItem(key, JSON.stringify(data));
            return;
        }
        sessionStorage.setItem(key, data);
    }
    _removeS(key) {
        sessionStorage.removeItem(key);
    }

    reduxStorageS(key, type = {}) {
        return this.getS(key) && this.getS(key) !== undefined && this.getS(key) !== null ? this.getS(key) : type;
    }
    // 清除所有localStorage  retains 需要保留的值数组
    clear(retains = []) {
        // 取出需要保留的值
        const retainsObj = {};
        if (retains.length > 0) {
            retains.map(item => {
                retainsObj[item] = this.get(item);
                return item;
            });
        }

        // 清除所有
        localStorage.clear();

        // 重新赋值
        if (retains.length > 0) {
            Object.keys(retainsObj).forEach(key => {
                this.set(key, retainsObj[key]);
            });
        }
    }
    // sessionStorage
    clearS(retains = []) {
        // 取出需要保留的值
        const retainsObj = {};
        if (retains.length > 0) {
            retains.map(item => {
                retainsObj[item] = this.get(item);
                return item;
            });
        }

        // 清除所有
        sessionStorage.clear();

        // 重新赋值
        if (retains.length > 0) {
            Object.keys(retainsObj).forEach(key => {
                this.set(key, retainsObj[key]);
            });
        }
    }
}

export default Storage;
