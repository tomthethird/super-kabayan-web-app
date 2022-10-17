import React, { useEffect, useState } from 'react'
import { DateTime } from "luxon";
import { IconContext } from "react-icons";
import { FaRegMoon } from "react-icons/fa";
import { ImSun } from "react-icons/im"

const ClockManila = () => {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [meridiem, setMeridiem] = useState("");
    const [night, setnight] = useState(true);

    const getTime = () => {
        const manila = DateTime.now().setZone("Asia/Manila")
        setDate(manila.toFormat("ccc, dd MMM"))
        setTime(manila.toFormat("hh:mm"))
        setMeridiem(manila.toFormat("a"))
        const hour = parseInt(manila.toFormat("H"))

        if (hour >= 6 && hour < 18) {
            setnight(false)
        }
    }

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
                    <h6 className="pb-0 pt-2">MANILA<br />{date}</h6>
                    <h3 className="pt-2 text-light">{time} <small>{meridiem}</small></h3>
                </div>
            ) : (
                <div className="p-4 pb-3 rounded-4" id="goodday">
                    <IconContext.Provider value={{ size: "1.3rem", className:"text-light"}}><ImSun/></IconContext.Provider>
                    <h6 className="pb-0 pt-2">MANILA<br />{date}</h6>
                    <h3 className="pt-2 text-light">{time} <small>{meridiem}</small></h3>
                </div>
            )}

        </>
    )
}

export default ClockManila