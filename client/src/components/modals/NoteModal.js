import React from 'react'
import {Modal, ModalBody, ModalHeader} from '../Modal';

export const NoteModal = ({note}) => {
	return (
		<Modal id="noteModal" size="lg" color={note.color}>
			<ModalHeader>{note.title}</ModalHeader>
			<ModalBody>{note.text}</ModalBody>
		</Modal>
	)
}
