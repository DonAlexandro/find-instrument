import React, {useContext, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {toast} from 'react-toastify'
import {AuthCard} from '../components/AuthCard'
import {Input} from '../components/Input'
import {Button} from '../components/Button'
import {useHttp} from '../hooks/http'
import {AuthContext} from '../context/authContext'

export const Login = () => {
	const {register, handleSubmit, errors} = useForm()
	const {request, loading, error, clearError} = useHttp()
	const {login} = useContext(AuthContext)

	useEffect(() => {
		toast.error(error)
		clearError()
	}, [error, clearError])

	const submitHandler = async data => {
		try {
			const response = await request('/api/auth/login', 'POST', {...data})
			login(response.token, response.userId)
			toast.dark(response.message)
		} catch (e) {}
	}

	return (
		<AuthCard formLabel="Вхід">
			<form onSubmit={handleSubmit(submitHandler)}>
				<Input
					type="email"
					name="email"
					label="Введіть Email"
					styles={['mb-3']}
					innerRef={register({
						required: 'Введіть, будь ласка, Email',
						pattern: {
							value: /.+@.+\..+/,
							message: 'Введіть коректний Email'
						}
					})}
					error={errors.email?.message}
				/>
				<Input
					type="password"
					name="password"
					label="Введіть пароль"
					styles={['mb-3']}
					innerRef={register({
						required: 'Введіть, будь ласка, пароль',
						minLength: {
							value: 8,
							message: 'Мінімальна довжина паролю - 8 символів'
						}
					})}
					error={errors.password?.message}
				/>
				<div className="d-grid">
					<Button type="submit" disabled={loading}>Увійти</Button>
				</div>
			</form>
			<p className="text-center mb-0 mt-4 fs-7 text-muted">
				Ще не з нами? <Link to="/signup">Худчіш реєструйтеся!</Link>
			</p>
		</AuthCard>
	)
}
