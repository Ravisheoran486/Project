import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'
import Shifts from './components/Shifts.js';
let name = {
  data: [
    {
      "name": "Helsinki",
    },
    {
      "name": "Tampere",
    },
    {
      "name": "Turku",
    },

  ]
}

function App() {
  var today = new Date();
  const [hArea, sethArea] = useState(1);

  console.log(String(today).split(" ")[2])
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = String(today.getFullYear());
  const [myShift, setmyShift] = useState(true);
  const [appEntries, setappEntries] = useState({})
  const activeStyle = 'text-2xl mr-[50px] text-[#004FB4] '
  const inactiveStyle = 'text-2xl mr-[50px] text-[CBD2E1]'
  const [Area, setArea] = useState("Helsinki")
  function ApiCall() {

    var data = {
      "entry": []
    }
    let idList = []
    let dayList = []
    let inTimeList = []
    let outTimeList = []
    let nameList = []
    let bookingList = []
    let startTimeList = []
    let endTimeList = []
    fetch('http://127.0.0.1:8080/shifts')
      .then((response) => response.json())
      .then((res) => {
        res.sort((a, b) => a.startTime - b.startTime)

        for (let i = 0; i < res.length; i++) {
          let startDate = new Date(0)
          startDate.setUTCSeconds(res[i].startTime / 1000);
          let endDate = new Date(0)
          endDate.setUTCSeconds(res[i].endTime / 1000)
          console.log("gjhkjh", (String(startDate.getHours()).length === 1 ? ("0" + String(startDate.getHours())) : String(startDate.getHours())) + ":" + String(startDate.getMinutes()).length == 0 ? "00" : String(startDate.getMinutes()))
          let inTime = (String(startDate.getHours()).length === 1 ? ("0" + String(startDate.getHours())) : String(startDate.getHours())) + ":" + (String(startDate.getMinutes()).length == 1 ? "00" : String(startDate.getMinutes()))

          let outTime = (String(endDate.getHours()).length === 1 ? ("0" + String(endDate.getHours())) : String(endDate.getHours())) + ":" + (String(endDate.getMinutes()).length == 1 ? "00" : String(endDate.getMinutes()))

          let day
          if (String(startDate.getDate()) == dd && String(startDate.getMonth()) == mm && String(startDate.getFullYear()) == yyyy)
            day = "Today"
          else if (String(startDate.getDate() - 1) == dd && String(startDate.getMonth()) == mm && String(startDate.getFullYear()) == yyyy)
            day = "Tomorrow"
          else
            day = String(startDate.toLocaleString('default', { month: 'long' })) + " " + String(startDate.getDate())
          let name = res[i].area
          idList.push(res[i].id)
          startTimeList.push(res[i].startTime)
          endTimeList.push(res[i].endTime)
          dayList.push(String(day))
          inTimeList.push(inTime)
          outTimeList.push(outTime)
          let j
          for (j = i; j >= 0; j--) {
            if (res[i].area == res[j].area && i != j && bookingList[j] != "overlapped") {
              break
            }

          }
          if (j > 0 && res[i].startTime >= res[j].startTime && res[i].startTime < res[j].endTime)
            bookingList.push("overlapped")
          else
            bookingList.push(!res[i].booked)
          nameList.push(name)
            



        }
        let entries = {
          "entry": []
        }
        let listSize = idList.length;
        for (let i = 0; i < listSize; i++) {
          let singleEntry = {
            "id": idList[i],
            "inTime": inTimeList[i],
            "outTime": outTimeList[i],
            "name": nameList[i],
            "booked": bookingList[i],
            "startTime": startTimeList[i],
            "endTime": endTimeList[i]
          }

          if (entries.entry.find((item) => item.day == dayList[i])) {

            entries.entry[entries.entry.findIndex((item) => item.day == dayList[i])].schedule.push(singleEntry)
          }
          else {
            entries.entry.push({
              "day": dayList[i],
              "schedule": [singleEntry]
            })
          }

        }
        setappEntries(entries)

      }
      )

  }
  let data = appEntries.entry;
  let counting = [0, 0, 0];
  if (!myShift) {

    for (let i = 0; i < data?.length; i++) {


      for (let j = 0; j < data[i].schedule?.length; j++) {

        if (data[i].schedule[j].booked != "overlapped") {
          if (data[i].schedule[j].name == "Helsinki") {
            counting[0] = counting[0] + 1;
          }
          else if (data[i].schedule[j].name == "Tampere") {
            counting[1] = counting[1] + 1;
          }
          if (data[i].schedule[j].name == "Turku") {
            counting[2] = counting[2] + 1;
          }

        }

      }

    }
  }



  function callApi() {
    ApiCall()
  }
  useEffect(() => {
    callApi()

  }, [])


  return (
    <div className="w-full h-full p-[100px]">
      <div className='pl-[26px] mb-[10px] bg-white border-b-black '>
        <span className={myShift ? activeStyle : inactiveStyle} onClick={() => {
          !myShift ? setmyShift(!myShift) : console.log(myShift);
          callApi();

        }


        }>My Shifts</span>
        <span className={!myShift ? activeStyle : inactiveStyle} onClick={() => {
          myShift ? setmyShift(!myShift) : console.log(myShift);
          callApi();
        }

        }>Available Shifts</span>
      </div>

      {!myShift && <div className='border-t-2 border-l-2 border-r-2 flex flex-row space-x-[400px] bg-white pb-[10px] pt-[10px]'>

        <span className='ml-[60px] m-[10px]' style={{ color: hArea == 1 ? "#004FB4" : "#A4B8D3" }} onClick={() => {
          setArea("Helsinki");
          sethArea(1);
        }}>Helsinki({counting[0]})</span>
        <span className='ml-[60px] m-[10px]' style={{ color: hArea == 2 ? "#004FB4" : "#A4B8D3" }} onClick={() => {
          setArea("Tampere");
          sethArea(2);
        }}>Tampere({counting[1]})</span>
        <span className='ml-[60px] m-[10px]' style={{ color: hArea == 3 ? "#004FB4" : "#A4B8D3" }} onClick={() => {
          setArea("Turku");
          sethArea(3);
        }}>Turku({counting[2]})</span>


      </div>
      }

      <div>
        {!myShift && < Shifts data={appEntries} area={Area} myShifts={myShift} />}
        {myShift && < Shifts data={appEntries} area={Area} myShifts={myShift} />}
      </div>

    </div>
  );
}

export default App;
