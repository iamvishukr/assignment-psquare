"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem("token"), 
  loading: true,
  error: null,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      localStorage.setItem("token", action.payload.token)
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      }
    case "LOGOUT":
      localStorage.removeItem("token")
      return { ...state, user: null, token: null, loading: false, error: null }
    case "AUTH_ERROR":
      localStorage.removeItem("token")
      return { ...state, user: null, token: null, loading: false, error: action.payload }
    case "CLEAR_ERROR":
      return { ...state, error: null }
    case "UPDATE_USER":
      return { ...state, user: action.payload }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`
    } else {
      delete axios.defaults.headers.common["Authorization"]
    }
  }, [state.token])

  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`)
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user: response.data.user, token: state.token },
          })
        } catch (error) {
          dispatch({
            type: "AUTH_ERROR",
            payload: error.response?.data?.message || "Authentication failed",
          })
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    loadUser()
  }, [state.token]) 

  const login = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password,
      })
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed"
      dispatch({ type: "AUTH_ERROR", payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  const register = async (name, email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        name,
        email,
        password,
      })
      dispatch({ type: "REGISTER_SUCCESS", payload: response.data })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed"
      dispatch({ type: "AUTH_ERROR", payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const updateUser = (userData) => {
    dispatch({ type: "UPDATE_USER", payload: userData })
  }

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
