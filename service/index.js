import {
    TOKEN_KEY
} from "../constants/token-const"
const token = wx.getStorageSync(TOKEN_KEY)
const BASE_URL = "http://120.79.64.82:9001"
const LOGIN_BASE_URL = "http://123.207.32.32:3000"

class HDRequest {
    constructor(baseURL, authHeader = {}) {
        this.baseURL = baseURL
        this.authHeader = authHeader
    }

    request(url, method, params, isAuth = false, header = {}) {
        const finalHeader = isAuth ? {
            ...header,
            ...this.authHeader
        } : header
        // const finalHeader = isAuth ? Object.assign(header, this.authHeader) : header
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseURL + url,
                method,
                data: params,
                header: finalHeader,
                success(res) {
                    resolve(res.data)
                },
                fail(err) {
                    reject(err)
                }
            });
        })
    }

    get(url, params, isAuth = false, header) {
        return this.request(url, "GET", params, isAuth, header)
    }
    post(url, params, isAuth = false, header) {
        return this.request(url, "POST", params, isAuth, header)
    }
}

const hdRequest = new HDRequest(BASE_URL)
const hdLoginRequest = new HDRequest(LOGIN_BASE_URL, {
    token
})

export default hdRequest
export {
    hdLoginRequest
}