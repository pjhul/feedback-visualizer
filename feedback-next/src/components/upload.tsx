"use client";
import axios from "axios";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "@radix-ui/react-icons";
import { data } from "./scatterChart";

export function Upload() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const fileInput = useRef(null);

  const handleSubmit = async (event: any) => {
    setLoading(true);
    const file = fileInput.current.files[0];
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

        if (data) {
          // save data to local storage with name as key
          localStorage.setItem(name, JSON.stringify(data));
          // save name to local storage dont overwrite existing names
          localStorage.setItem("datasets", JSON.stringify([name]));
        }

        if (fileInput.current) {
          (fileInput.current as any).value = ""; // Clear the file input value
        }
      } catch (error) {
        console.log("error uploading file", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Submit new dataset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit new dataset</DialogTitle>
          <DialogDescription>
            Name your new dataset and upload a CSV file. We will take care of
            the rest.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My new dataset"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              File
            </Label>
            <Input
              type="file"
              accept="text/csv"
              className="col-span-3"
              ref={fileInput}
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
