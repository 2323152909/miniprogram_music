// 使用正则表达式匹配字符串
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
const lyricRegExp = /^\]+/

export function parseLyric(lyricString) {
    const lyricArr = lyricString.split("\n")
    const lyric = lyricArr.map(item => {
        const timeResult = item.match(timeRegExp)
        if (!timeResult) return item
        // 1.获取时间
        const minute = timeResult[1] * 60 * 1000
        const second = timeResult[2] * 1000
        const millsecond = timeResult[3].padEnd(3, 0) * 1
        const time = minute + second + millsecond

        // 2.获取歌词文本
        const text = item.replace(timeRegExp, "").trim()
        // const lyric = "".trim().call(items[1])

        const lyricInfo = {
            time,
            text
        }
        return lyricInfo
    })
    return lyric
}