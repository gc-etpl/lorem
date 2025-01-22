"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import { Progress } from "@/components/ui/progress"; // from shadcn/ui
import { Button } from "@/components/ui/button";

// Use a typed interface to represent each row in the CSV
interface CsvRow {
    postId: string;
    id: string;
    name: string;
    email: string;
    body: string;
}

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [parseProgress, setParseProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (!file) {
            alert("Please select a CSV file first.");
            return;
        }

        setMessage("");
        setParseProgress(0);
        setUploading(true);

        // Parse the CSV in the browser
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            step: () => {
                // If you want a more precise progress, you could do a two-pass parse
                // or count lines. For now, let's just do an indeterminate approach.
                setParseProgress((prev) => (prev < 100 ? prev + 1 : prev));
            },
            complete: (results) => {
                // results.data = all parsed rows
                // Step 2: Send them to the server as JSON
                uploadParsedData(results.data as CsvRow[]);
            },
            error: (err) => {
                console.error(err);
                setMessage("Error parsing CSV");
                setUploading(false);
            },
        });
    };

    const uploadParsedData = async (parsedRows: CsvRow[]) => {
        try {
            const res = await fetch("/api/upload-csv-json", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rows: parsedRows }),
            });
            if (res.ok) {
                const data = await res.json();
                setMessage(data.message || "Upload successful!");
            } else {
                const errData = await res.json();
                setMessage(errData.error || "Failed to upload CSV.");
            }
        } catch (error) {
            console.error(error);
            setMessage("An error occurred during upload.");
        } finally {
            setUploading(false);
            setParseProgress(100);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Upload CSV</h1>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <div className="mt-4">
                <Button onClick={handleUpload} disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload CSV"}
                </Button>
            </div>

            {uploading && (
                <div className="my-4">
                    <Progress value={parseProgress} className="w-full" />
                </div>
            )}

            {message && <p className="mt-4">{message}</p>}
        </div>
    );
}
