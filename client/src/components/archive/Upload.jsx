import React, { useState } from 'react'

const UploadPhoto = () => {
    const [image, setImage] = useState({})

    const fileOnChange = (e) => {
        setImage(e.target.files[0])
        console.log(image)
    }

    // const sendImage = async () => {
    //     try {

    //         let formData = new FormData()

    //         formData.append("my-image", image)

    //         const newImage = await fetch(`http://localhost:8000/upload`, {
    //             method: "POST",
    //             body: formData
    //         })

    //     } catch (error) {
    //         console.log(error.message)
    //     }
    // }

    return (
        <div>
            <div className="input-group">
                <div className="custom-file">
                    <input type="file" className="custom-file-input" id="inputGroupFile04" onChange={fileOnChange} />
                    {/* <button className="btn btn-outline-primary rounded-pill px-4 my-4" type="button" onClick={sendImage}>Upload</button> */}
                </div>
            </div> 
        </div>
    )
}

export default UploadPhoto;