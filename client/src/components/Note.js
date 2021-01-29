import React, {useContext, useEffect} from 'react'
import ReactTooltip from 'react-tooltip'
import {toast} from 'react-toastify'
import {Button} from './Button'
import {useHttp} from '../hooks/http'
import {AuthContext} from '../context/authContext'
import {ColorPicker} from './ColorPicker';

export const Note = ({note, deleteNote, updateNote}) => {
	const {request, error, clearError} = useHttp()
	const {token} = useContext(AuthContext)

	useEffect(() => {
		toast.error(error)
		clearError()
	}, [error, clearError])

	const moveNote = async (id, removed = false, archived = false) => {
		try {
			const response = await request('/api/notes/update', 'POST', {id, removed, archived}, {
				Authorization: `Bearer ${token}`
			})

			deleteNote(id)
			toast.dark(response.message)
		} catch (e) {}
	}

	const updateColor = async (id, color) => {
		try {
			await request('/api/notes/update', 'POST', {id, color}, {
				Authorization: `Bearer ${token}`
			})

			updateNote({id, color})
		} catch (e) {}
	}

	return (
		<div className="col">
			<div className={`note card h-100 ${note.color} text-white`}>
				<div className="card-body">
					{note.title && <h6 className="card-title">{note.title}</h6>}
					{note.text && <p className={`card-text ${note.text.split('').length <= 60 ? 'lead' : ''}`}>{note.text}</p>}
				</div>
				<div className="card-footer d-flex justify-content-between">
					<div className="dropdown">
						<button
							className="btn btn-outline-light btn-sm"
							data-bs-toggle="dropdown"
							aria-expanded="false"
							data-tip="Змінити колір"
						>
							<i className="bi bi-palette-fill d-flex align-items-center"></i>
						</button>
						<ReactTooltip effect="solid"/>
						<ColorPicker note={note} updateColor={updateColor}/>
					</div>
					<Button
						size="sm"
						color="outlineLight"
						tooltip="Архівувати"
						actions={{onClick: () => moveNote(note._id, false, true)}}
					>
						<i className="bi bi-archive-fill d-flex align-items-center"></i>
					</Button>
					<ReactTooltip effect="solid"/>
					<Button
						size="sm"
						color="outlineLight"
						tooltip="Додати ярлик"
					>
						<i className="bi bi-tag-fill d-flex align-items-center"></i>
					</Button>
					<ReactTooltip effect="solid"/>
					<Button
						size="sm"
						color="outlineLight"
						tooltip="Видалити"
						actions={{onClick: () => moveNote(note._id, true)}}
					>
						<i className="bi bi-trash-fill d-flex align-items-center"></i>
					</Button>
					<ReactTooltip effect="solid"/>
				</div>
			</div>
		</div>
	)
}
