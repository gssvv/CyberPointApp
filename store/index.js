export const state = () => ({
  fullTournament: {},
  gameChoosen: 'dota',
  games: [{
      title: 'Dota 2',
      link: 'dota',
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi laboriosam aspernatur quidem eveniet, itaque deserunt modi. Vel dolorum vitae distinctio.'
    },
    {
      title: 'CS:GO',
      link: 'csgo',
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi laboriosam aspernatur quidem eveniet, itaque deserunt modi. Vel dolorum vitae distinctio.'
    },
    {
      title: 'PUBG',
      link: 'pubg',
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi laboriosam aspernatur quidem eveniet, itaque deserunt modi. Vel dolorum vitae distinctio.'
    },
    {
      title: 'Hearthstone',
      link: 'hs',
      shortTitle: 'HS',
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi laboriosam aspernatur quidem eveniet, itaque deserunt modi. Vel dolorum vitae distinctio.'
    },
  ]
})

export const getters = {
  getCurrentGameInfo(state) {
    const {
      gameChoosen,
      games
    } = state
    return games.find((i) => i.link == gameChoosen)
  },
  getOtherGames(state) {
    const {
      gameChoosen,
      games
    } = state
    return games.filter((val) => {
      return val.link !== gameChoosen
    })
  },
  gameExists(state) {
    return (id) => {
      return !!state.games.find((i) => i.link == id)
    }
  },
}

export const mutations = {
  SET_GAME(state, game) {
    if (!!state.games.find((i) => i.link == game))
      state.gameChoosen = game
    // COOKIES!
    return false
  }
}

export const actions = {
  nuxtServerInit({
    commit
  }, {
    req
  }) {
    // COOKIES SET!
  }
}
