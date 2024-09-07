import { useState } from "react";
import axios from "axios";

export default function SingleUpload() {
  const [file, setFile] = useState();

  function handleChange(e) {
    setFile(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) {
      return;
    }

    const formData = new FormData();
    // You can pass form directly to FormData instead.
    formData.append("singleFile", file);

    const res = await axios.post(
      "http://localhost:5000/single-upload",
      formData
    );
    console.log(res.data);

    // Reset the form
    e.target.reset();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Single File Upload</h2>
      <input acc type="file" name="singleFile" onChange={handleChange} />
      <button type="submit">Upload</button>
    </form>
  );
}

// You can use 'accept' attribute to define which mimetypes are allowed.
