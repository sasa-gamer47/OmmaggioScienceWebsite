"use client";

import { useCallback, Dispatch, SetStateAction, useState, useEffect } from 'react'
import { useDropzone } from '@uploadthing/react/hooks'
import { generateClientDropzoneAccept } from 'uploadthing/client'

import { Reorder } from "framer-motion"

import { Button } from '@/components/ui/button'
import { convertFileToUrl } from '@/lib/utils'

type FileUploaderProps = {
  onFieldChange: (urls: string[]) => void
  imageUrls: string[]
  setFiles: Dispatch<SetStateAction<File[]>>
}

export function FileUploader({
  imageUrls,
  onFieldChange,
  setFiles,
  setSortedImageUrls,
  setStaticImageUrls,
}: FileUploaderProps & any) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      // Convert all files to URLs and pass the array to onFieldChange
      onFieldChange(acceptedFiles.map((file) => convertFileToUrl(file)));
    },
    [setFiles, onFieldChange]
  );

  let tempImageUrls: { url: string; index: number }[] = [];

  // const [items, setItems] = useState(imageUrls || ['1', '2', '3', '4'])
  const [items, setItems] = useState<string[]>([]);
  // Function to handle the drag over

  useEffect(() => {
  

    
    
    setItems(imageUrls);
  }, [imageUrls]);

  useEffect(() => {
    tempImageUrls = imageUrls && imageUrls.map((url: string, i: number) => ({
      url,
      index: i,
    }));

  }, [items, imageUrls])

    useEffect(() => {
    let sortedImageUrls: { url: string; index: number }[] = [];

      // console.log(tempImageUrls);
      
      
    items && items.forEach((url: string) => {
      // console.log(url);
      
      for (let i = 0; i < tempImageUrls.length; i++) {
        // console.log(tempImageUrls[i].url, url);
        
        if (tempImageUrls[i].url === url) {
          sortedImageUrls.push({ url, index: i });
          break
        }
      }
      

      // sortedImageUrls.push({ url, index });
    });
      // console.log(sortedImageUrls);
      setSortedImageUrls(sortedImageUrls);
      setStaticImageUrls(tempImageUrls);
  }, [items])


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image/*"]),
    multiple: true, // Allow multiple files to be dropped
  });

  return (
    <div>
      <div>
        {imageUrls && imageUrls.length > 0 && (
          <div>
            {items && (
              <Reorder.Group
                values={items}
                onReorder={setItems}
                axis="x"
                className="p-2 flex items-center justify-center w-full rounded-lg bg-base-200"
              >
                {items.map((item, index) => (
                  <Reorder.Item
                    className="p-2 bg-base-100 flex items-center justify-center w-full mx-2 rounded-lg"
                    key={item}
                    value={item}
                  >
                    <img
                      draggable="false"
                      src={item}
                      alt={`image ${item}`}
                      className="w-9/12"
                    />
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
          </div>
        )}
      </div>

      <div
        {...getRootProps()}
        className="flex-center bg-dark-3 flex cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50"
      >
        <input {...getInputProps()} className="cursor-pointer" />

        <div className="flex-center flex-col py-5 text-base-content bg-base-200">
          <img
            src="/assets/icons/upload.svg"
            width={77}
            height={77}
            alt="file upload"
          />
          <h3 className="mb-2 mt-2">Drag photos here</h3>
          <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
          <Button type="button" className="rounded-full">
            Select from computer
          </Button>
        </div>
      </div>
    </div>
  );
}
