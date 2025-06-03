import React from 'react'
import Modal from '../../../helpers/Modal'
import TestCreationForm from '../../admin_sections/TestCreationForm'

const TestCreationModal = ({mode, onClose, testData}) => {
  return (
    <Modal onClose={onClose}>
      <TestCreationForm mode={mode} onClose={onClose} testData={testData}/>
    </Modal>
  )
}

export default TestCreationModal