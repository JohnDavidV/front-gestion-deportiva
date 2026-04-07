import api from './api'

const horarioService = {
  getAll() {
    return api.get('/horarios')
  },

  getById(id) {
    return api.get(`/horarios/${id}`)
  },

  getByProfesor(profesorId) {
    return api.get(`/horarios/profesor/${profesorId}`)
  },

  getByClase(claseId) {
    return api.get(`/horarios/clase/${claseId}`)
  },

  create(data) {
    return api.post('/horarios', data)
  },

  update(id, data) {
    return api.put(`/horarios/${id}`, data)
  },

  delete(id) {
    return api.delete(`/horarios/${id}`)
  },

  getAlumnosInscritos(horarioId) {
    return api.get(`/horarios/${horarioId}/alumnos`)
  },

  inscribirAlumno(horarioId, alumnoId) {
    return api.post(`/horarios/${horarioId}/alumnos`, { alumnoId })
  },

  desinscribirAlumno(horarioId, alumnoId) {
    return api.delete(`/horarios/${horarioId}/alumnos/${alumnoId}`)
  },
}

export default horarioService