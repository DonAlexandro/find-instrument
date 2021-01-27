import React from 'react'

export const Loader = () => {
	return (
		<div className="preloader-wrapper">
			<div className="spinner-border text-warning" role="status">
				<span className="visually-hidden">Loading...</span>
			</div>
		</div>
	)
}
