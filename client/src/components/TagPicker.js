import React, {useCallback, useContext, useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {DefaultInput, InputGroup} from './Input'
import {isObjectInArray} from '../utils/functions'
import {useHttp} from '../hooks/http'
import {AuthContext} from '../context/authContext'

export const TagPicker = ({tags, toggleTag, note}) => {
	const [localTags, setLocalTags] = useState([])
	const [search, setSearch] = useState('')

	const {request, clearError, error} = useHttp()
	const {token} = useContext(AuthContext)

	useEffect(() => {
		toast.error(error)
		clearError()
	}, [error, clearError])

	useEffect(() => {
		setLocalTags(tags)
	}, [tags, setLocalTags])

	const tagSearch = useCallback(() => {
		if (!search.length) return setLocalTags(tags)

		setLocalTags(tags.filter(tag => tag.title.toLowerCase().includes(search.toLowerCase())))
	}, [search, tags])

	useEffect(() => {
		tagSearch()
	}, [search, tagSearch])

	const addTag = async () => {
		if (!search.length) {
			return
		}

		try {
			const response = await request('/api/tags', 'POST', {title: search}, {
				Authorization: `Bearer ${token}`
			})

			toggleTag(note._id, response.tag)
			setLocalTags(([...tags, response.tag]))
			setSearch('')
		} catch (e) {}
	}

	console.log(search.length)

	return (
		<ul className="dropdown-menu dropdown-menu-dark tag-picker">
			<li><h6 className="dropdown-header">Додати ярлик</h6></li>
			<li className="pb-2 px-3">
				<InputGroup size="sm">
					<DefaultInput
						type="text"
						label="Введіть назву ярлика"
						name="title"
						value={search}
						actions={{onChange: e => setSearch(e.target.value)}}
					/>
				</InputGroup>
			</li>
			{localTags.map(tag =>
				<li key={tag._id}>
					<div className="dropdown-item">
						<div className="form-check">
							<input
								className="form-check-input"
								type="checkbox"
								id={`tag-${tag._id}`}
								checked={isObjectInArray(note.tags, tag)}
								onChange={() => toggleTag(note._id, tag)}
							/>
							<label className="form-check-label">
								{tag.title}
							</label>
						</div>
					</div>
				</li>
			)}
			{!search.length || !tags.some(tag => tag.title.toLowerCase() === search.toLowerCase()) &&
				<li><button
					className="dropdown-item"
					onClick={addTag}
				>
					<i className="bi bi-plus"></i> Створити тег <strong>"{search}"</strong>
				</button></li>
			}
		</ul>
	)
}
