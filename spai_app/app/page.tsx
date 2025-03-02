'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(`Failed to analyze image: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Skin Disease Analysis</h1>
        
        <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer flex flex-col items-center justify-center h-40"
              >
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      className="object-contain"
                      fill
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
                  </div>
                )}
              </label>
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!file || isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Image'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-6 p-4 bg-green-50 rounded-md">
              <h2 className="text-xl font-bold mb-2">Analysis Results</h2>
              <div className="space-y-3">
                {Object.entries(result.predictions || {}).map(([disease, probability]) => (
                  <div key={disease} className="flex justify-between">
                    <span className="font-medium">{disease}:</span>
                    <span>{typeof probability === 'number' ? `${(probability * 100).toFixed(2)}%` : String(probability)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}