import {
    HYEventStore
} from "hy-event-store"
import {
    getRankings,
    getSongMenu,
    getSongHotMenu,
    getgetSongMenuDetail,
    getPlaylistDetail,
    getPersonalized,
    getToplist
} from "../service/api_music"

const rankingMap = {
    3778678: "hotRanking", //热门榜
    2884035: "newRanking", //新歌榜
    3779629: "originRanking", //原创榜
    19723756: "upRanking" //飙升榜
}

const rankingStore = new HYEventStore({
    state: {
        hotRanking: {}, //热门榜
        newRanking: {}, //新歌榜
        originRanking: {}, //原创榜
        upRanking: {}, //飙升榜
    },
    actions: {
        // 获取推荐歌单
        getRankingDataAction(state, payload) {
            // 由于无法获取到热门歌单音乐，所以直接获取5001对应的话语歌单
            // 3778678:热门榜； 2884035：原创榜； 3779629：新歌榜；19723756：飙升榜
            [3778678, 2884035, 3779629, 19723756].forEach(key => {
                getPlaylistDetail(key).then(res => {
                    // console.log(res);
                    const rankingName = rankingMap[key]
                    state[rankingName] = res.playlist
                    // console.log(state[rankingName]);
                    //     switch (key) {
                    //         case 3778678: //热门榜
                    //             console.log("热门榜", res);
                    //             state.hotRanking = res.songs
                    //             break;
                    //         case 2884035: //原创榜
                    //             console.log("原创榜", res);
                    //             state.originRanking = res.songs
                    //             break;
                    //         case 3779629: //新歌榜
                    //             console.log("新歌榜", res);
                    //             state.newRanking = res.songs
                    //             break;
                    //         case 19723756: //飙升榜
                    //             console.log("飙升榜", res);
                    //             state.upRanking = res.songs
                    //             break;
                    //     }
                })
            })
            // 获取所有榜单，以此查看热歌榜
            // getToplist().then(res => {
            //     console.log(res);
            //     // state.hotRanking = res.result
            // })
            // 获取推荐的歌单
            // getPersonalized().then(res => {
            //     console.log(res);
            //     // state.hotRanking = res.result
            // })
        }
    }
})

export {
    rankingStore
}