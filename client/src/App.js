import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import {useRoutes} from './hooks/routes'
import {Navbar} from './components/Navbar'
import {useAuth} from './hooks/useAuth'
import {AuthContext} from './context/authContext'

export default function App() {
	const {login, logout, ready, token} = useAuth()

	const isAuthenticated = !!token

	const routes = useRoutes(isAuthenticated)

	if (!ready) {
		return <p>Loading...</p>
	}

	return (
		<AuthContext.Provider value={{
			login, logout, token, ready
		}}>
			<Router>
				<ToastContainer />
				<Navbar isAuthenticated={isAuthenticated}/>
				<div className="container mt-4">
					{routes}
				</div>
			</Router>
		</AuthContext.Provider>
	)
}
