import decode from 'jwt-decode'

class AuthService {
  getToken() {
    return localStorage.getItem('token')
  }
  
  getProfile() {
    return decode(this.getToken())
  }

  loggedIn() {
    const token = this.getToken()
    return token && !this.isTokenExpired()
  }

  isTokenExpired() {
    const token = this.getToken()
    const decodedToken = decode(token)
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