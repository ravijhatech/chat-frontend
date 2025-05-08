import axios from 'axios';
import React, { useState } from 'react'

function AddBlog() {
    const [title ,setTitle] = useState("");
    const [image , setImage] = useState(null);

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(!image ||!title){
            alert("Please Provide title and image ");
            return;
        }
        const formData = new FormData();
        formData.append("blogtitle",title);
        formData.append("image",image);

        try {
            const rrsponse = await axios.post("http://localhost:5000/api/v1/upload/blog" ,formData,{
               headers:{
                "Content-Type":"multipart/form-data",
               } ,
            });
            alert("Blog Upload Sucessfully");
        } catch (error) {
            alert("Blog Upload Failed");
        }
    }

  return (
    <div>
      <h1>Blog Post</h1>
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Enter Blog Title' value={title} onChange={(e)=> setTitle(e.target.value)}></input>
        <br/>
        <br/>
        <input type="file" accept='image/*' onChange={(e)=> setImage(e.target.files[0])} />
        <button type='submit'> upload</button>
      </form>
    </div>
  )
}

export default AddBlog
