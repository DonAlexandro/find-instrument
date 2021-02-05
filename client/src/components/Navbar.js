import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Link, NavLink, useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import {AuthContext} from '../context/authContext'
import {TagsModal} from './modals/TagsModal'
import {useHttp} from '../hooks/http'

export const Navbar = ({isAuthenticated}) => {
	const [tags, setTags] = useState([])

	const {logout, token} = useContext(AuthContext)
	const {request, clearError, error} = useHttp()
	const history = useHistory()

	const logoutHandler = event => {
		event.preventDefault()

		logout()
		history.push('/login')
	}

	const fetchTags = useCallback(async () => {
		try {
			const response = await request('/api/tags', 'GET', null, {
				Authorization: `Bearer ${token}`
			})

			setTags(response.tags)
		} catch (e) {}
	}, [request, token])

	useEffect(() => {
		if (token) {
			fetchTags()
		}
	}, [fetchTags, token])


	useEffect(() => {
		toast.error(error)
		clearError()
	}, [error, clearError])

	return (
		<>
			{isAuthenticated && <TagsModal tags={tags}/>}
			<nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
				<div className="container">
					<Link to="/" className="navbar-brand">
						<strong><i className="bi bi-file-text d-inline-flex align-items-center"></i> Keep Copy</strong>
					</Link>
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse"
							data-bs-target="#navbarNav" aria-controls="navbarNav"
							aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse w-auto" id="navbarNav">
						<ul className="navbar-nav">
							{!isAuthenticated ?
								<>
									<li className="nav-item">
										<NavLink to="/login" exact className="nav-link">Вхід</NavLink>
									</li>
									<li className="nav-item">
										<NavLink to="/signup" exact className="nav-link">Реєстрація</NavLink>
									</li>
								</> :
								<>
									<li className="nav-item">
										<NavLink to="/" exact className="nav-link">Нотатки</NavLink>
									</li>
									<li className="nav-item dropdown">
										<button className="btn shadow-none nav-link dropdown-toggle"
										   data-bs-toggle="dropdown"
										   aria-expanded="false"
										   onClick={e => e.preventDefault()}
										>
											Ярлики
										</button>
										<ul className="dropdown-menu dropdown-menu-dark">
											{tags.map(tag =>
												<li key={tag._id}><Link
													to={`/tag/${tag._id}`}
													className="dropdown-item"
												>{tag.title}</Link></li>
											)}
										</ul>
									</li>
									<li className="nav-item">
										<a
											href="#tagsModal"
											data-bs-toggle="modal"
											className="nav-link"
										>Редагування ярликів</a>
									</li>
									<li className="nav-item">
										<NavLink to="/archive" exact className="nav-link">Архів</NavLink>
									</li>
									<li className="nav-item">
										<NavLink to="/trash" exact className="nav-link">Корзина</NavLink>
									</li>
									<li className="nav-item">
										<a href="/" onClick={logoutHandler} className="nav-link">Вийти</a>
									</li>
								</>
							}
						</ul>
					</div>
				</div>
			</nav>
		</>
	)
}
