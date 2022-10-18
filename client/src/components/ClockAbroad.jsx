import React, { useEffect, useState } from 'react'
import { DateTime } from "luxon";
import { IconContext } from "react-icons";
import { FaRegMoon } from "react-icons/fa";
import { ImSun } from "react-icons/im"

const ClockAbroad = () => {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [meridiem, setMeridiem] = useState("");
    const [timezone, setTimezone] = useState("")
    const [night, setnight] = useState(true);
    const [countryName, setCountryName] = useState("");

    const getUser = async () => {
        try {
            const response = await fetch("http://localhost:8000/utils/dash", {
                method: 'GET',
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            const parseUser = await response.json();
            if (parseUser.country_code) {
                setTimezone(parseUser.timezone);
                setCountryName(parseUser.country_name.toUpperCase())
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const getTime = () => {
        const abroad = DateTime.now().setZone(timezone)
        setDate(abroad.toFormat("ccc, dd MMM"))
        setTime(abroad.toFormat("hh:mm"))
        setMeridiem(abroad.toFormat("a"))
        const hour = parseInt(abroad.toFormat("H"))

        if (hour >= 6 && hour < 18) {
            setnight(false)
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        const timeOutId = setInterval(() => {
            getTime();
        }, 1000);
        return () => clearTimeout(timeOutId);
    });

    return (
        <>
            {night ? (
                <div className="p-4 pb-3 rounded-4" id="goodnight">
                <IconContext.Provider value={{ size: "1.3rem", className:"text-light"}}><FaRegMoon/></IconContext.Provider>
                <h6 className="pb-0 pt-2">{countryName}<br />{date}</h6>
                    <h3 className="pt-2 text-light">{time} <small>{meridiem}</small></h3>
                </div>
            ) : (
                <div className="p-4 pb-3 rounded-4" id="goodday">
                    <IconContext.Provider value={{ size: "1.6rem", className:"text-white"}}><ImSun/></IconContext.Provider>
                    <h6 className="pb-0 pt-2">{countryName}<br />{date}</h6>
                    <h3 className="pt-2 text-light">{time} <small>{meridiem}</small></h3>
                </div>
            )}

        </>
    )
}

export default ClockAbroad