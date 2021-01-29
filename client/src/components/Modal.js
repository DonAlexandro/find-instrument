import React from 'react'

export const Modal = ({children, size = 'default', id}) => {
	const sizes = {
		sm: 'modal-sm',
		default: ''
	}

	return (
		<div className="modal" id={id}>
			<div className={`modal-dialog ${sizes[size]} modal-dialog-centered`}>
				<div className="modal-content bg-dark shadow-sm">
					{children}
				</div>
			</div>
		</div>
	)
}

export const ModalHeader = ({children}) => {
	return (
		<div className="modal-header text-white">
			<h5 className="modal-title">{children}</h5>
			<button type="button" className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close">
				<i className="bi bi-x d-flex align-items-center"></i>
			</button>
		</div>
	)
}

export const ModalBody = ({children}) => {
	return (
		<div className="modal-body">
			{children}
		</div>
	)
}