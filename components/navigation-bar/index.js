// components/navigation-bar/index.js
const globalData = getApp().globalData
Component({
    // 如果有多个插槽，必须设置这个属性
    options: {
        multipleSlots: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        title: {
            type: String,
            value: "我是标题"
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        statusBarHeight: globalData.statusBarHeight,
        navBarHeight: globalData.navBarHeight,
        arrowLeftImg: require("../../assets/images/icons/arrow-left")
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleLeftClick() {
            this.triggerEvent("handleLeftClick")
        }
    }
})