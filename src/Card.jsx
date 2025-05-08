import './App.css'
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CardList = () => {
  const [blogs, setBlogs] = useState([]);

  const navigate = useNavigate();
  const AddBlogCard =()=>{
    navigate("/addblog");
  }

  // Fetch cards from API
  const fetchBlogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/fetch/blog');
      setBlogs(res.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  // Delete a card by ID
  const handleDelete = async (id) => {
    alert("Blog Deleted Sucessfully")
    await fetchBlogs();
    if (!id) return;

    try {
      await axios.delete(`http://localhost:5000/api/v1/delete/blog/${id}`);
      // await fetchBlogs();
      setBlogs(blogs.filter(blog => blog._id !== id)); 
      alert("Blog Deleted Sucessfully!");
      
      
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
    
  };

  useEffect(() => {
    fetchBlogs();
  }, [handleDelete]);

  return (
    <div className='card-grid'>
    
      <button className='btn' onClick={AddBlogCard}>Add Bog</button>
      {blogs.map((blog) => (
        <div key={blog._id} className='card'>
             <button onClick={() => handleDelete(blog._id)}>Delete</button>
          <h3>{blog.title}</h3>
          <img className='card-img' src={blog.imageUrl} alt={"image"} style={{ width: '400px' ,height:"400px"}} /> 
          <h1>{blog.length}</h1>
         
        </div>
      ))}
    </div>
  );
};

export default CardList;
