import React, { useState } from "react";

const Photo = ({ photo, onEdit, onDelete, onSave }) => {
  const [title, setTitle] = useState(photo.title);
  const [description, setDescription] = useState(photo.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...photo, title, description });
  };

  return (
    <div style={{  border: "1px solid black", padding: "20px" }}>
      <img src={`http://localhost:3001/${photo.path}`} alt={photo.title} style={{ width: "100%" }} />
      {onEdit ? (
        <div>
          <h3>{photo.title}</h3>
          <p>{photo.description}</p>
          <button onClick={() => onEdit(photo)}>Edit</button>
          <button onClick={() => onDelete(photo._id)}>Delete</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button type="submit">Save</button>

        </form>
      )}
    </div>
  );
};

export default Photo;
