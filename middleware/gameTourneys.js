export default function({ store, route, redirect }) {
  const { game } = route.params

  if (store.state.gameChosen == game) return true

  if (store.getters.gameExists(game)) return store.dispatch('setGame', game)

  redirect('/')
}
