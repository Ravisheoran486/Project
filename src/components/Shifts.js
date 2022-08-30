import React from 'react'
import { useState } from 'react'
import Button from './Button';
function Shifts(entries) {




    let entry = { ...entries.data }


    let myShift = entries.myShifts;
    console.log("hjjksh", entry)
    let shiftNumber = []
    let timeArray = []
    let data = entry.entry

    if (myShift) {

        for (let i = 0; i < data?.length; i++) {

            let count = 0
            let time = 0
            for (let j = 0; j < data[i].schedule?.length; j++) {
                if (data[i].schedule[j].booked === false) {
                    count++;
                    time += data[i].schedule[j].endTime - data[i].schedule[j].startTime

                }

            }
            let hourtime = parseInt(time / 1000 / 60 / 60) != 0 ? String(parseInt(time / 1000 / 60 / 60) + "h") : ""
            let mintime = parseInt((time / 1000 / 60) % 60) != 0 ? String(parseInt((time / 1000 / 60) % 60) + "m") : ""

            timeArray.push(hourtime + " " + mintime)
            shiftNumber.push(count)
        }
    }
    console.log(shiftNumber, timeArray)

    var today = new Date()

    const [Booked, setBooked] = useState(false)



    function bookingApi(res, item) {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "id": item.id,
                "booked": res,
                "area": item.name,
                "startTime": item.startTime,
                "endTime": item.endTime
            })
        };
        
        if (res) {
            console.log("njkbkj", "http://127.0.0.1:8080/shifts/" + String(item.id) + "/book")
            fetch("http://127.0.0.1:8080/shifts/" + String(item.id) + "/book", requestOptions)
                .then((res) => res.json())
                .then((res) => {
                    console.log("jbkjn", res);
                    
                })

        }
        else {
            fetch("http://127.0.0.1:8080/shifts/" + String(item.id) + "/cancel", requestOptions)
                .then((res) => res.json())
                .then((res) => console.log(res))
        }
    }


    return (

        <div className='border-2' >

            {myShift === false && entry?.entry?.map((items) => {
                return (
                    <div >
                        <div className='h-[50px] pt-[10px] ml-2 border-b-2 bg-[#F1F4F8]'>
                            <span className='text-2xl content-center  ml-[20px] text-[#4F6C92] '>{items.day.split(" ")[1] === String(today).split(" ")[2] ? "Today" : parseInt(items.day.split(" ")[1]) === parseInt(String(today).split(" ")[2]) + 1 ? "Tomorrow" : items.day}</span>

                        </div>
                        < div   >
                            {
                                items?.schedule.map((item) => {

                                    if (item.name == entries.area && myShift == false) {

                                        return (
                                            <div className="p-[20px] border-2  flex content-between  justify-between " >
                                                <div className=' '>
                                                    <span  >{item.inTime} - {item.outTime}</span>
                                                </div>
                                                <div className=''>
                                                    <span className=' '>{item.booked ? item.booked === "overlapped" ? "Overlapping" : "" : "Booked"}</span>

                                                </div>

                                                <Button item={item} bookingApi={bookingApi} today={today} Booked={Booked} myshift={myShift} />

                                            </div>
                                        )
                                    }

                                })}




                        </div>


                    </div>
                )
            }




            )
            }

            {myShift === true && entry?.entry?.map((items, index) => {
                console.log("hjgdjk", items.day.split(" ")[1], String(today).split(" ")[2]);
                return (
                    <div >
                        {shiftNumber[index] !== 0 && <div className='border-b-2 bg-[#F1F4F8] '>
                            <span className='text-2xl ml-[20px] text-[#4F6C92]'>{items.day.split(" ")[1] === String(today).split(" ")[2] ? "Today" : parseInt(items.day.split(" ")[1]) === parseInt(String(today).split(" ")[2]) + 1 ? "Tomorrow" : items.day}</span>
                            <span className='ml-[20px] text-sm text-[#A4B8D3]'>{shiftNumber[index]} shifts,    {timeArray[index]}</span>


                        </div>}
                        <div >
                            {items?.schedule?.map((item) => {
                                
                                if (item.booked === false)

                                    return (
                                        <div className=' border-b-2 p-[20px] flex justify-between '>
                                            <div className=' flex flex-col '>
                                                <span className='  text-[#4F6C92]'>{item.inTime}-{item.outTime}</span>

                                                <span className='text-[#CBD2E1] ml-[15px]'>{item.name}</span> </div>

                                              <div className='justify-end'> <Button item={item} bookingApi={bookingApi} today={today} Booked={Booked} myshift={myShift} /></div>



                                        </div>


                                    )

                            })}
                        </div>

                    </div>
                )
            })


            }

            <br />
            <br />
            <br />
            <br />


        </div>)

}


export default Shifts