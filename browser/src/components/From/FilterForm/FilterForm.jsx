import React, { useState, useRef, useEffect } from "react";
import {X} from 'lucide-react'
const FilterForm = ({ filterQuery, setFilterQuery, setFilterFlag  }) => {
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const categories = [
    "T-Shirt",
    "Shoes",
    "Shorts",
    "Shirt",
    "Pants",
    "Other",
    "Top",
    "Outwear",
    "Dress",
    "Body",
    "Longsleeve",
    "Undershirt",
    "Hat",
    "Polo",
    "Blouse",
    "Hoodie",
    "Skip",
    "Blazer",
    "Skirt",
  ];
  const [filteredCategories,setFilteredCategories]=useState([])
  const [isFocused, setIsFocused] = useState(false); // State for focus status
  const inputTextRef = useRef(null);

  function handleCategorySearch(e) {
    setSelectedCategory('')
    const inputValue = e.target.value.toLowerCase();
    setCategorySearch(inputValue); // Update the state immediately
  
    // Check if the input is empty
    if (inputValue === "") {
      setFilteredCategories([
        "T-Shirt",
        "Shoes",
        "Shorts",
        "Shirt",
        "Pants",
        "Other",
        "Top",
        "Outwear",
        "Dress",
        "Body",
        "Longsleeve",
        "Undershirt",
        "Hat",
        "Polo",
        "Blouse",
        "Hoodie",
        "Skip",
        "Blazer",
        "Skirt",
      ]);
      return;
    }
    // Filter categories based on the input value
    const matchedCategories = categories.filter((category) =>
      category.substring(0,inputValue.length).toLowerCase()==inputValue
    );
    setFilteredCategories(matchedCategories);
    if(matchedCategories.length===1&&matchedCategories[0].toLocaleLowerCase()===inputValue.toLowerCase()) setSelectedCategory(matchedCategories[0])

  }
  useEffect(()=>setFilterQuery(pre=>({...pre,category:selectedCategory})),[selectedCategory])  
  function handleSelectCategory(category) {
    setSelectedCategory(category);
    // You may want to update filterQuery or perform other actions here
  }
  function handleChangeMax(e) {
    setFilterQuery(pre=>({...pre,price:{... pre.price,max:e.target.value}}))
  }
  function handleChangeMin(e) {

    setFilterQuery(pre=>({...pre,price:{... pre.price,min:e.target.value}}))
  }
  function handleFocus() {
    setIsFocused(true);
  }

  function handleBlur() {
    setIsFocused(false);
  }

  return (
    <span
      id="filter form"
      className=" rounded-xl absolute shadow-lg bg-white z-50 -bottom-[700%] p-4"
    >
      <span id="price" className="relative flex flex-col gap-3">
        <button onClick={()=>setFilterFlag(false)} className="absolute top-0 right-0">
          <X/>
        </button>
        <h1>price range $</h1>
        <input
          className="focus-visible:bg-white bg-[rgb(238,238,238)] p-1"
          placeholder="max price"
          type="number"
          onChange={handleChangeMax}
          name="max"
          id="max"
        />
        <input
          type="number"
          className="bg-[rgb(238,238,238)] p-1 focus-visible:bg-white"
          placeholder="min price"
          onChange={handleChangeMin}
          name="min"
          id="min"
        />
      </span>
      <span className="relative" id="category">
        <div className="bg-[rgb(143,143,143)] flex flex-col w-full h-[2px] mt-4 "></div>
        <h1>category</h1>
        <input
          ref={inputTextRef}
          onFocus={handleFocus} // Update focus state when input is focused
          onChange={handleCategorySearch}
          className="focus-visible:bg-white bg-[rgb(238,238,238)] p-1"
          type="text"
          list="category"
          name="category"
          id="category"
        />
        {isFocused && ( // Render the dropdown menu only when input is focused
          <span className="absolute bg-white flex flex-col max-h-[200px] overflow-y-scroll left-0">
            {filteredCategories.map((category) => (
              <button
              
                key={category}
                onClickCapture={(e)=>{
                  e.stopPropagation()
                  e.preventDefault()
                  setSelectedCategory(category)
                setIsFocused(false)
              inputTextRef.current.value=category}}
              >
                {category}
              </button>
            ))}
          </span>
        )}
      </span>
    </span>
  );
};

export default FilterForm;
