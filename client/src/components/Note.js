import React, {useContext, useEffect} from 'react'
import ReactTooltip from 'react-tooltip'
import {toast} from 'react-toastify'
import {Button} from './Button'
import {useHttp} from '../hooks/http'
import {AuthContext} from '../context/authContext'
import {ColorPicker} from './ColorPicker'
import {TagPicker} from './TagPicker'
import {isObjectInArray} from '../utils/functions'

export const Note = ({note, deleteNote, updateNote, tags, setFullNote}) => {
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
			response.message.length && toast.dark(response.message)
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

	const removeNote = async (id) => {
		try {
			const response = await request('/api/notes/remove', 'POST', {id}, {
				Authorization: `Bearer ${token}`
			})

			deleteNote(id)
			toast.dark(response.message)
		} catch (e) {}
	}

	const toggleTag = async (id, tag) => {
		try {
			let tags

			if (isObjectInArray(note.tags, tag)) {
				tags = note.tags.filter(item => item.tagId._id !== tag._id)
			} else {
				tags = [{tagId: tag}, ...note.tags]
			}

			updateNote({id, tags})

			await request('/api/notes/update', 'POST', {id, tags}, {
				Authorization: `Bearer ${token}`
			})
		} catch (e) {
			console.error(e)
		}
	}

	const pinNote = async (id, pinned = false) => {
		try {
			await request('/api/notes/update', 'POST', {id, pinned}, {
				Authorization: `Bearer ${token}`
			})

			updateNote({id, pinned})
		} catch (e) {}
	}

	const checkListItem = async (id, idx, done) => {
		note.list[idx].done = done

		try {
			await request('/api/notes/update', 'POST', {id, list: note.list}, {
				Authorization: `Bearer ${token}`
			})

			updateNote({id, list: note.list})
		} catch (e) {}
	}

	return (
		<div className="col">
			<div className={`note card h-100 text-white pale ${note.color}`}>
				<div className="card-header border-bottom-0 d-flex align-items-start justify-content-between">
					<h6
						className="card-title mb-0 align-self-center flex-grow-1"
						data-bs-toggle={note.removed ? '' : 'modal'}
						data-bs-target={note.removed ? '' : '#noteModal'}
						onClick={note.removed ? () => {} : () => setFullNote(note)}
					>{note.title || ''}</h6>
					{!note.removed && !note.archived &&
						<>
							<Button
								color={`${note.pinned ? 'light' : 'outlineLight'}`}
								size="sm"
								spaces={note.title && ['ms-2']}
								tooltip={`${note.pinned ? 'Відкріпити нотатку' : 'Закріпити нотатку'}`}
								actions={{onClick: () => pinNote(note._id, !note.pinned)}}
							>
								<i className="bi bi-pin-fill"></i>
							</Button>
							<ReactTooltip effect="solid"/>
						</>
					}
				</div>
				<div className="card-body pt-2">
					<div className="d-flex flex-column align-items-start h-100">
						<div className="flex-grow-1 w-100">
							{note.text && <p className={`card-text text-wrap ${note.text.split('').length <= 60 ? 'lead' : ''}`}>{note.text}</p>}
							{note.list &&
								note.list.map((item, idx) =>
									<div
										className="form-check"
										key={item._id}
									>
										<input
											className="form-check-input"
											type="checkbox"
											id={`listItem-${item._id}`}
											checked={item.done}
											onChange={() => checkListItem(note._id, idx, !item.done)}
										/>
										<label className="form-check-label" htmlFor={`listItem-${item._id}`}>
											{item.title}
										</label>
									</div>
								)
							}
							{note.tags.length === 0 &&
							 note.list.length === 0 &&
							 note.text.length === 0 &&
							 note.title.length === 0 &&
								<p className="lead text-muted">Пуста нотатка</p>
							}
						</div>
						{note.tags.length !== 0 &&
							<div className="mt-2">
								{note.tags.map((tag, idx) =>
									<span
										key={tag?.tagId?._id || idx}
										className="badge rounded-pill bg-transparent border me-2 mt-2"
									>{tag?.tagId?.title}</span>
								)}
							</div>
						}
					</div>
				</div>
				<div className={`card-footer d-flex ${!note.removed && 'justify-content-between'}`}>
					{!note.removed ?
					<>
						<div className="dropdown">
							<button
								className="btn btn-outline-light btn-sm"
								data-bs-toggle="dropdown"
								aria-expanded="false"
								data-tip="Змінити колір"
							>
								<i className="bi bi-palette-fill"></i>
							</button>
							<ReactTooltip effect="solid"/>
							<ColorPicker note={note} updateColor={updateColor}/>
						</div>
						<Button
							size="sm"
							color="outlineLight"
							tooltip={`${note.archived ? 'Вернути з архіву' : 'Архівувати'}`}
							actions={{onClick: () => moveNote(note._id, false, !note.archived)}}
						>
							<i className="bi bi-archive-fill"></i>
						</Button>
						<ReactTooltip effect="solid"/>
						<div className="dropdown">
							<button
								className="btn btn-outline-light btn-sm"
								data-bs-toggle="dropdown"
								aria-expanded="false"
								data-tip="Додати ярлик"
							>
								<i className="bi bi-tag-fill"></i>
							</button>
							<ReactTooltip effect="solid"/>
							<TagPicker tags={tags} toggleTag={toggleTag} note={note}/>
						</div>
					</> :
					<>
						<Button
							size="sm"
							color="outlineLight"
							tooltip="Видалити назавжди"
							spaces={['me-2']}
							actions={{onClick: () => removeNote(note._id)}}
						>
							<i className="bi bi-trash-fill"></i>
						</Button>
						<ReactTooltip effect="solid"/>
					</>
					}
					<Button
						size="sm"
						color="outlineLight"
						tooltip={note.removed ? 'Відновити' : 'Видалити'}
						actions={{onClick: () => moveNote(note._id, !note.removed)}}
					>
						{note.removed ?
							<i className="bi bi-arrow-clockwise"></i> :
							<i className="bi bi-trash-fill d-flex align-items-center"></i>
						}
					</Button>
					<ReactTooltip effect="solid"/>
				</div>
			</div>
		</div>
	)
}
