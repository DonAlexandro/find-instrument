import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {Home} from '../pages/Home'
import {Login} from '../pages/Login'
import {Signup} from '../pages/Signup'

export const useRoutes = (isAuthenticated) => {
	if (isAuthenticated) {
		return (
			<Switch>
				<Route path="/" exact>
					<Home />
				</Route>
				<Redirect to="/"/>
			</Switch>
		)
	}

	return (
		<Switch>
			<Route path="/login" exact>
				<Login />
			</Route>
			<Route path="/signup" exact>
				<Signup />
			</Route>
			<Redirect to="/login"/>
		</Switch>
	)
}
