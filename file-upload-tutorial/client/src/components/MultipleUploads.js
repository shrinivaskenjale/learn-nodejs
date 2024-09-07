import { useState } from "react";
import axios from "axios";

export default function MultipleUploads() {
  const [files, setFiles] = useState();

  function handleChange(e) {
    setFiles(e.target.files);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!files) {
      return;
    }

    const formData = new FormData();

    // To upload multiple files, append all File objects to same name in formData.
    for (const file of files) {
      formData.append("multipleFiles", file);
    }

    const res = await axios.post(
      "http://localhost:5000/multiple-uploads",
      formData
    );
    console.log(res.data);

    e.target.reset();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Multiple File Upload</h2>
      <input
        type="file"
        name="multipleFiles"
        onChange={handleChange}
        multiple
      />
      <button type="submit">Upload</button>
    </form>
  );
}
