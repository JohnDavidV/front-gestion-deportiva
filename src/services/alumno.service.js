import api from './api'

const alumnoService = {
  getAll() {
    return api.get('/deportistas')
  },

  getById(id) {
    return api.get(`/deportistas/${id}`)
  },

  create(data) {
    return api.post('/deportistas', data)
  },

  update(id, data) {
    return api.put(`/deportistas/${id}`, data)
  },

  delete(id) {
    return api.delete(`/deportistas/${id}`)
  },

  getClases(alumnoId) {
    return api.get(`/deportistas/${alumnoId}/clases`)
  },

  getHorarios(alumnoId) {
    return api.get(`/deportistas/${alumnoId}/horarios`)
  },
}

export default alumnoService