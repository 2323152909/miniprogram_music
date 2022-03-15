import {
    HYEventStore
} from "hy-event-store"
import {
    getSongDetail,
    getSongLyric
} from "../service/api_player"
import {
    parseLyric
} from "../utils/parse-lyric"

const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
    state: {
        id: 0,

        currentSong: {}, //当前歌曲
        durationTime: 0, //总时长
        lyricInfos: [], //歌词信息

        currentTime: 0, //当前播放时间
        currentLyricIndex: 0, //当前歌词索引
        currentLyricText: "", //当前歌词

        isPlaying: true, //是否正在播放
        playModeIndex: 0, //0：循环播放 1：单曲循环 2：随机播放
    },
    actions: {
        playMusicWithSongIdAction(ctx, {
            id
        }) {
            // 如果两次id相同，不会重新请求
            if (ctx.id === id) return
            ctx.id = id

            // 1.根据id请求数据
            // 获取歌曲详情
            getSongDetail(id).then(res => {
                ctx.currentSong = res.songs[0]
                ctx.durationTime = res.songs[0].dt
            })
            // 获取歌词信息
            getSongLyric(id).then(res => {
                const lyricString = res.lrc.lyric
                const lyricInfos = parseLyric(lyricString)
                ctx.lyricInfos = lyricInfos
            })

            // 2.播放对应id的歌曲
            audioContext.stop()
            audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
            audioContext.autoplay = true

            // 3.监听audioContext一些事件
            this.dispatch("setupAudioContextListenerAction")
        },
        setupAudioContextListenerAction(ctx) {
            // 1.监听歌曲可以播放
            audioContext.onCanplay(() => {
                // 如果点击了暂停，则不会由于拖动进度条从新开始播放
                if (!ctx.isPlaying) return
                audioContext.play()
            })
            // 2.监听时间的改变
            audioContext.onTimeUpdate(() => {
                // 1.获取当前时间
                const currentTime = audioContext.currentTime * 1000
                // 2.根据当前时间修改currentTime
                ctx.currentTime = currentTime
                // 3.根据当前时间去查找播放的歌词
                let i = 0
                const lyricInfos = ctx.lyricInfos
                for (; i < lyricInfos.length; i++) {
                    const lyricInfo = lyricInfos[i]
                    if (lyricInfo.time > currentTime) {
                        break
                    }
                }
                // 设置当前歌词的索引和内容
                const currentLyricIndex = i - 1
                if (ctx.currentLyricIndex !== i - 1) {
                    ctx.currentLyricText = lyricInfos[i - 1].text
                    ctx.currentLyricIndex = currentLyricIndex
                }
            })
        },
        // 切换播放状态
        operationPlayAction(ctx) {
            // 如果正在播放则进行暂停，否则就播放
            ctx.isPlaying ? audioContext.pause() : audioContext.play()
            ctx.isPlaying = !ctx.isPlaying
        },
        // 切换模式
        operationModeAction(ctx, {
            playModeIndex
        }) {
            ctx.playModeIndex = playModeIndex
        },
    }
})

export {
    audioContext,
    playerStore
}