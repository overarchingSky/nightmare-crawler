// const { ipcRenderer, remote } = require('electron')
// const { ipcRenderer, remote } = window.electron

//import _ from 'lodash'
const _ = require('lodash')
class EventBus {
    wins = {}
    constructor() {

        }
        /**
         * 添加一个窗口到本类中集中管理
         */
    add(name, win) {
        this.wins[name] = win
    }
    off(eventName, winName) {
        let realWin = this.wins[winName]
        delete realWin.event[eventName]
    }
    once(eventName, winName, handle) {
            function wrapHandle(...data) {
                handle(...data)
                this.off(eventName, winName, wrapHandle)
            }
            this.on(eventName, winName, wrapHandle)
        }
        /**
         * 给指定的窗口绑定事件，如果winName为空，则尝试给当前窗口绑定事件
         */
    on(eventName, winName, handle) {
            let realWin
            if (_.isUndefined(handle)) {
                realWin = window.electron.remote.getCurrentWindow()
                handle = winName
            } else {
                realWin = this.wins[winName]
                console.log('realWin', realWin, eventName)
            }
            console.log('??????')
            realWin.$listeners = {
                ...realWin.$listeners,
                [eventName]: handle
            }
        }
        /**
         * 触发一个指定窗口的指定事件
         */
    dispatch(eventName, winName, ...data) {
        console.log('dispatch')
        let realData, realWinName
        if (_.isUndefined(data)) {
            realData = winName
        } else {
            realWinName = winName
            realData = data
        }
        if (!realWinName) {
            //如果没有指定触发的窗口，则在所有窗口触发
            Object.keys(this.wins).forEach(key => {
                const win = this.wins[key]
                const handle = win.$listeners[eventName]
                handle && handle(...data)
            })
            return
        }
        // console.log('realWinName', realWinName)
        const win = this.wins[realWinName]
        if (win) {
            const handle = win.$listeners[eventName]
            handle && handle(...data)
        } else {
            console.warn(`事件${eventName}触发失败：指定的窗口不存在`)
        }
    }
}

const Event = new EventBus()
module.exports = Event