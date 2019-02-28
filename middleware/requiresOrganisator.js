export default async function({ store, route, redirect }) {
  let checkUser = await store.dispatch('checkUser')
  if (await !checkUser) return redirect('/panel/login')

  if (
    checkUser.privilege !== 'admin' &&
    checkUser.privilege !== 'moderator' &&
    checkUser.privilege !== 'organisator'
  )
    redirect('/panel')
}
