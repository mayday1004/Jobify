import React from 'react';
import { FormRow, Alert, FormRowSelect } from '../../components';
import { useAppConsumer } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

const AddJob = () => {
  const {
    isEditing,
    showAlert,
    displayAlert,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    handleChange,
    clearValues,
    createJob,
    editJob,
  } = useAppConsumer();

  const handleSubmit = e => {
    e.preventDefault();

    if (!position || !company) {
      displayAlert();
      return;
    }
    if (isEditing) {
      editJob();
      return;
    }
    createJob();
  };

  const handleClear = e => {
    e.preventDefault();
    clearValues();
  };

  const handleJobInput = e => {
    handleChange({ name: e.target.name, value: e.target.value });
  };
  return (
    <Wrapper>
      <form className='form'>
        <h3>{isEditing ? 'edit job' : 'add job'} </h3>
        {showAlert && <Alert />}

        {/* position */}
        <div className='form-center'>
          {/* company */}
          <FormRow type='text' name='company' value={company} handleChange={handleJobInput} />
          <FormRow type='text' name='position' value={position} handleChange={handleJobInput} />
          {/* location */}
          <FormRow
            type='text'
            labelText='location'
            name='jobLocation'
            value={jobLocation}
            handleChange={handleJobInput}
          />
          <>
            {/* job status */}
            <FormRowSelect name='status' value={status} handleChange={handleJobInput} list={statusOptions} />
            {/* job type */}
            <FormRowSelect
              labelText='type'
              name='jobType'
              value={jobType}
              handleChange={handleJobInput}
              list={jobTypeOptions}
            />
          </>
          <div className='btn-container'>
            <button className='btn btn-block submit-btn' type='submit' onClick={handleSubmit}>
              submit
            </button>
            <button className='btn btn-block clear-btn' onClick={handleClear}>
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddJob;
