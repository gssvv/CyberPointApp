export default async function({ store, route, redirect }) {
  const { game } = route.params

  if (await store.dispatch('setFullTournament', route.params.id)) {
    const link = store.getters.getGameLink(store.state.fullTournament.game)
    store.dispatch('setGame', link)
  } else {
    redirect('/')
  }
}
