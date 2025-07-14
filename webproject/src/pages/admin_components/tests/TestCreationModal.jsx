import React from 'react'
import Modal from '../../../helpers/Modal'
import TestCreationForm from '../../admin_sections/TestCreationForm'

const TestCreationModal = ({ mode, onClose, testData, categoryData }) => {
  return (
    <Modal onClose={onClose}>
      <TestCreationForm
        mode={mode}
        onClose={onClose}
        testData={testData}
        categoryData={categoryData}
      />
    </Modal>
  )
}

export default TestCreationModal
