import React, {useContext, useEffect, useState} from 'react'
import {Input, Textarea} from './Input'
import {Button} from './Button'
import ReactTooltip from 'react-tooltip'
import {useForm} from 'react-hook-form'
import {toast} from 'react-toastify'
import {useHttp} from '../hooks/http'
import {AuthContext} from '../context/authContext'
import {ColorPicker} from './ColorPicker';
import {TagPicker} from './TagPicker';
import {isObjectInArray} from '../utils/functions'

export const NoteForm = ({addNote, tags}) => {
	const notePortrait = {tags: [], color: 'bg-dark'}

	const [formExpanded, setFormExpanded] = useState(false)
	const [note, setNote] = useState(notePortrait)

	const {token} = useContext(AuthContext)
	const {register, getValues, reset} = useForm()
	const {request, error, clearError} = useHttp()

	useEffect(() => {
		toast.error(error)
		clearError()
	}, [error, clearError])

	const submitHandler = async (archived = false) => {
		const data = getValues(['title', 'text'])

		if (!data.title.length && !data.text.length) {
			setNote(notePortrait)
			return setFormExpanded(false)
		}

		try {
			const response = await request('/api/notes', 'POST', {...data, archived, note}, {
				Authorization: `Bearer ${token}`
			})

			console.log(response.note)

			if (response.message) {
				toast.dark(response.message)
			}

			if (!archived) {
				addNote({...response.note, ...note})
			}

			setNote(notePortrait)
			reset({text: '', title: ''})
			setFormExpanded(false)
		} catch (e) {}
	}

	const toggleTag = (_, tag) => {
		let tags

		if (isObjectInArray(note.tags, tag)) {
			tags = note.tags.filter(item => item.tagId._id !== tag._id)
		} else {
			tags = [{tagId: tag}, ...note.tags]
		}

		setNote(prev => ({...prev, tags}))
	}

	const updateColor = (_, color) => setNote(prev => ({...prev, color}))

	return (
		<div className={`note card w-75 ${note.color} border border-secondary shadow-sm mx-auto mb-5 ${formExpanded ? 'p-2' : ''}`}>
			<form>
				<Input
					type="text"
					name="title"
					label="Введіть заголовок"
					innerRef={register}
					actions={{onClick: () => setFormExpanded(true)}}
				/>
				{formExpanded &&
					<Textarea
						name="text"
						label="Нотатка..."
						styles={['mt-3']}
						innerRef={register}
					/>
				}
			</form>
			{formExpanded &&
			<>
				{note.tags.length !== 0 &&
					<div className="flex mt-3">
						{note.tags.map(tag =>
							<span
								key={tag.tagId?._id}
								className="align-self-start badge rounded-pill bg-transparent border me-2 mt-2"
							>{tag.tagId?.title}</span>
						)}
					</div>
				}
				<div className="d-flex align-items-center justify-content-between mt-3">
					<div className="flex-grow-1 d-flex">
						<div className="dropdown">
							<button
								className="btn btn-warning"
								data-bs-toggle="dropdown"
								aria-expanded="false"
								data-tip="Змінити колір"
							>
								<i className="bi bi-palette d-flex align-items-center"></i>
							</button>
							<ReactTooltip effect="solid"/>
							<ColorPicker note={note} updateColor={updateColor}/>
						</div>
						<Button
							tooltip="Архівувати"
							spaces={['ms-2']}
							actions={{onClick: () => submitHandler(true)}}
						>
							<i className="bi bi-archive d-flex align-items-center"></i>
						</Button>
						<div className="dropdown ms-2">
							<button
								className="btn btn-warning"
								data-bs-toggle="dropdown"
								aria-expanded="false"
								data-tip="Змінити колір"
							>
								<i className="bi bi-tag d-flex align-items-center"></i>
							</button>
							<ReactTooltip effect="solid"/>
							<TagPicker note={note} tags={tags} toggleTag={toggleTag}/>
						</div>
						<ReactTooltip effect="solid"/>
						<Button tooltip="В вигляді списку" spaces={['ms-2']}>
							<i className="bi bi-list-task d-flex align-items-center"></i>
						</Button>
						<ReactTooltip effect="solid"/>
					</div>
					<Button
						color="outlineLight"
						size="sm"
						actions={{onClick: () => submitHandler()}}
					>Закрити</Button>
				</div>
			</>
			}
		</div>
	)
}
