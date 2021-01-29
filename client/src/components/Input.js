import React from 'react'

const FormWrapper = ({children, styles = [], actions}) => {
	const attrs = {
		className: [
			'form-floating',
			...styles
		].join(' '),
		onClick: actions?.onClick
	}

	return (
		<div {...attrs}>{children}</div>
	)
}

export const Input = ({label, type, name, innerRef, error, actions, styles, disabled}) => {
	return (
		<FormWrapper styles={styles} actions={actions}>
			<input
				className={`form-control ${error ? 'is-invalid' : ''}`}
				type={type}
				id={name}
				name={name}
				placeholder={label}
				ref={innerRef}
				disabled={disabled}
			/>
			<label htmlFor={name}>{label}</label>
			<span className="text-danger fs-7">{error}</span>
		</FormWrapper>
	)
}

export const Textarea = ({styles, actions, error, innerRef, label, name}) => {
	return (
		<FormWrapper styles={styles} actions={actions}>
			<textarea
				className={`form-control ${error ? 'is-invalid' : ''}`}
				placeholder={label}
				id={name}
				name={name}
				ref={innerRef}
			></textarea>
			<label htmlFor={name}>{label}</label>
		</FormWrapper>
	)
}

export const InputGroup = ({size = '', children}) => {
	return (
		<div className={`input-group ${size.length && `input-group-${size}`}`}>
			{children}
		</div>
	)
}

export const DefaultInput = ({type, innerRef, label, name, id, disabled, value}) => {
	return (
		<input
		   	className="form-control"
			type={type}
			id={id}
			name={name}
			placeholder={label}
			ref={innerRef}
			disabled={disabled}
			value={value}
		/>
	)
}
