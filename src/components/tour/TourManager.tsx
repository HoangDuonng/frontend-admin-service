'use client';

import { useState, useEffect } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import TourDetailClient from "./TourDetailClient";
import { uploadTour } from '@/services/tourService';
import { message } from 'antd';
import { getTours } from '@/services/tourService';

export default function TourManager() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [tourId, setTourId] = useState("");
    const [uploadedTourId, setUploadedTourId] = useState<string | null>(null);
    const [nextTourId, setNextTourId] = useState('tour01');
    const [embedError, setEmbedError] = useState(false);
    const [type, setType] = useState<'main_banner' | 'explore_tour'>('explore_tour');

    const updateNextTourId = async () => {
        const tours = await getTours();
        const ids = tours.map(t => t.tourId);
        let max = 0;
        ids.forEach(id => {
            const match = id.match(/^tour(\d+)$/);
            if (match) {
                max = Math.max(max, parseInt(match[1], 10));
            }
        });
        const newId = `tour${String(max + 1).padStart(2, '0')}`;
        setNextTourId(newId);
        setTourId(newId);
    };

    useEffect(() => {
        updateNextTourId();
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement> | File) => {
        let file: File | undefined;
        if (event instanceof File) {
            file = event;
        } else {
            file = event.target.files?.[0];
        }
        if (file) {
            const isZip = file.type === 'application/zip' || file.type === 'application/x-zip-compressed' || file.name.toLowerCase().endsWith('.zip');
            if (isZip) {
                setSelectedFile(file);
            } else {
                message.error('Vui lòng chọn file ZIP hợp lệ');
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !title || !description || !tags || !tourId) return;
        setIsUploading(true);
        setUploadProgress(0);
        setUploadedTourId(null);

        try {
            await uploadTour({
                file: selectedFile,
                title,
                description,
                tags,
                tourId,
                type,
                onProgress: setUploadProgress,
            });
            setIsUploading(false);
            setTimeout(() => {
                setUploadedTourId(tourId);
            }, 5000);
            message.success('Upload tour thành công!', 5);
        } catch (e: any) {
            setIsUploading(false);
            message.error(e.message || 'Lỗi khi upload tour!', 5);
        }
    };

    const isFormValid = !!selectedFile && !!title && !!description && !!tags && !!tourId && !isUploading;

    return (
        <div className="p-6 space-y-6">
            <div className="bg-white dark:bg-gray-600 rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Tour 360°</h2>
                <fieldset disabled={isUploading} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            File ZIP <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full h-full dark:bg-gray-800">
                                    {selectedFile ? (
                                        <div className="flex flex-col items-center w-full">
                                            <ArrowUpTrayIcon className="w-8 h-8 text-blue-500 mb-2" />
                                            <p className="text-base font-semibold text-blue-900 mb-1">{selectedFile.name}</p>
                                            <p className="text-xs text-blue-700 mb-2">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                            <button
                                                onClick={e => { e.stopPropagation(); setSelectedFile(null); }}
                                                className="text-red-700 hover:text-red-900 text-xs border border-red-500 rounded px-2 py-1 mt-1"
                                                tabIndex={-1}
                                            >
                                                Xóa file
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <ArrowUpTrayIcon className="w-8 h-8 text-gray-400 mb-2" />
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click để upload</span> hoặc kéo thả file
                                            </p>
                                            <p className="text-xs text-red-500">ZIP (tối đa 500MB)</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".zip"
                                    onChange={handleFileSelect}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên tour <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Nhập tên tour"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ID tour <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                                value={tourId}
                                disabled
                                readOnly
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mô tả <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Nhập mô tả cho tour"
                                rows={2}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tags (cách nhau bởi dấu phẩy) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={tags}
                                onChange={e => setTags(e.target.value)}
                                placeholder="panorama, biển, núi..."
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nơi hiển thị <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={type}
                                onChange={e => setType(e.target.value as 'main_banner' | 'explore_tour')}
                            >
                                <option value="explore_tour">Explore Tour</option>
                                <option value="main_banner">Main Banner</option>
                            </select>
                        </div>
                    </div>

                    {isUploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Đang upload...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!isFormValid}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isUploading ? 'Đang upload...' : 'Upload Tour'}
                    </button>
                </fieldset>
            </div>

            <div className="bg-white dark:bg-gray-600 rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview Tour 360°</h2>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 h-[600px] flex items-center justify-center">
                    {uploadedTourId ? (
                        <>
                            <TourDetailClient tourId={uploadedTourId} />
                            {embedError && (
                                <div className="text-red-500 text-center mt-4">
                                    Lỗi trong quá trình tải lên preview tour. Vui lòng thử lại!
                                </div>
                            )}
                        </>
                    ) : (
                        <span className="text-blue-400 dark:text-gray-500">Tour 360° sẽ hiển thị ở đây sau khi bạn upload thành công!</span>
                    )}
                </div>
                {uploadedTourId && (
                    <div className="flex justify-center mt-4">
                        <button
                            className="px-4 py-2 bg-blue-200 rounded hover:bg-blue-300 text-blue-700"
                            onClick={async () => {
                                setSelectedFile(null);
                                setTitle('');
                                setDescription('');
                                setTags('');
                                setType('explore_tour');
                                setUploadedTourId(null);
                                setUploadProgress(0);
                                setEmbedError(false);
                                await updateNextTourId();
                            }}
                        >
                            Làm mới để upload tour khác
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
} 
