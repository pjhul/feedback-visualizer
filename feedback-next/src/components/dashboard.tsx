"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Vizi } from "@/components/scatterChart";
import { JSX, SVGProps, useRef, useState } from "react";
import axios from "axios";

export function Dashboard() {
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
    <div key="1" className="flex flex-col h-screen w-full">
      <header className="flex justify-between items-center h-16 px-4 border-b md:px-6">
        <Link
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
          href="#"
        >
          <IconGear className="w-6 h-6" />
          <span className="sr-only">Settings</span>
        </Link>
        <div>
          <input
            type="file"
            accept="text/csv"
            className="font-medium text-md bg-gray-300 rounded-lg p-1.5"
            onChange={handleSubmit}
            ref={fileInput}
          />
        </div>
        <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
          <Button className="rounded-full" size="icon" variant="ghost">
            <img
              alt="Avatar"
              className="rounded-full"
              height="32"
              src="https://umutyildirim.com/img/profile.webp"
              style={{
                aspectRatio: "32/32",
                objectFit: "cover",
              }}
              width="32"
            />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </div>
      </header>
      <div className="flex h-full">
        <aside className="h-full w-64 border-r p-4">
          <div className="grid gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                htmlFor="temperature"
              >
                Temperature
              </label>
              <Input
                className="mt-1 block w-full"
                id="temperature"
                placeholder="24"
                type="number"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                htmlFor="date-time"
              >
                Date Time
              </label>
              <Input
                className="mt-1 block w-full"
                id="date-time"
                type="datetime-local"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                htmlFor="review"
              >
                Review
              </label>
              <Slider
                className="mt-1 block w-full"
                id="review"
                max={100}
                min={0}
                step={1}
              />
            </div>
          </div>
        </aside>
        <main className="flex-1 p-4">
          <Vizi />
        </main>
        <aside className="w-64 p-4 border-l">
          <h2 className="text-lg font-semibold mb-4">GPT-4 Chat</h2>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptate
            incidunt minus accusamus repellendus adipisci vitae, officia
            aliquam. Corrupti eius magnam molestiae. Vitae, eaque natus?
            Voluptatibus vitae dolorem culpa corporis velit.
          </p>
        </aside>
      </div>
    </div>
  );
}

function IconGear(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  );
}
