"use client";
import { useEffect, useState } from "react";
export default function Home() {
  let apikey = "e154de42b61f4508b2e92929252206";
  const [TemperatureC, setTemperatureC] = useState(0);
  const [TemperatureF, setTemperatureF] = useState(0);
  const [FeelsLike_c, setFeelsLike_c] = useState(0)
  const [Humudity, setHumudity] = useState(0);
  const [CurrLocation, setCurrLocation] = useState("")
  const [location, setlocation] = useState("Teliamura");

  useEffect(() => {
    let prev = localStorage.getItem("Last_Location");
    if(prev){
      setlocation(prev);
      changeInformation();
    }
  }, [])
  

  useEffect(() => {
    localStorage.setItem("Last_Location", location);
    changeInformation();
  }, [location])
  

  async function UpdateCoordinates() {
    let a = await fetch("./api/geocode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    });
    let loc = await a.json();
    let coords = `${loc.lat},${loc.lon}`;
    return coords;
  }

  function changeInfo(data){
    setCurrLocation(data.location.name);
    setTemperatureC(data.current.temp_c);
    setTemperatureF(data.current.temp_f);
    setHumudity(data.current.humidity);
    setFeelsLike_c(data.current.feelslike_c);
  }

  const changeInformation = async () => {
    let Coordinates = await UpdateCoordinates();
    let res = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apikey}&q=${Coordinates}`
    );
    let data = await res.json();
    changeInfo(data);
    console.log(data);
  };
  return (
    <div className="flex h-screen flex-col gap-5 justify-center items-center">
      <div className="input">
        <input
          type="text"
          placeholder="Enter location"
          onChange={(e) => setlocation(e.target.value)}
          onKeyDown={(e)=> {
            if(e.key === "Enter")
              changeInformation();
            }}
          className="h-10 bg-blue-100 w-80 mr-2 border-black"
        />
        <button
          onClick={changeInformation}
          className="px-5 py-2 rounded bg-blue-400 cursor-pointer hover:bg-blue-300"
        >
          click me
        </button>
      </div>
      <div className="result flex justify-center flex-col w-[450px] gap-2">
        <div className="location flex justify-center">{CurrLocation}</div>
        <div className="row1 flex justify-between">
          <div className="col1 w-30 h-30 border-2 border-black flex flex-col justify-around p-3 items-center">
            <div className="temp">{TemperatureC}</div>
            <div className="info">Celcius</div>
          </div>
          <div className="col2 w-30 h-30 border-2 border-black flex flex-col justify-around p-3 items-center">
            <div className="tempf">{FeelsLike_c}</div>
            <div className="info">Fells Like</div>
          </div>
          <div className="col3 w-30 h-30 border-2 border-black flex flex-col justify-around p-3 items-center">
            <div className="value">{Humudity}</div>
            <div className="info">Humudity</div>
          </div>
        </div>
      </div>
    </div>
  );
}
