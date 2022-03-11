export default function (el) {
    return new Promise((resolve, reject) => {
        const query = wx.createSelectorQuery()
        query.select(el).boundingClientRect()
        // query.exec(resolve)
        query.exec((res) => {
            resolve(res)
        })
    })
}