import api from './api'

const profesorService = {
  getAll() {
    return api.get('/profesores')
  },

  getById(id) {
    return api.get(`/profesores/${id}`)
  },

  create(data) {
    return api.post('/profesores', data)
  },

  update(id, data) {
    return api.put(`/profesores/${id}`, data)
  },

  delete(id) {
    return api.delete(`/profesores/${id}`)
  },

  getHorarios(id) {
    return api.get(`/profesores/${id}/horarios`)
  },

  addHorario(profesorId, horarioData) {
    return api.post(`/profesores/${profesorId}/horarios`, horarioData)
  },

  removeHorario(profesorId, horarioId) {
    return api.delete(`/profesores/${profesorId}/horarios/${horarioId}`)
  },

  getClases(id) {
    return api.get(`/profesores/${id}/clases`)
  },

  addClase(profesorId, claseId) {
    return api.post(`/profesores/${profesorId}/clases`, { claseId })
  },

  removeClase(profesorId, claseId) {
    return api.delete(`/profesores/${profesorId}/clases/${claseId}`)
  },
}

export default profesorService