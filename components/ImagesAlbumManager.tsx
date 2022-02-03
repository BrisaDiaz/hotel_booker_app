import React from 'react';

import Box from '@mui/material/Box';

import ImageFilter from '@/components/ImageFilter';
import ImageDropZone from '@/components/ImageDropZone';

export default function ImageManager({
  defaultValue,
  onSubmit,
}: {
  defaultValue?: string[];
  onSubmit: (newFiles: File[], defaultFiles?: string[]) => void;
}) {
  const [visuals, setVisuals] = React.useState<{ url: string; name: string }[]>(
    defaultValue
      ? [...defaultValue.map((url) => ({ name: url, url: url }))]
      : []
  );
  const [files, setFiles] = React.useState<File[]>([]);
  const [defaultImgUrls, setDefaultImgUrls] = React.useState<string[]>(
    defaultValue || []
  );

  const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

  const handleFilesUpload = async (e: any) => {
    const currentFilesNames = files.map((file) => file.name);
    const nonDuplicatedFiles = [...e.target.files].filter(
      (file) =>
        !currentFilesNames.includes(file.name) &&
        allowedExtensions.exec(file.name)
    );
    setFiles([...files, ...nonDuplicatedFiles]);

    const readerPromises = nonDuplicatedFiles.map((file) => {
      // Define a new file reader
      const reader = new FileReader();

      // Create a new promise
      return new Promise((resolve) => {
        // Resolve the promise after reading file
        reader.onload = () => resolve({ url: reader.result, name: file.name });
        // Reade the file as a dataUrl
        reader.readAsDataURL(file);
      });
    });

    const newVisuals: any[] = await Promise.all(readerPromises);

    setVisuals([...visuals, ...newVisuals]);
  };

  const handleClear = (mode: 'all' | 'selectedOnly', filesNames?: string[]) => {
    if (mode === 'all') {
      setFiles([]);
      setVisuals([]);
      setDefaultImgUrls([]);
      return;
    }
    if (filesNames) {
      setFiles(files.filter((file) => !filesNames.includes(file.name)));
      setVisuals(visuals.filter((visual) => !filesNames.includes(visual.name)));
      setDefaultImgUrls(
        defaultImgUrls.filter((url) => !filesNames.includes(url))
      );
    }
  };
  const handleResetChanges = () => {
    setFiles([]);
    setVisuals(
      defaultValue
        ? [...defaultValue.map((url) => ({ name: url, url: url }))]
        : []
    );
    setDefaultImgUrls(defaultValue || []);
  };

  const handleSubmit = () => {
    defaultValue ? onSubmit(files, defaultImgUrls) : onSubmit(files);
  };
  return (
    <Box
      component="section"
      sx={{ width: '100%', mx: 'auto', px: { xs: 1, sm: 4 }, my: 4 }}
    >
      <ImageDropZone onChange={handleFilesUpload} />
      <Box sx={{ mt: 2 }}>
        <ImageFilter
          onClear={handleClear}
          images={visuals}
          onReset={handleResetChanges}
          onSave={handleSubmit}
        />
      </Box>
    </Box>
  );
}
