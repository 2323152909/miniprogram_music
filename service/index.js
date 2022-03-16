const BASE_URL = "http://120.79.64.82:9001"

const LOGIN_BASE_URL = "http://123.207.32.32:3000"

class HDRequest {
    constructor(baseURL){
        this.baseURL = baseURL
    }

    request(url, method, params, header={}) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseURL + url,
                method,
                data: params,
                header:header,
                success(res) {
                    resolve(res.data)
                },
                fail(err) {
                    reject(err)
                }
            });
        })
    }

    get(url, params,header) {
        return this.request(url, "GET", params, header)
    }
    post(url, params,header) {
        return this.request(url, "POST", params,header)
    }
}

const hdRequest = new HDRequest(BASE_URL)
const hdLoginRequest = new HDRequest(LOGIN_BASE_URL)

export default hdRequest
export {
    hdLoginRequest
}