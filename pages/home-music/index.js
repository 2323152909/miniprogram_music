// pages/home-music/index.js
import {
    rankingStore,
    rankingMap
} from "../../store/index"

import {
    getBanners,
    getSongMenu
} from "../../service/api_music"
import queryRect from "../../utils/query-rect"
import throttle from "../../utils/throttle"
const throttleQueryRect = throttle(queryRect, 1000)


Page({
    /**
     * 页面的初始数据
     */
    data: {
        banners: [], //轮播图数据
        swiperHeight: 0,
        recommendSongs: [], //推荐歌曲
        hotSongMenu: [], //热门歌单
        recommendSongMenu: [], //推荐歌单
        rankings: []
    },
    onLoad: function (options) {
        // 获取页面数据
        this.getPageData()

        // 发起共享数据的请求
        rankingStore.dispatch("getRankingDataAction")
        rankingStore.onState("hotRanking", (res) => {
            const tracks = res?.tracks
            if (!tracks) return
            const recommendSongs = tracks.slice(0, 6)
            this.setData({
                recommendSongs
            })
        })
        rankingStore.onState("newRanking", this.getNewRankingHandler)
        rankingStore.onState("originRanking", this.getNewRankingHandler)
        rankingStore.onState("upRanking", this.getNewRankingHandler)
    },
    // 网络请求
    getPageData() {
        // 1.获取轮播图数据
        getBanners().then(res => {
            // setData是同步的还是异步的
            // setData在设置data数据上，是同步的
            // 通过最新的数据对wxml进行渲染，渲染的过程是异步的
            this.setData({
                banners: res.banners
            })

            // react -> setState是异步的
        })

        // 2.获取热门歌单
        getSongMenu().then(res => {
            this.setData({
                hotSongMenu: res.playlists
            })
        })

        // 3.获取推荐歌单
        getSongMenu("华语").then(res => {
            this.setData({
                recommendSongMenu: res.playlists
            })
        })
    },
    handleSearchClick() {
        wx.navigateTo({
            url: '/pages/detail-search/index',
        })
    },
    //监听图片加载完成
    handleSwiperImageLoaded() {
        // 获取图片的高度(如果去获取某一个组建的高度)
        throttleQueryRect(".swiper-image").then(res => {
            const rect = res[0]
            this.setData({
                swiperHeight: rect.height
            })
        })
    },
    onUnload() {
        // rankingStore.offState("newRanking", this.getNewRankingHandler)
    },
    getNewRankingHandler(res) {
        if (Object.keys(res).length === 0) return
        const id = res.id
        const name = res.name
        const coverImgUrl = res.coverImgUrl
        const songList = res.tracks.slice(0, 3)
        const playCount = res.playCount
        const rankingObj = {
            id,
            playCount,
            name,
            coverImgUrl,
            songList
        }
        const originRankings = [...this.data.rankings]
        originRankings.push(rankingObj)
        this.setData({
            rankings: originRankings
        })
    },
    // 子组件点击个更多的自定义事件传递监听
    handleRightClick() {
        this.navigateToDetailSongsPage("hotRanking")
    },
    handleRankingItemClick(event) {
        const rankingId = event.currentTarget.dataset.id
        const rankingName = rankingMap[rankingId]
        this.navigateToDetailSongsPage(rankingName)
    },
    navigateToDetailSongsPage(rankingName) {
        wx.navigateTo({
            url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
        })
    }
})