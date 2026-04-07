import api from './api'

const eventoService = {
  getAll() {
    return api.get('/eventos')
  },

  getById(id) {
    return api.get(`/eventos/${id}`)
  },

  create(data) {
    return api.post('/eventos', data)
  },

  update(id, data) {
    return api.put(`/eventos/${id}`, data)
  },

  delete(id) {
    return api.delete(`/eventos/${id}`)
  },

  getInscripciones(eventoId) {
    return api.get(`/eventos/${eventoId}/inscripciones`)
  },

  inscribirGrupo(eventoId, data) {
    return api.post(`/eventos/${eventoId}/inscripciones`, data)
  },

  removeInscripcion(eventoId, inscripcionId) {
    return api.delete(`/eventos/${eventoId}/inscripciones/${inscripcionId}`)
  },
}

export default eventoService