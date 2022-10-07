import React, { useEffect, useState } from "react";

const HeaderUserInfo = () => {
   const [firstname, setFirstname] = useState("SUPER");
   const [lastname, setLastname] = useState("KABAYAN");
   const [country, setcountry] = useState("Unknown Country");

   const getProfile = async () => {

      try {
         const response = await fetch(
            "https://superkabayan.herokuapp.com/account",
            {
               method: "GET",
               //retrieving the token and putting it in the Auth header
               headers: {
                  Authorization: localStorage.getItem('token')
               },
            })

         //parsing the json back to a JS object
         const parseRes = await response.json();
         
         if (parseRes.name !== "JsonWebTokenError") {
            
            !parseRes.firstname ? setFirstname("SUPER") : setFirstname(parseRes.firstname);
            !parseRes.lastname ? setLastname("KABAYAN") : setLastname(parseRes.lastname);
            !parseRes.country_name ? setcountry("Unknown Country") : setcountry(parseRes.country_name);
         }

      } catch (error) {
         console.log(error.message)
      }
   }

   useEffect(() => {
      getProfile();
   }, [])

   return (
      <div className="px-4 text-end">
         <span className="fw-semibold">{firstname.toUpperCase()} {lastname.toUpperCase()}</span><br />
         <span className="fw-normal">{country}</span>
      </div>
   )
};
export default HeaderUserInfo;