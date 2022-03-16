import {
    hdLoginRequest
} from "./index"
// 获取code
export function getLoginCode() {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout: 1000,
            success: (res) => {
                const code = res.code
                resolve(code)
            },
            fail: reject
        })
    })
}

// 通过code获取token
export function codeToToken(code) {
    return hdLoginRequest.post("/login", {
        code
    })
}

// 判断token是否过期
export function checkToken(token) {
    return hdLoginRequest.post("/auth", {}, {
        token
    })
}

// 判断session是否过期
export function checkSession(){
    return new Promise((resolve, reject) => {
        wx.checkSession({
          success: () => {
              resolve(true)
          },
          fail:() => {
              resolve(false)
          }
        })
    })
}