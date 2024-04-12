import React, { useEffect, useState } from 'react';

const SelectInput = ({ setLocation, options, name, value }) => {
  function handleSelect(e) {
    e.preventDefault();
    setLocation(prevState => ({ ...prevState, [name]: e.target.value }));
  }
  useEffect(()=>{
    if(options.length)
    setLocation(pre=>({...pre,[name]:options[0]}))
  },[options])
  return (
    <label htmlFor={name} className="block">
      {name}:
      {options.length ? (
        <select
          defaultValue={options[0]} // Set the default value to the first option
          placeholder={name}
          onChange={handleSelect}
          disabled={!options.length}
          className="block border relative p-3 w-full max-w-[205px] bg-[hsla(0,0%,97%,1)]"
          name={name}
          id={name}
        >
          {options.map((option, i) => (
            <option className="w-3/5" key={i} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <h1 className="block">loading</h1>
      )}
    </label>
  );
};

export default SelectInput;
