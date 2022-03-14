// pages/detail-search/index.js
import {
    getSearchHot,
    getSearchSuggest,
    getSearchData
} from "../../service/api_search"
import debounce from "../../utils/debounce"
import stringToNodes from "../../utils/string2nodes"
// 对函数进行防抖处理
const debounceSearchSuggest = debounce(getSearchSuggest)

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hotKeywords: [],
        suggestSongs: [],
        suggestSongsNodes: [],
        songsData: [],
        keywords: "",
        flag: false,
        searchIcon: require("../../assets/images/icons/search_icon")
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 1.获取页面数据
        this.getPageData()
    },
    // 网络请求
    getPageData() {
        getSearchHot().then(res => {
            this.setData({
                hotKeywords: res.result.hots
            })
        })
    },
    // 事件处理
    handleSearchChange(event) {
        // 1.获取关键字
        const keywords = event.detail
        // 保存关键字
        this.setData({
            keywords
        })
        // 3.判断关键字为空字符的处理逻辑
        if (!keywords.length) {
            debounceSearchSuggest.cancel()
            return this.setData({
                flag: false,
                suggestSongs: [],
                suggestSongsNodes: [],
                songsData: []
            })
        }
        this.setData({
            flag: true
        })
        // 请求搜索建议
        debounceSearchSuggest(keywords).then(res => {
            // 1.如果未查询到搜索建议直接返回空数组
            if (Object.keys(res.result).length === 0) {
                return this.setData({
                    suggestSongs: [],
                    suggestSongsNodes: [],
                })
            }
            // 2.获取到建议的关键字歌曲
            const suggestSongs = res.result.allMatch
            this.setData({
                suggestSongs
            })

            // 3.转成nodes节点
            const suggestKeywords = suggestSongs.map(item => item.keyword)
            const suggestSongsNodes = []
            for (const keyword of suggestKeywords) {
                const nodes = stringToNodes(keyword, keywords)

                suggestSongsNodes.push(nodes)
                this.setData({
                    suggestSongsNodes
                })
            }
        })
    },
    handleSearchAction() {
        const keywords = this.data.keywords
        getSearchData(keywords).then(res => {
            this.setData({
                songsData: res.result.songs,
                flag: false
            })
        })
    },
    handleKeywordItemClick(event) {
        // 1.点击获取到关键字
        const keyword = event.currentTarget.dataset.item
        // 2.设置关键字
        this.setData({
            keywords: keyword
        })

        // 3.发送网络请求
        this.handleSearchAction()
    },
})