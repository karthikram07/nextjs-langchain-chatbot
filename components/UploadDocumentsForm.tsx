"use client";
import { useState, type FormEvent } from "react";
import DEFAULT_RETRIEVAL_TEXT from "@/data/DefaultRetrievalText";
import { UploadDropzone } from "@bytescale/upload-widget-react";
import { CircleLoader } from "react-spinners";

const fileUploadOptions = {
  apiKey: "public_FW25bsZEKUcqcfNhTJP4nkeWBcQi", // This is your API key.
  maxFileCount: 1,
  showFinishButton: true, // Note: You must use 'onUpdate' if you set 'showFinishButton: false' (default).
  styles: {
    colors: {
      primary: "#377dff"
    }
  },
  mimeTypes: ["application/pdf"],
  multi: false,
  locale: {
    finishBtn: "Ingest"
  }
};

export function UploadDocumentsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [document, setDocument] = useState(DEFAULT_RETRIEVAL_TEXT);
  const ingest = async (url: string) => {
    setIsLoading(true);
    const response = await fetch("/api/retrieval/ingest", {
      method: "POST",
      body: JSON.stringify({
        url
      })
    });
    if (response.status === 200) {
      setDocument("Uploaded!");
    } else {
      const json = await response.json();
      if (json.error) {
        setDocument(json.error);
      }
    }
    setIsLoading(false);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-12">
      <div className="flex space-x-2">
        <CircleLoader size={20} />
        Ingesting data. Please wait!
      </div>
    </div>
  );

  if (!isLoading && document === "Uploaded!") return (
    <div className="flex items-center justify-center h-12">
      <div className="flex space-x-2">
        Data ingestion successful. You can now query the data.
      </div>
    </div>
  );


  return (
    <>
      <UploadDropzone
        options={fileUploadOptions}
        onComplete={async files => {
          if (!files?.length) return;

          if (files[0]?.fileUrl) {
            await ingest(files[0].fileUrl);
          }

        }}
        width="600px"
        height="375px"
      />
    </>
  );
}