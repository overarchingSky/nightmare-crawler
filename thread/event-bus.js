//const { ipcRenderer, remote } = require('electron')
const { ipcRenderer, remote } = window.electron

import _ from 'lodash'

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
            function wrapHandle() {
                handle()
                this.off(eventName, winName, wrapHandle)
            }
            this.on(eventName, winName, wrapHandle)
        }
        /**
         * 给指定的窗口绑定事件，如果winName为空，则尝试给当前窗口绑定事件
         */
    on(eventName, winName, handle) {
            let realHandle, realWin
            if (_.isUnfined(handle)) {
                realWin = remote.getCurrentWindow()
                handle = winName
            } else {
                realWin = this.wins[winName]
            }
            realWin.$listeners = {
                ...realWin.$listeners,
                [eventName]: handle
            }
        }
        /**
         * 触发一个指定窗口的指定事件
         */
    dispatch(eventName, winName, ...data) {
        let realData, realWinName
        if (_.isUnfined(data)) {
            realData = winName
        } else {
            realWinName = winName
            realData = data
        }
        if (realWinName) {
            const win = this.win[realWinName]
            if (win) {
                const handle = win.$listeners[eventName]
                return new Promise((resolve, reject) => {
                    handle && handle(...data, resolve)
                })
            } else {
                console.warn(`事件${eventName}触发失败：指定的窗口不存在`)
            }
        } else {
            console.error('触发事件失败：必须指定一个窗口名称')
        }
        return Promise.reject()
    }
}

export const Event = new EventBus()