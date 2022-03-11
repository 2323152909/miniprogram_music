// 节流函数
export default function throttle(fn, interval = 500, options = {
    leading: true,
    trailing: false
}, ) {
    const {
        leading,
        trailing,
        resultCallback
    } = options
    let lastTime = 0
    let timer = null

    const _throttle = function (...args) {
        return new Promise((resolve, reject) => {
            const nowTime = new Date().getTime()
            if (!leading && !lastTime) lastTime = nowTime
            let mainTime = interval - (nowTime - lastTime)
            if (mainTime <= 0) {
                if (timer) {
                    clearTimeout(timer)
                    timer = null
                }
                const result = fn.apply(this, args)
                if (resultCallback) resultCallback(result)
                resolve(result)
                lastTime = nowTime
                return
            }

            if (trailing && !timer) {
                timer = setTimeout(() => {
                    const result = fn.apply(this, args)
                    if (resultCallback) resultCallback(result)
                    resolve(result)
                    timer = null
                    lastTime = leading ? new Date().getTime() : 0
                }, mainTime)
            }
        })
    }

    _throttle.cancle = function () {
        if (timer) clearTimeout(timer)
        lastTime = 0
        timer = null
    }

    return _throttle
}