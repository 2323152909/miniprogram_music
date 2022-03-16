// app.js
import {
    getLoginCode,
    codeToToken,
    checkToken,
    checkSession
} from "./service/api_login"
import {
    TOKEN_KEY
} from "./constants/token-const"
App({
    globalData: {
        screenWidth: 0,
        screenHeight: 0,
        statusBarHeight: 0,
        navBarHeight: 44,
    },
    async onLaunch() {
        // 1.获取设备信息
        const info = wx.getSystemInfoSync()
        this.globalData.screenWidth = info.screenWidth
        this.globalData.screenHeight = info.screenHeight
        this.globalData.statusBarHeight = info.statusBarHeight

        // 2.让用户默认进行登录
        const token = wx.getStorageSync(TOKEN_KEY)
        // token有没有过期
        const checkResult = await checkToken(token)
        // 判断session是否过期
        const isSessionExpire = await checkSession()

        if (!token || checkResult.errCode || !isSessionExpire) {
            this.loginAction()
        }
    },
    // 登录操作
    async loginAction() {
        // 1.获取code
        const code = await getLoginCode()

        // 2.将code发送给服务器
        const res = await codeToToken(code)
        const token = res.token
        wx.setStorageSync(TOKEN_KEY, token)
    }
})