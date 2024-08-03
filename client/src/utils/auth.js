import { jwtDecode } from 'jwt-decode'

class AuthService {
  getToken() {
    return localStorage.getItem('token')
  }
  
  getProfile() {
    return jwtDecode(this.getToken())
  }

  isLoggedIn() {
    const token = this.getToken()
    return token && !this.isTokenExpired()
  }

  isTokenExpired() {
    const token = this.getToken()
    const decodedToken = jwtDecode(token)
    if (decodedToken.exp < Date.now() / 1000) {
      localStorage.removeItem('token')
      return true
    }
    return false
  }

  login(token) {
    localStorage.setItem('token', token)
    window.location.href = '/'
  }

  logout() {
    localStorage.removeItem('token')
    window.location.href = '/'
  }
}

export default new AuthService()