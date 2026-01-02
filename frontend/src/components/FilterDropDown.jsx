import React, { useState } from 'react'
import { MdKeyboardArrowDown } from "react-icons/md";

const FilterDropDown = ({ title, option, onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState([])

    const handleCheckBoxChange = (opt) => {
        let updatedOptions;
        if (selectedOptions.includes(opt)) {
            updatedOptions = selectedOptions.filter(item => item !== opt)
        } else {
            updatedOptions = [...selectedOptions, opt]
        }
        setSelectedOptions(updatedOptions)
        onFilterChange(title, updatedOptions)
    }

    return (
        <div>
            <h3 className='font-medium sm:text-[16px] text-xs flex justify-between rounded-[8px] mt-4 items-center hover:bg-[#f2efef] text-gray-500 transition duration-300 ease-in-out px-2 py-2 cursor-pointer active:scale-95  border-b border-[#f3f3f4]' onClick={() => setIsOpen(!isOpen)}>
                {title}
                <MdKeyboardArrowDown className={`sm:text-2xl text-xl transition duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
            </h3>
            {
                isOpen && (
                    <div className='my-2'>
                        {
                            option.map((opt, index) => (
                                <label key={index} className='flex items-center gap-2 cursor-pointer px-2 py-2 mt-2 font-montserrat'>
                                    <input type='checkbox'
                                        onChange={() => handleCheckBoxChange(opt)}
                                        checked={selectedOptions.includes(opt)}
                                        className='peer absolute w-0 h-0 opacity-0' />
                                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-gray-400 flex items-center justify-center transition-colors duration-300 peer-checked:bg-[#b89bff]">
                                        <span className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300"></span>
                                    </span>
                                    <span className='text-sm'>{opt}</span>
                                </label>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}

export default FilterDropDown