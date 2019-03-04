export default async function({ store, route, redirect }) {
  redirect('/' + store.state.gameChosen)
}
