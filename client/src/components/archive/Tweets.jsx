import React, { useEffect, useState } from "react";

const Tweets = ({ setAuth }) => {
    const [tweets, setTweets] = useState([]);
    const [inputs, setInputs] = useState({
        content: "",
    })

    //setting the inputs
    const onChange = e => {    //content     : tweet   
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const { content } = inputs
    const onSubmitForm = async (e) => {
        e.preventDefault()
        try {

            //making a body object from the values of username and password
            const body = { content }

            //fetch api for POST method
            const response = await fetch(
                "http://localhost:8000/tweets",
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem('token')
                       
                    },
                    body: JSON.stringify(body)
                }
            )

            const parseRes = await response.json()
            console.log(parseRes)

        } catch (error) {
            console.log(error.message)
        }
    }

    const getTweets = async () => {
        try {
            //fetch api that uses the GET method
            const response = await fetch(
                "http://localhost:8000/tweets",
                {
                    method: "GET",
                    //retrieving the token and putting it in the Auth header
                    headers: { Authorization: "Bearer " + localStorage.getItem('token') }
                })
            //parsing the json back to a JS object
            const parseRes = await response.json();

            setTweets(parseRes);

        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        // const interval = setInterval(() => {
        //     getTweets();
        //   }, 1000);
        //   return () => clearInterval(interval);
        getTweets();
    }, [])
    return (

        <>
            <h1>Tweets Hello</h1>
            <form onSubmit={onSubmitForm}>
                <div className="form-outline mb-4">
                    <input
                        type="text"
                        id="tweetContent"
                        name="content"
                        className="form-control"
                        value={content}
                        onChange={e => onChange(e)} />
                    <label className="form-label" for="form2Example1">Write your tweets</label>
                </div>
                <button type="submit" className="btn btn-primary btn-block mb-4">Tweets</button>

            </form>
            {tweets.map(tweet => {
                return <div class="card">

                    <div class="card-body">

                        <p class="card-text">{tweet.content}</p>

                    </div>
                </div>
            })}
        </>


    )
}
export default Tweets;