import api from './api'

const claseService = {
  getAll() {
    return api.get('/clases')
  },

  getById(id) {
    return api.get(`/clases/${id}`)
  },

  create(data) {
    return api.post('/clases', data)
  },

  update(id, data) {
    return api.put(`/clases/${id}`, data)
  },

  delete(id) {
    return api.delete(`/clases/${id}`)
  },
}

export default claseService