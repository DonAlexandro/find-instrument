import React, {useCallback, useContext, useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {AuthContext} from '../context/authContext'
import {useHttp} from '../hooks/http'
import {Loader} from '../components/Loader'
import {Note} from '../components/Note'
import {addObjectToPosition, removeObjectFromArr, updateObject} from '../utils/functions'

export const Archive = () => {
	const [, setState] = useState()
	const [notes, setNotes] = useState([])
	const [tags, setTags] = useState([])

	const {loading, request, error, clearError} = useHttp()
	const {token} = useContext(AuthContext)

	const deleteNote = id => setNotes(removeObjectFromArr(notes, id))
	const addNoteToPos = (pos, note) => {
		setNotes(addObjectToPosition(notes, note, pos))
		setState({})
	}
	const updateNote = ({id, ...data}) => {
		const {idx, newNote} = updateObject(notes, id, data)
		addNoteToPos(idx, newNote)
	}

	const fetchNotes = useCallback(async () => {
		try {
			const response = await request('/api/notes?location=archive', 'GET', null, {
				Authorization: `Bearer ${token}`
			})

			setNotes(response.notes)
		} catch (e) {}
	}, [request, token])

	useEffect(() => {
		fetchNotes()
	}, [fetchNotes])

	const fetchTags = useCallback(async () => {
		try {
			const response = await request('/api/tags', 'GET', null, {
				Authorization: `Bearer ${token}`
			})

			setTags(response.tags)
		} catch (e) {}
	}, [request, token])

	useEffect(() => {
		fetchTags()
	}, [fetchTags])

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
						<i className="bi bi-archive me-2 d-flex align-items-center"></i>
						Архів
					</h1>
					<div className="row row-cols-4 g-3">
						{notes.map(note =>
							<Note
								note={note}
								tags={tags}
								key={note._id}
								deleteNote={deleteNote}
								updateNote={updateNote}
							/>
						)}
					</div>
				</> :
				<div className="text-white text-center notes-empty">
					<i className="bi bi-archive text-muted"></i>
					<h1 className="display-6 text-muted mt-3">Архів поки що пустий</h1>
				</div>
			}
		</div>
	)
}
