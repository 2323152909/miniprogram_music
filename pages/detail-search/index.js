// pages/detail-search/index.js
import {
    getSearchHot,
    getSearchSuggest,
    getSearchData
} from "../../service/api_search"
import debounce from "../../utils/debounce"

// 对函数进行防抖处理
const debounceSearchSuggest = debounce(getSearchSuggest)

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hotKeywords: [],
        suggestSongs: [],
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
            return this.setData({
                flag: false,
                suggestSongs: []
            })
        }
        this.setData({
            flag: true
        })
        // 请求搜索建议
        debounceSearchSuggest(keywords).then(res => {
            if (Object.keys(res.result).length === 0) {
                return this.setData({
                    suggestSongs: []
                })
            }
            this.setData({
                suggestSongs: res.result.allMatch
            })
        })
    }
})