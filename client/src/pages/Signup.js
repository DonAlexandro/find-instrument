import React, {useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {AuthCard} from '../components/AuthCard'
import {Input} from '../components/Input'
import {Button} from '../components/Button'
import {useHttp} from '../hooks/http'
import { toast } from 'react-toastify'

export const Signup = () => {
	const {register, handleSubmit, errors} = useForm()
	const {request, loading, error, clearError} = useHttp()
	const history = useHistory()

	useEffect(() => {
		toast.error(error)
		clearError()
	}, [error, clearError])

	const submitHandler = async data => {
		try {
			const response = await request('/api/auth/signup', 'POST', {...data})
			toast.dark(response.message)
			history.push('/login')
		} catch (e) {}
	}

	return (
		<AuthCard formLabel="Реєстрація">
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
							message: 'Email адрес не зовсім коректний'
						}
					})}
					error={errors.email?.message}
				/>
				<Input
					type="text"
					name="username"
					label="Введіть псевдонім"
					styles={['mb-3']}
					innerRef={register({
						required: 'Введіть, будь ласка, псевдонім',
						minLength: {
							value: 4,
							message: 'Мінімальна довжина псевдоніму - 4 символи'
						}
					})}
					error={errors.username?.message}
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
				<Input
					type="password"
					name="confirm"
					label="Повторіть пароль"
					styles={['mb-3']}
					innerRef={register({
						required: 'Повторіть, будь ласка, пароль'
					})}
					error={errors.confirm?.message}
				/>
				<div className="d-grid">
					<Button type="submit" disabled={loading}>Зареєструватися</Button>
				</div>
			</form>
			<p className="text-center mb-0 mt-4 fs-7 text-muted">
				Вже зареєстровані? <Link to="/login" className="text-warning">Тоді просто увійдіть!</Link>
			</p>
		</AuthCard>
	)
}
