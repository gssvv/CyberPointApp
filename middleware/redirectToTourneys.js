export default async function({ store, route, redirect }) {
  console.log(123)
  redirect('/' + store.state.gameChosen)
}
