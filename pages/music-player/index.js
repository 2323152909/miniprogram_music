// pages/music-player/index.js
import {
    getSongDetail,
    getSongLyric,
    getSongUrl
} from "../../service/api_player"

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        currentSong: {},

        currentPage: 0,
        contentHeight: 0,

        url: "",
        audioContext: {},
        play: true,
        playMusicImg: require("../../assets/images/player/play_music"),
        playNextImg: require("../../assets/images/player/play_next"),
        playOrderImg: require("../../assets/images/player/play_order"),
        playPauseImg: require("../../assets/images/player/play_pause"),
        playPrevImg: require("../../assets/images/player/play_prev"),
        playRandomImg: require("../../assets/images/player/play_random"),
        playRepeatImg: require("../../assets/images/player/play_repeat"),
        playResumeImg: require("../../assets/images/player/play_resume"),
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 1.获取传入的歌曲id
        const id = options.id
        this.setData({
            id,
            url: `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        })

        // 2.获取页面数据
        this.getPageData(id)

        // 3.动态计算内容高度
        const globalData = getApp().globalData
        const screenHeight = globalData.screenHeight
        const statusBarHeight = globalData.statusBarHeight
        const navBarHeight = globalData.navBarHeight
        const contentHeight = screenHeight - statusBarHeight - navBarHeight

        this.setData({
            contentHeight
        })

        // 4.创建audio播放器组件
        // const innerAudioContext = wx.createInnerAudioContext()
        // innerAudioContext.autoplay = true
        // innerAudioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        // innerAudioContext.pause()
        // innerAudioContext.onPlay(() => {
        //     console.log('开始播放')
        // })
        // innerAudioContext.onError((res) => {
        //     console.log(res.errMsg)
        //     console.log(res.errCode)
        // })

        // this.setData({
        //     audioContext: innerAudioContext
        // })
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
    // 页面数据请求
    getPageData(id) {
        // 获取歌曲详情
        getSongDetail(id).then(res => {
            console.log("songdetail", res);
            this.setData({
                currentSong: res.songs[0]
            })
        })

        // 获取歌词信息
        getSongLyric(id).then(res => {
            console.log("lyric", res);
        })

        // 获取播放地址
        getSongUrl(id).then(res => {
            console.log(res);
        })
    },

    // 事件处理
    handleAudioPlayOrPause() {
        const play = this.data.play
        if (play) {
            this.data.audioContext.pause()

        } else {
            this.data.audioContext.play()
        }
        this.setData({
            play: !play
        })
    },
    handleSwiperChange(event) {
        const currentPage = event.detail.current
        this.setData({
            currentPage
        })
    }
})