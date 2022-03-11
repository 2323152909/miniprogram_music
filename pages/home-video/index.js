// pages/home-video/index.js
import {
    getTopMV
} from "../../service/api_video"

Page({
    /**
     * 页面的初始数据
     */
    data: {
        topMvs: [],
        hasMore: true
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getTopMVData(0)
    },
    async getTopMVData(offset) {
        if (!this.data.hasMore && offset !== 0) return
        const data = await getTopMV(offset)
        if (!offset) {
            this.setData({
                topMvs: data.data,
            })
        } else {
            this.setData({
                topMvs: [...this.data.topMvs, ...data.data],
            })
        }
        this.setData({
            hasMore: data.hasMore
        })
    },
    handleVideoItemClick(event) {
        const id = event.currentTarget.dataset.item.id
        wx.navigateTo({
            url: '/pages/detail-video/index?id=' + id,
        })
    },
    onPullDownRefresh() {
        this.getTopMVData(0)
    },
    // 监听到滚动到底部的事件
    onReachBottom() {
        this.getTopMVData(this.data.topMvs.length)
    }
})