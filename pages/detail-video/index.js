// pages/detail-video/index.js
import {
    getMVData,
    getMVUrl,
    getMVRelated
} from "../../service/api_video"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mvUrlInfo: {},
        mvDataInfo: {},
        mvRelatedInfo: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 1.获取传入的id
        const id = options.id

        // 2.获取页面的数据
        this.getPageData(id)
    },
    getPageData(id) {
        // 1.通过id获取到对应的MV数据
        getMVData(id).then(res => {
            this.setData({
                mvDataInfo: res.data
            })
        })
        // 2.获取到mv地址
        getMVUrl(id).then(res => {
            this.setData({
                mvUrlInfo: res.data
            })
        })
        // 3.获取到与该mv相关的视频
        getMVRelated(id).then(res => {
            this.setData({
                mvRelatedInfo: res.data
            })
        })
    }
})