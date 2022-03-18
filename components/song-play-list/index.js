// components/song-list/index.js
import {
    playerStore
} from "../../store/play.store"

Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        closeIcon: require("../../assets/images/icons/close_icon"),
        playListIndex: 0,
        playListSongs: []
    },
    lifetimes: {
        ready() {

            // 4.监听playListSongs/playListIndex
            playerStore.onStates(["playListSongs", "playListIndex"], ({
                playListSongs,
                playListIndex
            }) => {
                console.log(playListSongs,
                    playListIndex);
                if (playListSongs !== undefined) {
                    this.setData({
                        playListSongs
                    })
                }
                if (playListIndex !== undefined) {
                    this.setData({
                        playListIndex
                    })
                }
            })
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleCloseBtnClick() {
            this.triggerEvent("closeBtnClick")
        },
        handlePlayItemClick(event) {
            const id = event.currentTarget.dataset.item.id
            const index = event.currentTarget.dataset.index
            playerStore.dispatch("playMusicWithSongIdAction", {
                id
            })
            playerStore.setState("playListIndex", index)
        }
    }
})