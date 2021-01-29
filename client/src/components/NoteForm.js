import React, {useContext, useEffect, useState} from 'react'
import {Input, Textarea} from './Input'
import {Button} from './Button'
import ReactTooltip from 'react-tooltip'
import {useForm} from 'react-hook-form'
import {toast} from 'react-toastify'
import {useHttp} from '../hooks/http'
import {AuthContext} from '../context/authContext'

export const NoteForm = ({addNote}) => {
	const [formExpanded, setFormExpanded] = useState(false)

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
			return setFormExpanded(false)
		}

		try {
			const response = await request('/api/notes', 'POST', {...data, archived}, {
				Authorization: `Bearer ${token}`
			})

			if (response.message) {
				toast.dark(response.message)
			}

			if (!archived) {
				addNote(response.note)
			}

			setFormExpanded(false)
			reset({text: '', title: ''})
		} catch (e) {}
	}

	return (
		<div className={`card w-75 bg-dark border border-secondary shadow-sm mx-auto mb-5 ${formExpanded ? 'p-2' : ''}`}>
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
			<div className="d-flex align-items-center justify-content-between mt-3">
				<div className="flex-grow-1">
					<Button tooltip="Змінити колір">
						<i className="bi bi-palette d-flex align-items-center"></i>
					</Button>
					<ReactTooltip effect="solid"/>

					<Button
						tooltip="Архівувати"
						spaces={['ms-2']}
						actions={{onClick: () => submitHandler(true)}}
					>
						<i className="bi bi-archive d-flex align-items-center"></i>
					</Button>
					<ReactTooltip effect="solid"/>

					<Button tooltip="Додати ярлик" spaces={['ms-2']}>
						<i className="bi bi-tag d-flex align-items-center"></i>
					</Button>
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
			}
		</div>
	)
}
