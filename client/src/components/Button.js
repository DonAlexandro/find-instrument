import React from 'react'

export const Button = ({children, type = 'button', disabled = false, size = 'default', color = 'warning', spaces = [], actions, tooltip = ''}) => {
	const sizes = {
		default: '',
		sm: 'btn-sm'
	}

	const colors = {
		warning: 'btn-warning',
		outlineDark: 'btn-outline-dark',
		outlineSecondary: 'btn-outline-secondary',
		outlineLight: 'btn-outline-light',
		light: 'btn-light'
	}

	const attrs = {
		className: [
			'btn',
			colors[color],
			sizes[size],
			...spaces
		].join(' '),
		onClick: actions?.onClick,
		'data-tip': tooltip,
		type,
		disabled
	}

	return (
		<button {...attrs}>{children}</button>
	)
}
