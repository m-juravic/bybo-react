import './App.css';
import RoutesList from "./RoutesList"
import Nav from './Nav';
import userContext from "./userContext";
import { BrowserRouter, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {Spinner} from 'react-bootstrap';
import ByboApi from './api';
import jwt_decode from "jwt-decode";

/** Renders application */

function App() {
  const [user, setUser] = useState({
    data: null,
    isLoading: true
  });
  const [token, setToken] = useState(getTokenFromLocalStorage);

  /** Set token to local storage */

  function setTokenToLocalStorage(token) {
    localStorage.setItem("token", token);
  }

  /** Get token from local storage */

  function getTokenFromLocalStorage() {
    return localStorage.getItem("token");
  }

  /** Remove token from local storage */

  function removeTokenFromLocalStorage() {
    localStorage.removeItem("token");
  }

  /** Fetches user information */

  async function fetchUserDataFromAPI() {
    const payload = jwt_decode(token);
    const { id } = payload;

    console.log("payload", payload);

    ByboApi.token = token;
    const currentUser = await ByboApi.getUserDetail(id);
    setUser({
      data: currentUser,
      isLoading: false
    });
  }

  // Every time the token changes trigger our use effect

  useEffect(function fetchAndSetUserInfo() {
    async function fetchUser() {

      if (token) {
        fetchUserDataFromAPI();
      } else {
        setUser({
          data: null,
          isLoading: false
        });
      }
    }
    fetchUser();
  }, [token]);

  /** Handles logging in. */

  async function handleLogin(formData) {
    const token = await ByboApi.loginUser(formData);
    setTokenToLocalStorage(token);
    setToken(token);
  }

  /** Handles logging out. */

  function handleLogout() {
    removeTokenFromLocalStorage();
    setToken(null);
  }

  /** Handles registration */

  async function handleRegister(formData) {
    const token = await ByboApi.registerUser(formData);
    setTokenToLocalStorage(token);
    setToken(token);
  }

  if (user.isLoading) return <Spinner />;


  return (
    <userContext.Provider value={{ username: user.data?.username, id: user.data?.id }}>
      <BrowserRouter>
        <Nav handleLogout={handleLogout} />
        <RoutesList
          userListings={user.data?.listings}
          userBookings={user.data?.bookings}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
        />
      </BrowserRouter>
    </userContext.Provider>
  )




}

export default App;
