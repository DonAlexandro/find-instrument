const objectToString = (obj) => {
	return JSON.stringify(obj)
}

export const isObjectInArray = (arr, obj) => {
	return arr.some(item => objectToString(item.tagId) === objectToString(obj))
}

export const removeObjectFromArr = (arr, id) => {
	return arr.filter(item => item._id !== id)
}

export const addObjectToPosition = (arr, obj, pos) => {
	arr.splice(pos, 0, obj)
	arr.splice(pos + 1, 1)

	return arr
}

export const updateObject = (arr, id, data) => {
	const idx = arr.findIndex(item => item._id === id)
	const newNote = {...arr[idx], ...data}

	return {idx, newNote}
}
