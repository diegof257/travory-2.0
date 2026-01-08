const KEY = 'travory-user'

export const session = {
  set(user) {
    localStorage.setItem(KEY, JSON.stringify(user))
  },

  get() {
    const data = localStorage.getItem(KEY)
    return data ? JSON.parse(data) : null
  },

  isLogged() {
    return !!this.get()
  },

  clear() {
    localStorage.removeItem(KEY)
  }
}
