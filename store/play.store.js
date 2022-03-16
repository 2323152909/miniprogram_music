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

const audioContext = wx.getBackgroundAudioManager()
// const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
    state: {
        isFirstPlay: true,
        isStoping: false,

        id: 0,

        currentSong: {}, //当前歌曲
        durationTime: 0, //总时长
        lyricInfos: [], //歌词信息

        currentTime: 0, //当前播放时间
        currentLyricIndex: 0, //当前歌词索引
        currentLyricText: "", //当前歌词

        isPlaying: false, //是否正在播放
        playModeIndex: 0, //0：循环播放 1：单曲循环 2：随机播放
        playListSongs: [], //歌曲列表
        playListIndex: 0 //当前歌曲索引
    },
    actions: {
        playMusicWithSongIdAction(ctx, {
            id,
            isRefresh = false
        }) {
            // 如果两次id相同并且不需要强制刷新，不会重新请求
            if (ctx.id === id && !isRefresh) {
                this.dispatch("operationPlayAction", true)
                return
            }
            ctx.id = id

            // 0.切换歌曲修改播放的状态为初始
            ctx.isPlaying = true
            ctx.currentSong = {}
            ctx.durationTime = 0
            ctx.lyricInfos = []
            ctx.currentTime = 0
            ctx.currentLyricIndex = 0
            ctx.currentLyricText = ""

            // 1.根据id请求数据
            // 获取歌曲详情
            getSongDetail(id).then(res => {
                ctx.currentSong = res.songs[0]
                ctx.durationTime = res.songs[0].dt
                audioContext.title = res.songs[0].name
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
            audioContext.title = id

            // 3.监听audioContext一些事件
            if (ctx.isFirstPlay) {
                this.dispatch("setupAudioContextListenerAction")
                ctx.isFirstPlay = false
            }
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
                    ctx.currentLyricText = lyricInfos[i - 1]?.text
                    ctx.currentLyricIndex = currentLyricIndex
                }
            })
            // 3.监听歌曲播放完成
            audioContext.onEnded(() => {
                this.dispatch("changeNewMusicAction")
            })

            // 4.监听音乐暂停/播放
            // 播放状态
            audioContext.onPlay(() => {
                ctx.isPlaying = true
            })
            // 暂停状态
            audioContext.onPause(() => {
                ctx.isPlaying = false
            })

            // 5.监听音乐停止播放
            audioContext.onStop(() => {
                ctx.isStoping = true
                ctx.isPlaying = false
            })
        },
        // 切换播放状态
        operationPlayAction(ctx, isPlaying = true) {
            ctx.isPlaying = isPlaying
            if (ctx.isPlaying && ctx.isStoping) {
                audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
                audioContext.title = ctx.currentSong.name
                ctx.isStoping = false
            }
            // 如果正在播放则进行暂停，否则就播放
            ctx.isPlaying ? audioContext.play() : audioContext.pause()
        },
        // 切换模式
        operationModeAction(ctx, {
            playModeIndex
        }) {
            ctx.playModeIndex = playModeIndex
        },
        changeNewMusicAction(ctx, isNext = true) {
            // 1.获取当前索引
            let index = ctx.playListIndex
            // 2.根据不同的播放模式，获取下一首个的索引
            switch (ctx.playModeIndex) {
                case 0: //顺序
                    index = isNext ? index + 1 : index - 1
                    if (index < 0) index = ctx.playListSongs.length - 1
                    if (index === ctx.playListSongs.length) index = 0
                    break;
                case 1: //单曲
                    break;
                case 2: //随机播放
                    index = Math.floor(Math.random() * ctx.playListSongs.length)
                    break;
            }

            // 3.获取歌曲
            let currentSong = ctx.playListSongs[index]
            if (!currentSong) {
                currentSong = ctx.currentSong
            } else {
                // 记录当前索引
                ctx.playListIndex = index
            }

            // 4.播放新的歌曲
            this.dispatch("playMusicWithSongIdAction", {
                id: currentSong.id,
                isRefresh: true
            })
        },
    }
})

export {
    audioContext,
    playerStore
}