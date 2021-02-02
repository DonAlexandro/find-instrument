import React, {useCallback, useContext, useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {useHttp} from '../hooks/http'
import {AuthContext} from '../context/authContext'
import {Note} from '../components/Note'
import {Loader} from '../components/Loader'
import {NoteForm} from '../components/NoteForm'
import {addObjectToPosition, removeObjectFromArr, updateObject} from '../utils/functions'

export const Home = () => {
	const [, setState] = useState()
	const [notes, setNotes] = useState([])
	const [tags, setTags] = useState([])

	const {loading, request, error, clearError} = useHttp()
	const {token} = useContext(AuthContext)

	const addNote = note => setNotes(prev => ([note, ...prev]))
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
			const response = await request('/api/notes', 'GET', null, {
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

	const pinnedNotes = notes.filter(note => note.pinned)
	const otherNotes = notes.filter(note => !note.pinned)

	return (
		<div className="w-80 mx-auto">
			<NoteForm addNote={addNote} tags={tags}/>
			{notes.length ?
			<>
				{pinnedNotes.length &&
				<>
					<h6 className="lead fs-7 text-muted text-uppercase fw-normal ms-3">Закріплені</h6>
					<div className="row row-cols-4 g-3 mb-5">
						{pinnedNotes.map(note =>
							<Note
								note={note}
								tags={tags}
								key={note._id}
								deleteNote={deleteNote}
								updateNote={updateNote}
							/>
						)}
					</div>
				</>
				}
				{otherNotes.length &&
				<>
					{pinnedNotes.length && <h6 className="lead fs-7 text-muted text-uppercase fw-normal ms-3">Інші нотатки</h6>}
					<div className="row row-cols-4 g-3">
						{otherNotes.map(note =>
							<Note
								note={note}
								tags={tags}
								key={note._id}
								deleteNote={deleteNote}
								updateNote={updateNote}
							/>
						)}
					</div>
				</>
				}
			</> :
			<div className="text-white text-center notes-empty">
				<i className="bi bi-file-text text-muted"></i>
				<h1 className="display-6 text-muted mt-3">Нотаток поки що немає</h1>
			</div>
			}
		</div>
	)
}
