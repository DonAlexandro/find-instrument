import React, {useEffect, useState} from 'react'
import {DefaultInput, InputGroup} from './Input'

export const TagPicker = ({tags, toggleTag, note}) => {
	const [localTags, setLocalTags] = useState([])

	useEffect(() => {
		setLocalTags(tags)
	}, [tags, setLocalTags])

	const tagSearch = async event => {
		const {value} = event.target

		if (!value.length) return setLocalTags(tags)

		setLocalTags(tags.filter(tag => tag.title.toLowerCase().includes(value.toLowerCase())))
	}

	const isObjInArr = (title) => {
		return note.tags.some(tag => tag.tagId.title === title)
	}

	return (
		<ul className="dropdown-menu dropdown-menu-dark tag-picker">
			<li><h6 className="dropdown-header">Додати ярлик</h6></li>
			<li className="pb-2 px-3">
				<InputGroup size="sm">
					<DefaultInput
						type="text"
						label="Введіть назву ярлика"
						name="title"
						actions={{onChange: tagSearch}}
					/>
				</InputGroup>
			</li>
			{localTags.map(tag =>
				<li key={tag._id}>
					<div className="dropdown-item">
						<div className="form-check" onClick={() => toggleTag(note._id, tag)}>
							<input
								className="form-check-input"
								type="checkbox"
								id={`tag-${tag._id}`}
								checked={isObjInArr(tag.title)}
								onChange={() => {}}
							/>
							<label className="form-check-label" htmlFor={`tag-${tag._id}`}>
								{tag.title}
							</label>
						</div>
					</div>
				</li>
			)}
		</ul>
	)
}
