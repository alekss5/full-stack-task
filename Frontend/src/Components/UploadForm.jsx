import { useState } from "react";

export default function UploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !file) {
      setError("Missing data");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("photo", file);

    try {
      await fetch("http://localhost:3001/photos", {
        method: "POST",
        body: formData,
      });

      setTitle("");
      setDescription("");
      setFile(null);
      setError("");
    } catch (err) {
      setError("error saving");
    }
  };
  return (
    <form onSubmit={handleSubmit} >
      {error && <h1>{error}</h1>}
      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label>Photo</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <button type="submit">Save</button>
    </form>
  );
}
