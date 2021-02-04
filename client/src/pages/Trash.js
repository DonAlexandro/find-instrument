import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Note} from '../components/Note'
import {toast} from 'react-toastify'
import {Loader} from '../components/Loader'
import {useHttp} from '../hooks/http'
import {AuthContext} from '../context/authContext'
import {removeObjectFromArr} from '../utils/functions';
import {Button} from '../components/Button';

export const Trash = () => {
	const [notes, setNotes] = useState([])

	const {loading, request, error, clearError} = useHttp()
	const {token} = useContext(AuthContext)

	const deleteNote = id => setNotes(removeObjectFromArr(notes, id))

	const clearTrash = async () => {
		try {
			const response = await request('/api/notes/remove', 'POST', null, {
				Authorization: `Bearer ${token}`
			})

			toast.dark(response.message)
			setNotes([])
		} catch (e) {}
	}

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
					<div className="d-flex justify-content-between align-items-center mb-5">
						<h1 className="text-white display-5 d-flex">Корзина</h1>
						<Button
							color="outlineLight"
							actions={{onClick: clearTrash}}
						>Очистити корзину</Button>
					</div>
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
