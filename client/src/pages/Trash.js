import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Note} from '../components/Note'
import {toast} from 'react-toastify'
import {Loader} from '../components/Loader'
import {useHttp} from '../hooks/http'
import {AuthContext} from '../context/authContext'
import {removeObjectFromArr} from '../utils/functions';

export const Trash = () => {
	const [notes, setNotes] = useState([])

	const {loading, request, error, clearError} = useHttp()
	const {token} = useContext(AuthContext)

	const deleteNote = id => setNotes(removeObjectFromArr(notes, id))

	const fetchNotes = useCallback(async () => {
		try {
			const response = await request('/api/notes?location=trash', 'GET', null, {
				Authorization: `Bearer ${token}`
			})

			setNotes(response.notes)
		} catch (e) {}
	}, [request, token])

	useEffect(() => {
		fetchNotes()
	}, [fetchNotes])

	useEffect(() => {
		toast.error(error)
		clearError()
	}, [error, clearError])

	if (loading) {
		return <Loader />
	}

	return (
		<div className="w-80 mx-auto">
			{notes.length ?
				<>
					<h1 className="text-white mb-5 display-5 d-flex">
						<i className="bi bi-trash me-2 d-flex align-items-center"></i>
						Корзина
					</h1>
					<div className="row row-cols-4 g-3">
						{notes.map(note =>
							<Note
								note={note}
								key={note._id}
								deleteNote={deleteNote}
							/>
						)}
					</div>
				</> :
				<div className="text-white text-center notes-empty">
					<i className="bi bi-trash text-muted"></i>
					<h1 className="display-6 text-muted mt-3">В корзині пусто</h1>
				</div>
			}
		</div>
	)
}
