"use client";
import axios from "axios";
import Image from "next/image";
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
      formData.append("file", file);

      try {
        const { data } = await axios({
          method: "post",
          url: "/api/what",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        console.log("error uploading file", error);
        fileInput.current.value = null;
      } finally {
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
        />
      </div>
    </div>
  );
}
