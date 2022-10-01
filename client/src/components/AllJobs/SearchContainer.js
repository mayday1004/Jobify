import React from 'react';
import { useAppConsumer } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/SearchContainer';
import FormRow from '../FormRow';
import FormRowSelect from '../FormRowSelect';

const SearchContainer = () => {
  const {
    isLoading,
    search,
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
    if (isLoading) return;
    handleChange({ name: e.target.name, value: e.target.value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    clearFilters();
  };
  return (
    <Wrapper>
      <form className='form' onClick={handleSubmit}>
        <h4>search form</h4>
        <div className='form-center'>
          <FormRow type='text' name='search' value={search} handleChange={handleSearch} labelText='Search' />
          <FormRowSelect
            list={['all', ...statusOptions]}
            name='searchStatus'
            value={searchStatus}
            handleChange={handleSearch}
            labelText='Status'
          />
          <FormRowSelect
            list={['all', ...jobTypeOptions]}
            name='searchType'
            value={searchType}
            handleChange={handleSearch}
            labelText='Type'
          />
          <FormRowSelect
            list={sortOptions}
            name='sort'
            value={sort}
            handleChange={handleSearch}
            labelText='Sort'
          />
          <button className='btn btn-block btn-danger' disabled={isLoading} onClick={handleSubmit}>
            clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;
