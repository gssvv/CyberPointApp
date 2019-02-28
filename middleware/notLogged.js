export default function({ store, route, redirect }) {
  if (store.state.currentUser._id) return redirect('/panel')
}
