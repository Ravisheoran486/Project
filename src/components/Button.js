import React, { useState } from 'react'
import loading from '../loading.png'
function Button(props) {
    let item = props.item;
    const [buttonState, setbuttonState] = useState(true);
    const [buttontwoState, setbuttontwoState] = useState(true)
    const style1 = " border-solid border-[1px] pl-[20px] pr-[20px] pt-[7px] pb-[7px] rounded-2xl content-end text-[#16A64D] border-[#16A64D]"
    const style2 = ' border-solid border-[1px] pl-[20px] pr-[20px] pt-[7px] pb-[7px] rounded-2xl content-end text-[#E2006A] border-[#E2006A]'
    const style3 = 'border-solid border-[1px] pl-[20px] pr-[20px] pt-[7px] pb-[7px]  rounded-2xl content-end text-[#E2006A] border-[#E2006A]'
    const style4 = 'border-solid border-[1px] pl-[20px] pr-[20px] pt-[7px] pb-[7px] rounded-2xl content-end text-[#EED2DF] border-[#EED2DF]'
    return (
        <div >
            {props.myshift && <button className={buttontwoState?style3:style4}  onClick = {()=> {props.bookingApi(item.booked, item);setbuttontwoState(false)}} >Cancel</button>}
           {!props.myshift && < button className={item.booked?style1:style2} disabled={item.booked === "overlapped" || props.today > item.startTime || props.Booked ? true : false} onClick={() => { props.bookingApi(item.booked, item); setbuttonState(false) }}>{buttonState ? item.booked ? "Book" : "Cancel" : <img className='h-[30px] w-[30px]' src={loading} alt='' />}  </button>}
           
        </div>
    )
}

export default Button