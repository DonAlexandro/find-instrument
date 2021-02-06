import React, {useContext, useEffect, useState} from 'react'
import {DefaultInput, Input, InputGroup, Textarea} from './Input'
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
	const listItemPortrait = {title: '', done: false}

	const [formExpanded, setFormExpanded] = useState(false)
	const [note, setNote] = useState(notePortrait)
	const [list, setList] = useState([])
	const [textType, setTextType] = useState(true)

	const {token} = useContext(AuthContext)
	const {register, getValues, reset} = useForm()
	const {request, error, clearError} = useHttp()

	useEffect(() => {
		toast.error(error)
		clearError()
	}, [error, clearError])

	const submitHandler = async (archived = false) => {
		const data = getValues(['title', 'text'])

		const filteredList = list.filter(item => item.title !== '')

		if (!data.title.length && !data.text.length && filteredList.length === 0) {
			setNote(notePortrait)
			return setFormExpanded(false)
		}

		try {
			const body = {
				archived, note,
				title: data.title,
				[textType ? 'text' : 'list']: textType ? data.text : filteredList
			}

			const response = await request('/api/notes', 'POST', body, {
				Authorization: `Bearer ${token}`
			})

			if (response.message) {
				toast.dark(response.message)
			}

			if (!archived) {
				addNote({...response.note, ...note})
			}

			setNote(notePortrait)
			setList([])
			setTextType(true)
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

	const changeNoteType = () => {
		setTextType(prev => !prev)

		if (list.length >= 1) {
			return setList(prev => ([...prev]))
		}

		setList([listItemPortrait])
	}

	const deleteListItem = (idx) => {
		const newList = list.filter((_, index) => index !== idx)

		if (newList.length === 0) {
			return setTextType(true)
		}

		setList(newList)
	}

	return (
		<div className={`note-form card w-75 pale ${note.color} shadow-sm mx-auto mb-5 ${formExpanded ? 'p-2 border border-secondary' : 'border-0'}`}>
			<form>
				<Input
					type="text"
					name="title"
					label="Введіть заголовок"
					innerRef={register}
					actions={{onClick: () => setFormExpanded(true)}}
				/>
				{formExpanded &&
					<>
						<div className={`mt-3 ${!textType ? 'd-block' : 'd-none'}`}>
							{list.map((item, idx) =>
								<InputGroup size="sm" spaces={['mb-2']} key={idx}>
									<DefaultInput
										type="text"
										name="itemTitle"
										label="Пункт..."
										innerRef={register}
										value={item.title}
										actions={{onChange: e => list[idx].title = e.target.value}}
									/>
									<Button
										color="outlineSecondary"
										actions={{onClick: () => deleteListItem(idx)}}
									><i className="bi bi-x"></i></Button>
								</InputGroup>
							)}
							<Button
								color="outlineLight"
								size="sm"
								actions={{onClick: () => setList(prev => ([...prev, listItemPortrait]))}}
							>
								<i className="bi bi-plus"></i> Новий пункт
							</Button>
						</div>
						<div className={!textType ? 'd-none' : 'd-block'}>
							<Textarea
								name="text"
								label="Нотатка..."
								innerRef={register}
								styles={['mt-3']}
							/>
						</div>
					</>
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
								<i className="bi bi-palette d-flex"></i>
							</button>
							<ReactTooltip effect="solid"/>
							<ColorPicker note={note} updateColor={updateColor}/>
						</div>
						<Button
							tooltip="Архівувати"
							spaces={['ms-2']}
							actions={{onClick: () => submitHandler(true)}}
						>
							<i className="bi bi-archive d-flex"></i>
						</Button>
						<div className="dropdown ms-2">
							<button
								className="btn btn-warning"
								data-bs-toggle="dropdown"
								aria-expanded="false"
								data-tip="Змінити колір"
							>
								<i className="bi bi-tag d-flex"></i>
							</button>
							<ReactTooltip effect="solid"/>
							<TagPicker note={note} tags={tags} toggleTag={toggleTag}/>
						</div>
						<ReactTooltip effect="solid"/>
						<Button
							tooltip={`${!textType ? 'Звичайний текст' : 'В вигляді списку'}`}
							spaces={['ms-2']}
							actions={{onClick: changeNoteType}}
						>
							{!textType ?
								<i className="bi bi-card-text d-flex"></i> :
								<i className="bi bi-list-task d-flex"></i>
							}
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
