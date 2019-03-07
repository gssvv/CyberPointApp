import Cookies from 'js-cookie'
import cookieparser from 'cookieparser'
import _ from 'lodash'

export const state = () => ({
  currentUser: {},
  fullTournament: {},
  games: [],
  gameChosen: 'dota'
})

export const getters = {
  getCurrentGameInfo(state) {
    const { gameChosen, games } = state
    return games.find(i => i.link == gameChosen)
  },
  getOtherGames(state) {
    const { gameChosen, games } = state
    return games.filter(val => {
      return val.link !== gameChosen
    })
  },
  gameExists: state => id => {
    return !!state.games.find(i => i.link == id)
  },
  getGameLink: state => game => {
    return state.games.find(i => i.title == game).link
  }
}

export const mutations = {
  SET_GAME(state, game) {
    if (!!state.games.find(i => i.link == game)) state.gameChosen = game
    return false
  },
  SET_FULL_TOURNAMENT(state, tournament) {
    state.fullTournament = tournament
  },
  SET_USER(state, user) {
    state.currentUser = user
  },
  UNSET_USER(state) {
    state.currentUser = { privilege: null }
  },
  SET_GAMES_LIST(state, list) {
    state.games = list
  },
  CLEAR_TOUNRNAMENT(state) {
    return (state.fullTournament = {})
  },
  CLEAR_DATE(state) {
    return (state.fullTournament.date = null)
  }
}

export const actions = {
  async nuxtServerInit({ commit, dispatch, state }, { req }) {
    await this.$axios
      .get('/api/games/')
      .then(res => commit('SET_GAMES_LIST', res.data))
      .catch(err => console.log(err))

    if (req.headers.cookie) {
      const cookie = cookieparser.parse(req.headers.cookie)

      if (cookie.game_choosen) commit('SET_GAME', cookie.game_choosen)

      if (cookie.auth_token) {
        dispatch('checkUser', cookie.auth_token)
      }
    }
  },
  setGame({ commit }, game) {
    commit('SET_GAME', game)
    Cookies.set('game_choosen', game)
  },
  async checkUser(context, token) {
    let { data: answer } =
      (await this.$axios
        .get('/api/users/me')
        .catch(err => console.log(err.response.data))) || {}

    if (!answer) return false

    context.commit('SET_USER', answer)
    return answer
  },
  async getOrganisatorLink(context, organisator) {
    // let {answer} = await this.$axios.get('/api/organisator', { organisator })
    // HARDCODED
    let answer = await {}
    answer.link = await 'https://epulze.com'

    return answer
  },
  async setFullTournament({ commit, state }, id) {
    const { data: fullTournament } =
      (await this.$axios
        .get(`/api/tourneys/${id}`)
        .catch(err => console.log(err))) || []

    if (!fullTournament) return

    commit('SET_FULL_TOURNAMENT', fullTournament)

    return true
  },
  async signIn({ commit }, data) {
    let answer = await this.$axios
      .post('/api/users/auth', data)
      .catch(err => console.log(err.response.data))

    if (!answer) return false

    return true
  },
  signOut({ commit }) {
    Cookies.remove('auth_token')
    commit('UNSET_USER')
  }
}
