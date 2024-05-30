import Photo from "./Photo";
import { useEffect, useState } from "react";

export default function PhotosList() {
  const [photos, setPhotos] = useState([]);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [page, setPage] = useState(1);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(`http://localhost:3001/photos?page=${page}`);
      const data = await response.json();
      setPhotos(data);
    } catch (err) {
      console.error("error getting", err);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [page]);

  const handleEdit = (photo) => {
    setEditingPhoto(photo);
  };

  const handleUpdate = async (updatedPhoto) => {
    setEditingPhoto(null);
    try {
      await fetch(`http://localhost:3001/photos/${updatedPhoto._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPhoto),
      });
      fetchPhotos();
    } catch (err) {
      console.error("error updating ", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/photos/${id}`, { method: "DELETE" });
      fetchPhotos();
    } catch (err) {
      console.error("error delete", err);
    }
  };
  return (
    <div>
      {editingPhoto ? (
        <Photo
          key={editingPhoto._id}
          photo={editingPhoto}
          onSave={handleUpdate}
        />
      ) : (
        <div>
          <div style={{ display: "flex" }}>
            {photos.map((photo) => (
              <Photo
                key={photo._id}
                photo={photo}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <div>
            <button onClick={() => setPage(page - 1)}>Previous</button>
            <button onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
