import React, {useContext, useEffect} from 'react'
import {toast} from 'react-toastify'
import {Modal, ModalBody, ModalHeader} from '../Modal'
import {useHttp} from '../../hooks/http'
import {AuthContext} from '../../context/authContext'

export const NoteModal = ({note, updateNote}) => {
	const {request, error, clearError} = useHttp()
	const {token} = useContext(AuthContext)

	useEffect(() => {
		toast.error(error)
		clearError()
	}, [error, clearError])

	const editNote = (data) => {
		try {
			setTimeout(async () => {
				await request('/api/notes/update', 'POST', {id: note._id, ...data}, {
					Authorization: `Bearer ${token}`
				})
			}, 500)

			updateNote({id: note._id, ...data})
		} catch (e) {}
	}

	return (
		<Modal id="noteModal" color={note.color}>
			<ModalHeader
				contentEditable
				actions={{onChange: e => editNote({title: e.target.textContent, text: note.text})}}
			>{note.title}</ModalHeader>
			<ModalBody>
				<p
					suppressContentEditableWarning
					contentEditable
					className={`card-text ${note.text?.split('').length <= 60 ? 'lead' : ''}`}
					onInput={e => editNote({text: e.target.textContent, title: note.title})}
				>{note.text || ''}</p>
				{note.list &&
					note.list.map((item) =>
						<div className="form-check" key={item._id}>
							<input
								className="form-check-input"
								type="checkbox"
								id={`listItem-${item._id}`}
							/>
							<label className="form-check-label" htmlFor={`listItem-${item._id}`}>
								{item.title}
							</label>
						</div>
					)
				}
				{note.tags && note.tags?.length !== 0 &&
					<div className="mt-2">
						{note.tags.map(tag =>
							<span
								key={tag.tagId?._id}
								className="badge rounded-pill bg-transparent border me-2 mt-2"
							>{tag.tagId?.title}</span>
						)}
					</div>
				}
			</ModalBody>
		</Modal>
	)
}
