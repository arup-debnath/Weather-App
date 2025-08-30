"use client";
import React, { useState, useEffect } from "react";

const Home = () => {
  const [CurrentTemp, setCurrentTemp] = useState("30");
  const [FeelsLike, setFeelsLike] = useState("39");
  const [Wind, setWind] = useState("SSE 12 km/h");
  const [Visibility, setVisibility] = useState("26");
  const [Humidity, setHumidity] = useState("50");
  const [currTime, setcurrTime] = useState("03:25 PM");
  const [currDate, setcurrDate] = useState("THU, JUL 3");
  const [AirQuality, setAirQuality] = useState("EXCELENT");
  const [Low_High_Temp, setLow_High_Temp] = useState(["32", "24"]);
  const [location, setlocation] = useState("Teliamura");
  const [Address, setAddress] = useState("Teliamura, Tripura");
  const [isFocused, setisFocused] = useState(false);
  const [weatherIcon, setweatherIcon] = useState("/Weather/Cloudy.svg");
  let apikey = "e154de42b61f4508b2e92929252206";

  function HandleEnterKey(e) {
    if (isFocused && e.key === "Enter") {
      changeInformation();
    }
  }

  function updateInfo(data) {
    setCurrentTemp(data.current.temp_c);
    setFeelsLike(data.current.feelslike_c);
    setweatherIcon(data.current.condition.icon);
    setWind(`${data.current.wind_dir} ${data.current.wind_kph} km/h`);
    setHumidity(data.current.humidity);
    setVisibility(data.current.vis_km);
    setAddress(`${location}, ${data.location.region}`)

    const dateObj = new Date(data.current.last_updated.replace(" ", "T"));
    const optionsDate = { weekday: "short", month: "short", day: "numeric" };
    setcurrDate(dateObj.toLocaleDateString("en-US", optionsDate).toUpperCase())
    const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: true };
    setcurrTime(dateObj.toLocaleTimeString("en-US", optionsTime))
  }

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

  const changeInformation = async () => {
    let Coordinates = await UpdateCoordinates();
    let res = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apikey}&q=${Coordinates}`
    );
    let data = await res.json();
    console.log(data);
    updateInfo(data);
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="nav w-screen bg-[#1F1F1F] text-white flex justify-center items-center">
          <div className="flex h-15 w-3/5  items-center justify-between px-5">
            <div className="flex gap-2">
              Weather Now {Address} {CurrentTemp}°c{" "}
              <img width={23} src={weatherIcon} alt="" />
            </div>
            <div className="bg-white flex justify-center items-center h-8 px-2 rounded-sm">
              <img width={23} src="/Weather/search.svg" alt="" />
              <input
                type="text"
                onChange={(e) => setlocation(e.target.value)}
                onKeyDown={HandleEnterKey}
                onFocus={() => setisFocused(true)}
                onBlur={() => setisFocused(false)}
                placeholder="Enter location"
                className="h-full focus:outline-none w-[300px] rounded-sm text-black px-2"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex w-3/5 h-40 bg-white rounded-[10px] flex-col">
            <div className="flex justify-between items-center p-5">
              <div>TODAY'S WEATHER</div>
              <b>{currDate}</b>
            </div>
            <div className="border-1 border-gray-200"></div>
            <div className="flex flex-col gap-2 p-5">
              <div className="flex items-center">
                <img width={23} src="/Weather/Rainy SVG.svg" alt="" />
                <div className="ml-2">
                  Considerable cloudiness with occasional rain this afternoon{" "}
                  <b>Hi: {Low_High_Temp[0]}°</b>
                </div>
              </div>
              <div className="flex items-center">
                <img width={23} src="/Weather/Rainy SVG.svg" alt="" />
                <div className="ml-2">
                  Tonight overcast <b>Low: {Low_High_Temp[1]}°</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center ">
          <div className="flex flex-col w-3/5 bg-white rounded-[10px]">
            <div className="flex bg-white justify-between p-5">
              <div>CURRENT WEATHER</div>
              <div>
                <b>{currTime}</b>
              </div>
            </div>
            <div className="border-1 border-gray-200"></div>
            <div className="flex">
              <div className="w-1/2">
                <div className="flex justify-between p-10">
                  <div className="w-1/2 flex justify-center items-center">
                    <img width={125} src={weatherIcon} alt="" />
                  </div>
                  <div className="w-1/2 flex flex-col items-center justify-center">
                    <div className="text-4xl">
                      <b className="text-7xl">{CurrentTemp}°</b>c
                    </div>
                    <div className="text-xl">RealFeel {FeelsLike}°c</div>
                  </div>
                </div>
                <div></div>
              </div>
              <div className="w-1/2 px-5">
                <div className="flex justify-between py-5">
                  <div>Humidity</div>
                  <div>
                    <b>{Humidity}%</b>
                  </div>
                </div>
                <div className="border-1 border-gray-200"></div>
                <div className="flex justify-between py-5">
                  <div>Wind</div>
                  <div>
                    <b>{Wind}</b>
                  </div>
                </div>
                <div className="border-1 border-gray-200"></div>
                <div className="flex justify-between py-5">
                  <div>Visibility</div>
                  <div>
                    <b>{Visibility} km</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
