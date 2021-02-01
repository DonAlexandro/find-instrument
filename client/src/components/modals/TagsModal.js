import React, {useContext, useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {toast} from 'react-toastify'
import {Modal, ModalBody, ModalHeader} from '../Modal'
import {DefaultInput, InputGroup} from '../Input'
import {useHttp} from '../../hooks/http'
import {AuthContext} from '../../context/authContext'
import {Button} from '../Button'
import {TagItem} from '../TagItem'

export const TagsModal = ({tags}) => {
	const [, setState] = useState()
	const [localTags, setTags] = useState(tags)

	const {token} = useContext(AuthContext)
	const {register, handleSubmit, reset} = useForm()
	const {request, clearError, error, loading} = useHttp()

	useEffect(() => {
		setTags(tags)
	}, [tags, setTags])

	useEffect(() => {
		toast.error(error)
		clearError()
	}, [error, clearError])

	const createTag = async ({title}) => {
		if (!title || !title.length) return

		try {
			const response = await request('/api/tags', 'POST', {title}, {
				Authorization: `Bearer ${token}`
			})

			setTags(prev => ([...prev, response.tag]))
			reset({tagTitle: ''})
		} catch (e) {}
	}

	const editTag = (id, title) => {
		const replace = (arr) => {
			for (let i = 0; i < arr.length; i++) {
				if (arr[i]._id !== id) continue

				arr[i].title = title
				return arr
			}
		}

		setTags(replace(tags))
		setState({})
	}

	const removeTag = async (id) => {
		try {
			await request('/api/tags/remove', 'POST', {id}, {
				Authorization: `Bearer ${token}`
			})

			setTags(prev => prev.filter(tag => tag._id !== id))
		} catch (e) {}
	}

	return (
		<Modal id="tagsModal" size="sm">
			<ModalHeader>Редагування ярликів</ModalHeader>
			<ModalBody>
				<form onSubmit={handleSubmit(createTag)}>
					<InputGroup size="sm">
						<DefaultInput
							type="text"
							name="title"
							label="Створити ярлик"
							innerRef={register}
							disabled={loading}
						/>
						<Button color="outlineLight" type="submit">
							<i className="bi bi-check2"></i>
						</Button>
					</InputGroup>
				</form>
				{tags.length ?
					<ul className="list-group list-group-flush mt-2">
						{localTags.map((tag, idx) =>
							<TagItem
								key={idx}
								tag={tag}
								removeTag={removeTag}
								editTag={editTag}
							/>
						)}
					</ul> :
					<div className="text-muted text-center mt-2 d-flex flex-column tags-empty">
						<i className="bi bi-tags"></i>
						<span className="mt-1">Ярликів немає</span>
					</div>
				}
			</ModalBody>
		</Modal>
	)
}
