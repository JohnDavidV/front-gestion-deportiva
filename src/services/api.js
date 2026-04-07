import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la API:', error)
    const message = error.response?.data?.message || error.message || 'Error desconocido'
    return Promise.reject(new Error(message))
  }
)

export default api