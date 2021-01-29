import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http'
import {AuthContext} from '../context/authContext'
import {Note} from '../components/Note'
import {Loader} from '../components/Loader'
import {NoteForm} from '../components/NoteForm';

export const Home = () => {
	const [, setState] = useState()
	const [notes, setNotes] = useState([])

	const {loading, request} = useHttp()
	const {token} = useContext(AuthContext)

	const addNote = note => setNotes(prev => ([note, ...prev]))
	const deleteNote = id => setNotes(notes.filter(note => note._id !== id))

	const addNoteToPos = (pos, note) => {
		notes.splice(pos, 0, note)
		notes.splice(pos + 1, 1)

		setNotes(notes)
		setState({})
	}
	const updateNote = ({id, ...data}) => {
		const idx = notes.findIndex(note => note._id === id)
		const newNote = {...notes[idx], ...data}

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

	if (loading) {
		return <Loader />
	}

	return (
		<div className="w-75 mx-auto">
			<NoteForm addNote={addNote}/>
			{notes.length ?
				<div className="row row-cols-4 g-3">
					{notes.map(note =>
						<Note
							note={note}
							key={note._id}
							deleteNote={deleteNote}
							updateNote={updateNote}
						/>
					)}
				</div> :
				<div className="text-white text-center notes-empty">
					<i className="bi bi-file-text text-muted"></i>
					<h1 className="display-6 text-muted mt-3">Нотаток поки що немає</h1>
				</div>
			}
		</div>
	)
}
