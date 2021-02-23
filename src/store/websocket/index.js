// import { LocalStorage } from 'quasar'

const state = {
    notificationSocket: null,
}

const mutations = {
    createNotificationSocket(state, socket) {

        state.notificationSocket = socket

        state.notificationSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(data)
        };

        state.notificationSocket.onclose = (e) => {
            console.error('Chat socket closed unexpectedly');
        };
    }
}

const actions = {
    createWebSocket({commit}) {

        console.log("Create webscoket")

        const notificationSocket = new WebSocket(
            'ws://localhost:8000/ws/notification/'
        )

        console.log(notificationSocket)

        commit('createNotificationSocket', notificationSocket)

    }
}

const getters = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
