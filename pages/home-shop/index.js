// pages/home-profile/index.js
import {
    getUserInfo
} from "../../service/api_login"

Page({
    data: {

    },
    async handleGetUserInfo(event) {
        try {
            const res = await getUserInfo()
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    },
    handleGetPhoneNumber(event) {
        console.log(event);
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    }
})