"use client";
import { useState } from "react";
import React, { ChangeEvent, FormEvent } from "react";
import axios from "axios";

const UploadForm = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files ? e.target.files[0] : null);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("/api/createpost", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = await response.data;
            console.log(data.status);
            setUploading(false);
        } catch (error) {
            console.log(error);
            setUploading(false);
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <div>Upload Files to S3 Bucket</div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={!file || uploading}>
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            </form>
        </div>
    );
};

export default UploadForm;