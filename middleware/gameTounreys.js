export default function ({
  store,
  route,
  redirect
}) {
  const {
    game
  } = route.params


  if (store.getters.gameExists(game))
    return store.commit('SET_GAME', game)

  redirect('/')
}
