import React from 'react'
import Modal from '../../../helpers/Modal'
import TestCreationForm from '../../admin_sections/TestCreationForm'

const TestCreationModal = ({onClose}) => {
  return (
    <Modal onClose={onClose}>
        <TestCreationForm onClose={onClose}/>
    </Modal>
  )
}

export default TestCreationModal