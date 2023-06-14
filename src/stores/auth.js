import { defineStore } from 'pinia'

import axios from 'axios'
import { router } from '@/helpers'

import { useProjectStore } from './project'
import { useErrorStore } from './errors'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from session storage to enable user to stay logged in for the session (not using local store)
    user: JSON.parse(sessionStorage.getItem('soile-user')),
    roles: JSON.parse(sessionStorage.getItem('soile-userroles')),
    jwtToken: JSON.parse(sessionStorage.getItem('soile-jwtToken')),
    projectToken: JSON.parse(sessionStorage.getItem('soile-projectToken')),
    isAnonymous: JSON.parse(sessionStorage.getItem('soile-anonymous')),
    returnUrl: null,
    authed: false
  }),
  actions: {
    isAuthed() {
      return this.authed
    },
    isAdmin() {
      if (this.isAuthed()) {
        return this.roles.contains('Admin')
      } else {
        return false
      }
    },
    isResearcher() {
      if (this.isAuthed()) {
        console.log(this.roles)
        return this.roles.includes('Admin') || this.roles.includes('Researcher')
      } else {
        return false
      }
    },
    async refreshSession() {
      if (this.jwtToken) {
        this.setAccessToken(this.jwtToken)
      }
      if (this.projectToken) {
        this.setProjectToken(this.projectToken)
      }
      try {
        console.log('Checking auth status')
        // refresh the session cookie.
        await this.updateLoginStatus()
      } catch (error) {
        if (error.response?.status != 401) {
          console.log(error)
          this.processAxiosError(error)
        }
      }
    },
    async login(username, password, remember) {
      var loginData = {
        username,
        password,
        remember: remember ? '1' : '0'
      }
      console.log(loginData)
      try {
        const response = await axios.post('/login', loginData, {
          headers: { 'Content-Type': 'application/json' }
        })
        console.log(response?.data)
        // update pinia state
        await this.updateLoginStatus()
        this.setAccessToken(response?.data.token)
        // store user details and jwt in local storage to keep user logged in between page refreshes
        await this.updateUserData()
        // redirect to previous url or default to home page
        router.push(this.returnUrl || '/')
      } catch (e) {
        this.processAxiosError(e)
      }
    },

    async logout() {
      try {
        // post to logout (invalidating session)
        const response = await axios.post('/logout')
        // reset user and update available projects.
        this.setRoles([])
        this.setUser(null)
        this.authed = false
        this.setAccessToken(null)
        this.setProjectToken(null)
        this.setProjectToken(null)
        const listStore = useProjectStore()
        listStore.clearData()
        await this.updateLoginStatus()
        await listStore.updateAvailableStudies()
        console.log('Logged Out')
      } catch (e) {
        this.processAxiosError(e)
      }
    },

    async updateUserData() {
      const listStore = useProjectStore()
      await this.updateLoginStatus()
      await listStore.updateAvailableStudies()
      await listStore.fetchSignedUpStudies()
    },
    async signUp(projectID, accessToken) {
      const params = accessToken ? { params: { token: accessToken } } : {}
      try {
        const response = await axios.post('/study/' + projectID + '/signup', params)
        this.setProjectToken(response?.data.token)
        console.log('Signup was successful')
        return true
      } catch (failed) {
        console.log('Caught error')
        console.log(failed)
        this.processAxiosError(failed)
        return false
      }
    },
    setAccessToken(token) {
      this.jwtToken = token
      if (token) {
        sessionStorage.setItem('soile-jwtToken', JSON.stringify(this.jwtToken))
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
        this.isAnonymous = false
      } else {
        sessionStorage.removeItem('soile-jwtToken')
        // if the header is a jwt header, reset it, f we no longer have a token.
        if (axios.defaults.headers.common['Authorization']) {
          if (axios.defaults.headers.common['Authorization'].startsWith('Bearer ')) {
            axios.defaults.headers.common['Authorization'] = ''
          }
        }
      }
    },
    setRoles(roles) {
      this.roles = roles
      if (roles && roles.length > 0) {
        sessionStorage.setItem('soile-userroles', JSON.stringify(roles))
      } else {
        sessionStorage.removeItem('soile-userroles')
      }
    },
    setUser(user) {
      this.user = user
      if (user) {
        sessionStorage.setItem('soile-user', JSON.stringify(user))
      } else {
        sessionStorage.removeItem('soile-user')
      }
    },

    async updateLoginStatus() {
      try {
        console.log('Testing auth')
        const response = await axios.post('/test/auth')
        console.log('Auth succeeded')
        console.log(response?.data)
        this.authed = true
        this.setUser(response?.data.user)
        this.setRoles(response?.data.roles)
      } catch (error) {
        if (error.response?.status == 401) {
          // We are no longer authorized
          this.authed = false
        } else {
          throw error
        }
      }
    },
    setProjectToken(token) {
      console.log('Setting Project token')
      if (!this.user) {
        this.projectToken = token
        if (token) {
          sessionStorage.setItem('soile-projectToken', JSON.stringify(this.projectToken))
        } else {
          sessionStorage.removeItem('soile-projectToken')
        }
        axios.defaults.headers.common['Authorization'] = token
        //
        console.log('This is an anonymous use for token:' + token)
        this.isAnonymous = true
      }
    },
    processAxiosError(err) {
      const errorStore = useErrorStore()
      errorStore.processAxiosError(err)
    }
  }
})
