import React from 'react'

export const AuthCard = ({children, formLabel}) => {
	return (
		<div className="card mt-5 w-75 mx-auto border-0 overflow-hidden">
			<div className="row">
				<div className="col-lg-6 border-end d-flex justify-content-center align-items-center flex-column auth-intro text-white">
					<h2>Keep Copy</h2>
					<p>Структуруй думки - зміни життя</p>
				</div>
				<div className="col-lg-6 py-4 px-5">
					<h3 className="text-center fw-light mb-4">{formLabel}</h3>
					{children}
				</div>
			</div>
		</div>
	)
}
