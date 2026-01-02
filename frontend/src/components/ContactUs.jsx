import React from 'react'

const ContactUs = () => {
  return (
    <div className='w-screen h-[120px] md:h-[170px] bg-[#f8f8f8] mt-8 flex items-center justify-center flex-wrap gap-4 md:gap-20 py-4 px-5 md:px-8'>
        <div className='flex-shrink-0'>
            <h2 className='font-montserrat font-semibold text-[15px] md:text-[22px] text-center md:text-left'>We’ve Got Your Back</h2>
            <p className='font-montserrat text-gray-500 md:text-sm text-[10px] text-center '>Your satisfaction matters — connect with us through your preferred channel.</p>
        </div>
        <div className=''>
            <h2 className='font-montserrat font-semibold text-[10px] md:text-[16px]'>Phone Support</h2>
            <p className='font-montserrat text-gray-500 md:text-sm text-[10px]'>+971 527994773</p>
        </div>
        <div className=''>
            <h2 className='font-montserrat font-semibold text-[10px] md:text-[16px]'>Whatsapp Support</h2>
            <p className='font-montserrat text-gray-500 md:text-sm text-[10px]'>+971 527994773</p>
        </div>
        <div className=''>
            <h2 className='font-montserrat font-semibold text-[10px] md:text-[16px]'>Email Support</h2>
            <p className='font-montserrat text-gray-500 md:text-sm text-[10px]'>info@blushflowers.ae</p>
        </div>
    </div>
  )
}

export default ContactUs