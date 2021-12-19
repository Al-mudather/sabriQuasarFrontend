import axios from 'axios'
import $ from 'jquery'
import { Notify, LocalStorage, SessionStorage } from 'quasar'
import {apolloClient} from 'src/apollo/client'
import {tokenStorage, userProfileStorage} from "src/localStorageService";
import {RefreshLoginUserWithEmail} from 'src/queries/account_management/mutation/RefreshUserToken'

const state = {
  navbarSearch: true,
  user: userProfileStorage.getUser() || {},
  token: tokenStorage.getAccessToken() || null,
  refreshToken: tokenStorage.getRefreshToken() || null
}

const mutations = {
  UPDATE_USER_DATA_AFTER_JOIN_THE_PYRAMID_PROGRAM (state, data) {
    state.user = data
    userProfileStorage.setUser(data)
  },
  updateUser (state, user) {
    // Set the user
    userProfileStorage.setUser(user)
    state.user = user
  },
  updateToken (state, token) {
    state.token = token
  },
  updateRefreshToken (state, refreshToken) {
    state.refreshToken = refreshToken
  },
  deleteData (state) {
    state.user = null
    state.token = null
    state.refreshToken = null
  },
  updateNavebarSearcgDialog (state, value) {
    state.navbarSearch = value
  }
}

const actions = {

  SET_THE_USER_DATA_AFTER_JOIN_THE_PYRAMID_PROGRAME_ACTION ({ commit }, data) {
    commit('UPDATE_USER_DATA_AFTER_JOIN_THE_PYRAMID_PROGRAM', data)
  },

  setNavbarSearchAction ({ commit }, value) {
    commit('updateNavebarSearcgDialog', value)
  },

  setPasswordResetDialogAction ({ commit }, value) {
    commit('updatePasswordResetDialog', value)
  },

  SET_USER_DATA_ACTION ({ commit }, value) {
    commit('updateUser', value)
  },

  loginAction ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      let user = ''
      if (payload.user) {
        user = payload.user
      } else {
        user = payload.social ? payload.social.user: ''
      }
      const token = payload.token
      const refresh =  payload.refreshToken || ''
      const tokenObj = {
        token,
        refresh
      }
      // Set the token and the refreshToken authentication
      tokenStorage.setToken(tokenObj)
      // commit the change to the store
      commit('updateUser', user)
      // update the token
      commit('updateToken', token)
      // update the token
      commit('updateRefreshToken', refresh)

      resolve()
    })
  },

  RE_LOGIN_USER({context}, payload) {
    if (tokenStorage.getRefreshToken()) {
      return apolloClient.mutate({
        mutation: RefreshLoginUserWithEmail, 
        variables: {
          refreshToken: tokenStorage.getRefreshToken(),
        },
      }).then((data) => {
        // Result
        if (data.data.refreshToken.success) {
          tokenStorage.setToken({
            token: data.data.refreshToken.token,
            refresh: data.data.refreshToken.refreshToken
          })
          return true
  
        } else {
          return false
        }
      }).catch(e => {
      })
      
    } else {
      return true
    }

  },
 
  logOutAction ({ commit }, payload) {

    return new Promise((resolve, reject) => {
      axios
      // .get(`http://localhost:8000/api/drf/logout/`)
      .get(`${location.origin}/api/drf/logout/`)
      .then(res => {
        // Todo clear everything from window.LocalStorage
        tokenStorage.clearToken()
        //TODO: Cleare the cart
        SessionStorage.set('shoppingCartList', [])
        commit('deleteData')
        //TODO: If the user logedin using facebook, log him out
        $(document).ready( () => {
          $.ajaxSetup({ cache: true });
          $.getScript('https://connect.facebook.net/en_US/sdk.js', () => {
              FB.init({
                  appId: '757236575189030',
                  version: 'v2.7',
                  cookie     : true,                     // Enable cookies to allow the server to access the session.
                  xfbml      : true,
              }); 

              FB.logout( (out) => {
              } )
          });
        });
        //TODO: Notify the user
        Notify.create({
          type: 'positive',
          progress: true,
          multiLine: true,
          position: 'top',
          message: 'Logged Out Successfully'
        })
        resolve()
      })
    })
  }
}

const getters = {
  user: state => state.user,
  token: state => state.token,
  navbarSearch: state => state.navbarSearch
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
