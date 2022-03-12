// pages/detail-songs/index.js
import {
    rankingStore
} from "../../store/index"
import {
    getPlaylistDetail
} from "../../service/api_music"

Page({
    /**
     * 页面的初始数据
     */
    data: {
        ranking: "",
        type: "",
        songInfo: {},
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const type = options.type
        this.setData({
            type
        })
        if (type === "rank") {
            const ranking = options.ranking
            this.setData({
                ranking
            })
            // 1.获取数据
            rankingStore.onState(ranking, this.getRankingDataHanlder)
        } else if (type === "menu") {
            const id = options.id
            getPlaylistDetail(id).then(res => {
                this.setData({
                    songInfo: res.playlist
                })
            })
        }
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        if (this.data.type === "rank") {
            rankingStore.offState(this.data.ranking, this.getRankingDataHanlder)
        }
    },
    getRankingDataHanlder(res) {
        this.setData({
            songInfo: res
        })
    }
})