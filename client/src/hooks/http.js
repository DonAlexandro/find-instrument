import {useCallback, useState} from 'react'

export const useHttp = () => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const request = useCallback(async (path, method = 'GET', body = null, headers = {}) => {
		setLoading(true)

		try {
			if (body) {
				body = JSON.stringify(body)
				headers['Content-Type'] = 'application/json'
			}

			const response = await fetch(path, {method, body, headers})
			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.message || 'Щось пішло не так')
			}

			setLoading(false)

			return data
		} catch (e) {
			setLoading(false)
			setError(e.message)
			throw e
		}
	}, [])

	const clearError = useCallback(() => setError(null), [])

	return {request, error, loading, clearError}
}
