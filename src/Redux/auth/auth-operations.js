import axios from 'axios'

import authActions from './auth-actions'

axios.defaults.baseURL = 'https://goit23-project.herokuapp.com/'

const token = {
  set(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  },
  unset() {
    axios.defaults.headers.common.Authorization = ''
  },
}

const register = credentials => dispatch => {
  dispatch(authActions.registerRequest())

  axios
    .post('users/signup', credentials)
    .then(() => {
      dispatch(authActions.registerSuccess())
    })
    .catch(err => {
      dispatch(
        authActions.registerError(err.response?.data?.message || err.message),
      )
    })
}

const login = credentials => dispatch => {
  dispatch(authActions.logInRequest())

  axios
    .post('users/login', credentials)
    .then(({ data }) => {
      token.set(data.result.token)

      dispatch(authActions.logInSuccess(data.result.token))
    })
    .catch(err => {
      dispatch(
        authActions.logInError(err.response?.data?.message || err.message),
      )
    })
}

const logout = () => dispatch => {
  dispatch(authActions.logOutRequest())

  axios
    .post('users/logout')
    .then(() => {
      token.unset()

      dispatch(authActions.logOutSuccess())
    })
    .catch(err => {
      dispatch(
        authActions.logOutError(err.response?.data?.message || err.message),
      )
    })
}

const getCurrentUser = () => (dispatch, getState) => {
  const {
    auth: { token: persistedToken },
  } = getState()

  if (!persistedToken) {
    return
  }

  token.set(persistedToken)
  dispatch(authActions.getCurrentUserRequest())

  axios
    .get('/users/current')
    .then(({ data }) => dispatch(authActions.getCurrentUserSuccess(data)))
    .catch(err =>
      dispatch(
        authActions.getCurrentUserError(
          err.response?.data?.message || err.message,
        ),
      ),
    )
}

const authOperations = { register, login, logout, getCurrentUser }
export default authOperations
