import React from 'react'

export const Button = ({children, disabled, size = 'default', color = 'warning', spaces = [], actions, tooltip = ''}) => {
	const sizes = {
		default: '',
		sm: 'btn-sm'
	}

	const colors = {
		warning: 'btn-warning',
		outlineDark: 'btn-outline-dark',
		outlineSecondary: 'btn-outline-secondary',
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
		disabled: disabled
	}

	return (
		<button {...attrs}>{children}</button>
	)
}
