import React from 'react'

export const ColorPicker = ({note, updateColor}) => {
	const colors = [
		'primary',
		'success',
		'secondary',
		'danger',
		'warning',
		'info',
		'dark'
	]

	return (
		<ul className="dropdown-menu dropdown-menu-dark color-picker">
			{colors.map(color =>
				<li key={color}>
					<input
						type="checkbox"
						className="btn-check"
						checked={`bg-${color}` === note.color}
						id={`${color}-${note._id}`}
						autoComplete="off"
						readOnly
					/>
					<label
						className={`btn btn-outline-${color} rounded-circle`}
						htmlFor={`${color}-${note._id}`}
						onClick={() => updateColor(note._id, `bg-${color}`)}
					></label>
				</li>
			)}
		</ul>
	)
}
