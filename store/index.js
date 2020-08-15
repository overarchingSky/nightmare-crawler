const event = require('../thread/event-bus')
global.store = {
    event,
    cookie: '',
    authenticity_token: ''
}