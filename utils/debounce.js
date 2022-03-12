export default function debounce(fn, delay = 500, immediate = false, resultCallback) {
    let timer = null
    let isInvoke = false

    const _debounce = function (...args) {
        return new Promise((resolve, reject) => {
            clearTimeout(timer)
            if (immediate && !isInvoke) {
                const result = fn.apply(this, args)
                if (resultCallback) resultCallback(result)
                resolve(result)
                isInvoke = true
            } else {
                timer = setTimeout(() => {
                    const result = fn.apply(this, args)
                    if (resultCallback) resultCallback(result)
                    resolve(result)
                    isInvoke = false
                }, delay)
            }
        })
    }

    // 取消功能
    _debounce.cancel = function () {
        if (timer) clearTimeout(timer)
        isInvoke = false
        timer = null
    }

    return _debounce
}