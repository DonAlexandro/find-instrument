import React, {useContext, useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {toast} from 'react-toastify'
import {Button} from './Button';
import {DefaultInput, InputGroup} from './Input'
import {useHttp} from '../hooks/http'
import {AuthContext} from '../context/authContext'

export const TagItem = ({editTag, removeTag, tag}) => {
	const [editing, setEditing] = useState(false)

	const {token} = useContext(AuthContext)
	const {register, handleSubmit, setValue} = useForm()
	const {request, clearError, error, loading} = useHttp()

	useEffect(() => {
		toast.error(error)
		clearError()
	}, [error, clearError])

	const updateTag = (title) => {
		setEditing(true)
		setValue('title', title)
	}

	const cancelUpdate = () => setEditing(false)

	const submitHandler = async ({id, title}) => {
		if (!title || !title.length) return setEditing(false)

		try {
			await request('/api/tags/update', 'POST', {id, title}, {
				Authorization: `Bearer ${token}`
			})

			editTag(id, title)
			setEditing(false)
		} catch (e) {}
	}

	return (
		<li className="mt-2 list-group-item bg-dark text-white border-0 px-0">
			<div className={`${!editing ? 'd-flex justify-content-between align-items-center' : 'd-none'}`}>
				<span className="text-truncate">{tag.title}</span>
				<div className="d-flex ms-1">
					<Button
						color="outlineLight"
						size="sm"
						spaces={['me-2']}
						actions={{onClick: () => updateTag(tag.title)}}
					>
						<i className="bi bi-pencil-square d-flex align-items-center"></i>
					</Button>
					<Button
						color="outlineLight"
						size="sm"
						actions={{onClick: () => removeTag(tag._id)}}
					>
						<i className="bi bi-trash-fill d-flex align-items-center"></i>
					</Button>
				</div>
			</div>
			<form
				className={`w-100 ${editing ? 'd-block' : 'd-none'}`}
				onSubmit={handleSubmit(submitHandler)}
			>
				<InputGroup size="sm">
					<Button
						color="outlineLight"
						actions={{onClick: cancelUpdate}}
					>
						<i className="bi bi-x"></i>
					</Button>
					<DefaultInput
						type="text"
						name="title"
						innerRef={register}
						disabled={loading}
					/>
					<DefaultInput
						type="hidden"
						name="id"
						value={tag._id}
						innerRef={register}
					/>
					<Button
						color="outlineLight"
						type="submit"
					>
						<i className="bi bi-check2"></i>
					</Button>
				</InputGroup>
			</form>
		</li>
	)
}
