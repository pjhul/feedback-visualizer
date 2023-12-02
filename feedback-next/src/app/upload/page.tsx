"use client";
import axios from "axios";
import { useRef, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const fileInput = useRef(null);

  const handleSubmit = async (event: any) => {
    setLoading(true);
    const file = event.target.files[0];
    console.log(file);

    if (file) {
      const formData = new FormData();
      formData.append("files", file);

      try {
        const { data } = await axios({
          method: "post",
          url: "http://164.90.153.245/embed",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(data);
      } catch (error) {
        console.log("error uploading file", error);
      } finally {
        if (fileInput.current) {
          (fileInput.current as any).value = ""; // Clear the file input value
        }
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-neutral-900 h-screen flex">
      <div className="m-auto">
        <h1 className="text-yellow-400 text-7xl font-black text-center mb-10">
          Feedback visualiser
        </h1>
        <input
          type="file"
          accept="text/csv"
          className="text-white font-bold text-3xl"
          onChange={handleSubmit}
          ref={fileInput}
          disabled={loading}
        />
      </div>
    </div>
  );
}
