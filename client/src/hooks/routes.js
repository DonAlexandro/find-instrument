import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {Home} from '../pages/Home'
import {Login} from '../pages/Login'
import {Signup} from '../pages/Signup'
import {Archive} from '../pages/Archive'
import {Trash} from '../pages/Trash'

export const useRoutes = (isAuthenticated) => {
	if (isAuthenticated) {
		return (
			<Switch>
				<Route path="/" exact>
					<Home />
				</Route>
				<Route path="/archive" exact>
					<Archive />
				</Route>
				<Route path="/trash" exact>
					<Trash />
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
