import React, {useContext, useEffect} from 'react'
import ReactTooltip from 'react-tooltip'
import {toast} from 'react-toastify'
import {Button} from './Button'
import {useHttp} from '../hooks/http'
import {AuthContext} from '../context/authContext'

export const Note = ({note, deleteNote}) => {
	const {request, error, clearError} = useHttp()
	const {token} = useContext(AuthContext)

	useEffect(() => {
		toast.error(error)
		clearError()
	}, [error, clearError])

	const removeNote = async id => {
		try {
			const response = await request('/api/notes/remove', 'POST', {id}, {
				Authorization: `Bearer ${token}`
			})

			deleteNote(id)
			toast.dark(response.message)
		} catch (e) {}
	}

	const archiveNote = async id => {
		try {
			const response = await request('/api/notes/archive', 'POST', {id}, {
				Authorization: `Bearer ${token}`
			})

			deleteNote(id)
			toast.dark(response.message)
		} catch (e) {}
	}

	return (
		<div className="col">
			<div className={`note card h-100 ${note.color} text-white`}>
				<div className="card-body">
					{note.title && <h5 className="card-title">{note.title}</h5>}
					{note.text && <p className={`card-text ${note.text.split('').length <= 60 ? 'lead' : ''}`}>{note.text}</p>}
				</div>
				<div className="card-footer d-flex justify-content-between">
					<Button
						size="sm"
						color="outlineLight"
						tooltip="Змінити колір"
					>
						<i className="bi bi-palette-fill d-flex align-items-center"></i>
					</Button>
					<ReactTooltip effect="solid"/>
					<Button
						size="sm"
						color="outlineLight"
						tooltip="Архівувати"
						actions={{onClick: () => archiveNote(note._id)}}
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
						actions={{onClick: () => removeNote(note._id)}}
					>
						<i className="bi bi-trash-fill d-flex align-items-center"></i>
					</Button>
					<ReactTooltip effect="solid"/>
				</div>
			</div>
		</div>
	)
}
