import React, { useState, useMemo } from 'react';
import { useAppConsumer } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/SearchContainer';
import FormRow from '../FormRow';
import FormRowSelect from '../FormRowSelect';

const SearchContainer = () => {
  const [localSearch, setLocalSearch] = useState('');
  const {
    isLoading,
    handleChange,
    searchStatus,
    statusOptions,
    jobTypeOptions,
    searchType,
    clearFilters,
    sort,
    sortOptions,
  } = useAppConsumer();

  const handleSearch = e => {
    handleChange({ name: e.target.name, value: e.target.value });
  };

  const searchDebounce = () => {
    let timeoutID;
    return e => {
      setLocalSearch(e.target.value);
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        handleChange({ name: e.target.name, value: e.target.value });
      }, 1000);
    };
  };

  const optimizedDebounce = useMemo(() => searchDebounce(), []);

  const handleSubmit = e => {
    e.preventDefault();
    clearFilters();
  };
  return (
    <Wrapper>
      <form className='form'>
        <h4>search form</h4>
        <div className='form-center'>
          {/* search position */}

          <FormRow type='text' name='search' value={localSearch} handleChange={optimizedDebounce} />
          {/* search by status */}
          <FormRowSelect
            labelText='status'
            name='searchStatus'
            value={searchStatus}
            handleChange={handleSearch}
            list={['all', ...statusOptions]}
          />
          {/* search by type */}
          <FormRowSelect
            labelText='type'
            name='searchType'
            value={searchType}
            handleChange={handleSearch}
            list={['all', ...jobTypeOptions]}
          />
          {/* sort */}
          <FormRowSelect name='sort' value={sort} handleChange={handleSearch} list={sortOptions} />
          <button className='btn btn-block btn-danger' disabled={isLoading} onClick={handleSubmit}>
            clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;
