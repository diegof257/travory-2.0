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
    console.log( 'Fetching trips for user:', userId );
    return api.get(`/user/trips/${userId}`)
  },

  getPreferences(userId) {
    return api.get(`/user/preferences/${userId}`)
  },
  
  getTripDetails(tripId) {
  return api.get(`/itinerary/${tripId}`).then(res => {
    console.log('Trip details response:', res.data);
    return res;
  });
},

  createTrip(data) {
    return api.post('/trips', data)
  },

  generateItineraryAI(tripId, payload) {
    return api.post(`/trips/${tripId}/itineraries/ai`, payload);
  },
  
  sendChatMessage(userId, message) {
    console.log('Sending chat message:', { userId, message });
    return api.post('/chat', { userId, message });
  }

}
