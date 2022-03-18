// pages/music-player/index.js
// import {
//     getSongDetail,
//     getSongLyric
// } from "../../service/api_player"
import {
    audioContext,
    playerStore
} from "../../store/index"
// import {
//     parseLyric
// } from "../../utils/parse-lyric"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        currentSong: {},
        lyricInfos: [], //歌词信息
        contentHeight: 0,

        durationTime: 0,
        currentTime: 0,
        currentLyricIndex: 0,
        currentLyricText: "",

        isPlaying: true,
        playModeIndex: 0, //0：循环播放 1：单曲循环 2：随机播放
        isSliderChanging: false,
        lyricScrollTop: 0,
        sliderValue: 0, //音乐进度滑块的值，与currentTime相等，但是不建议使用同一个

        currentPage: 0,

        showPlayList: false,
        // 静态文件
        playMusicImg: require("../../assets/images/player/play_music"),
        playNextImg: require("../../assets/images/player/play_next"),
        playPauseImg: require("../../assets/images/player/play_pause"),
        playResumeImg: require("../../assets/images/player/play_resume"),
        playPrevImg: require("../../assets/images/player/play_prev"),
        playModeOrder: require("../../assets/images/player/play_order"),
        playModeRandom: require("../../assets/images/player/play_random"),
        playModeRepeat: require("../../assets/images/player/play_repeat"),
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 1.获取传入的歌曲id
        const id = options.id
        this.setData({
            id
        })

        // 2.获取页面数据
        // this.getPageData(id)
        // playerStore.dispatch("playMusicWithSongIdAction", {
        //     id
        // })
        this.setupPlayerStoreListener()

        // 3.动态计算内容高度
        const globalData = getApp().globalData
        const screenHeight = globalData.screenHeight
        const statusBarHeight = globalData.statusBarHeight
        const navBarHeight = globalData.navBarHeight
        const contentHeight = screenHeight - statusBarHeight - navBarHeight

        this.setData({
            contentHeight
        })

        // 4.audio监听
        // this.setupAudioContextListener(id)
    },
    // ==========================页面数据请求=============================
    // getPageData(id) {
    //     // 获取歌曲详情
    //     getSongDetail(id).then(res => {
    //         this.setData({
    //             currentSong: res.songs[0],
    //             durationTime: res.songs[0].dt
    //         })
    //     })

    //     // 获取歌词信息
    //     getSongLyric(id).then(res => {
    //         const lyricString = res.lrc.lyric
    //         const lyricInfos = parseLyric(lyricString)
    //         this.setData({
    //             lyricInfos
    //         })
    //     })
    // },
    setupPlayerStoreListener() {
        // 1.监听currentSong/durationTime/lyricInfos
        playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], ({
            currentSong,
            durationTime,
            lyricInfos
        }) => {
            if (currentSong) this.setData({
                currentSong
            })
            if (durationTime) this.setData({
                durationTime
            })
            if (lyricInfos) this.setData({
                lyricInfos
            })
        })
        // 2.监听currentTime/currentLyricIndex/currentLyricText
        playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], ({
            currentTime,
            currentLyricIndex,
            currentLyricText,
        }) => {
            // 时间变化
            if (currentTime !== undefined && !this.data.isSliderChanging) {
                this.setData({
                    currentTime,
                    sliderValue: currentTime
                })
            }
            // 歌词变化
            if (currentLyricIndex !== undefined) {
                this.setData({
                    currentLyricIndex,
                    lyricScrollTop: currentLyricIndex * 35
                })
            }
            if (currentLyricText !== undefined) {
                this.setData({
                    currentLyricText
                })
            }
        })
        // 3.监听playing/playModeIndex
        playerStore.onStates(["isPlaying", "playModeIndex"], ({
            isPlaying,
            playModeIndex
        }) => {
            if (typeof isPlaying === "boolean") {
                this.setData({
                    isPlaying
                })
            }
            if (typeof playModeIndex === "number") {
                this.setData({
                    playModeIndex
                })
            }
        })
    },
    // ==========================audio监听=============================

    // setupAudioContextListener(id) {
    // 使用audioContext播放器组件
    // audioContext.stop()
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // audioContext.autoplay = true
    // audioContext.onCanplay(() => {
    //     // 如果点击了暂停，则不会由于拖动进度条从新开始播放
    //     if (!this.data.isPlaying) return
    //     audioContext.play()
    // })
    // audioContext.onTimeUpdate(() => {
    //     // 1.获取当前时间
    //     const currentTime = audioContext.currentTime * 1000
    //     // 2.根据当前时间修改current Timee
    //     // 如果正在滑动滑块就不在此修改当前时间
    //     if (!this.data.isSliderChanging) {
    //         this.setData({
    //             currentTime
    //         })
    //     }
    //     // 3.根据当前时间去查找播放的歌词
    //     let i = 0
    //     const lyricInfos = this.data.lyricInfos
    //     for (; i < lyricInfos.length; i++) {
    //         const lyricInfo = lyricInfos[i]
    //         if (lyricInfo.time > currentTime) {
    //             break
    //         }
    //     }
    //     // 设置当前歌词的索引和内容
    //     const currentLyricIndex = i - 1
    //     if (this.data.currentLyricIndex !== i - 1) {
    //         this.setData({
    //             currentLyricText: lyricInfos[i - 1].text,
    //             currentLyricIndex,
    //             lyricScrollTop: currentLyricIndex * 35
    //         })
    //     }
    // })
    // },
    // ==========================事件处理==========================
    handleLeftClick() {
        wx.navigateBack()
    },
    handleAudioPlayOrPause() {
        playerStore.dispatch("operationPlayAction", !this.data.isPlaying)
    },
    handleSwiperChange(event) {
        const currentPage = event.detail.current
        this.setData({
            currentPage
        })
    },
    handleSliderChange(event) {
        // 1.获取slider变化的值得到当前播放时间currentTime
        const sliderValue = event.detail.value
        // 2.设置context播放currentTime位置的音乐
        // audioContext.pause()
        audioContext.seek(sliderValue / 1000)
        // 3.设置时间,确定滑块此时没有滑动
        this.setData({
            // currentTime,
            isSliderChanging: false
        })
    },
    handleSliderChanging(event) {
        // const currentTime = event.detail.value
        this.setData({
            isSliderChanging: true,
            // currentTime
        })
    },
    handleModeClick() {
        // 计算出最新的playModeIndex
        let playModeIndex = this.data.playModeIndex + 1
        if (playModeIndex === 3) playModeIndex = 0

        // 设置最新的playModeIndex
        playerStore.dispatch("operationModeAction", {
            playModeIndex
        })
    },
    // 点击上一首
    handlePrevBtnClick() {
        playerStore.dispatch("changeNewMusicAction", false)
    },
    // 点击下一首
    handleNextBtnClick() {
        playerStore.dispatch("changeNewMusicAction")
    },
    handlePlayListBtnClick() {
        this.setData({
            showPlayList: !this.data.showPlayList
        })
    },
    closeBtnClick() {
        this.setData({
            showPlayList: false
        })
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.setData({
            showPlayList: false
        })
    },
})