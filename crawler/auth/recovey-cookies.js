/**
 * 恢复cookies到指定的窗口上
 * @param {*} browserWindow 浏览器窗口
 * @param {*} cookies 
 */
module.exports = function(browserWindow, cookies = []) {
    let recoverTimes = cookies.length;
    cookies.forEach((cookiesItem) => {
        let {
            secure = false,
                domain = '',
                path = ''
        } = cookiesItem

        browserWindow.webContents.session.cookies
            .set(
                Object.assign(cookiesItem, {
                    url: (secure ? 'https://' : 'http://') + domain.replace(/^\./, '') + path
                })
            )
            .then(() => {})
            .catch((e) => {
                console.error({
                    message: 'recovery cookie fail',
                    cookie: cookiesItem,
                    errorMessage: e.message,
                })
            })
            .finally(() => {
                recoverTimes--;
                if (recoverTimes <= 0) {
                    console.log('end cookies recovery')
                }
            })
    });
}