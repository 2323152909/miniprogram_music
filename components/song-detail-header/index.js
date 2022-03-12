// components/song-detail-header/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        songInfo: {
            type: Object,
            value: {}
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        favorImg: require("../../assets/images/icons/favor_icon.js"),
        shareImg: require("../../assets/images/icons/share_icon.js")
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})