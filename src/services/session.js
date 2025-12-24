export const session = {
  save(user) {
    localStorage.setItem('user', JSON.stringify(user))
  },

  get() {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  },

  clear() {
    localStorage.removeItem('user')
  },

  isAuthenticated() {
    return !!this.get()
  }
}
