const BASE_URL = "http://120.79.64.82:9001"

class HDRequest {
    request(url, method, params) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: BASE_URL + url,
                method,
                data: params,
                success(res) {
                    resolve(res.data)
                },
                fail(err) {
                    reject(err)
                }
            });
        })
    }

    get(url, params) {
        return this.request(url, "GET", params)
    }
    post(url, params) {
        return this.request(url, "POST", params)
    }
}

const hdRequest = new HDRequest()

export default hdRequest