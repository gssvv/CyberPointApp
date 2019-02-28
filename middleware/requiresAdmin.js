export default async function({ store, route, redirect }) {
  let checkUser = await store.dispatch('checkUser')
  if (!checkUser) return redirect('/panel/login')

  if (checkUser.privilege !== 'admin') redirect('/panel')
}
