import React, { useState } from 'react'
import { useEffect } from 'react'

const DisplayPics = () => {
    const [pics, setPics] = useState([])
    const getPictures = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/photos`, {
                method: "GET"
            }
            )
            const parseRes = await response.json()
            setPics(parseRes)
        } catch (error) {

        }
    }

    useEffect(() => {
        getPictures();
    }, [])
    
    return (
        <div>
            {pics.map( pic => {
                let url = `http://localhost:8000/img/${pic.filename}`
                return <div>
                    <img src={url} class="img-thumbnail" alt="..."></img>
                     </div>
            })}
        </div>
    )
}

export default DisplayPics