import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

export default {
  login(data) {
    return api.post('/login', data)
  },

  getHome(userId) {
    return api.get(`/home/${userId}`)
  },

  getTrips(userId) {
    return api.get(`/users/${userId}/trips`)
  },

  createTrip(data) {
    return api.post('/trips', data)
  }
}
