// "use client";

// import React from 'react';
// import { Banner } from '@/types/banner';
// import Icon from '@/components/icon';

// interface BannerPreviewProps {
//     banner: Banner;
//     onClose: () => void;
// }

// export default function BannerPreview({ banner, onClose }: BannerPreviewProps) {
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//             <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//                 {/* Header */}
//                 <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
//                     <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//                         Xem trước Banner
//                     </h2>
//                     <button
//                         onClick={onClose}
//                         className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                     >
//                         <Icon category="interface" name="close" className="w-6 h-6" />
//                     </button>
//                 </div>

//                 {/* Content */}
//                 <div className="p-6">
//                     {/* Banner Image/Video */}
//                     <div className="mb-6">
//                         {banner.videoUrl ? (
//                             <video
//                                 src={banner.videoUrl}
//                                 controls
//                                 className="w-full h-64 object-cover rounded-lg"
//                                 poster={banner.imageUrl}
//                             >
//                                 Your browser does not support the video tag.
//                             </video>
//                         ) : (
//                             <img
//                                 src={banner.imageUrl}
//                                 alt={banner.title}
//                                 className="w-full h-64 object-cover rounded-lg"
//                                 onError={(e) => {
//                                     const target = e.target as HTMLImageElement;
//                                     target.src = '/images/default.webp';
//                                 }}
//                             />
//                         )}
//                     </div>

//                     {/* Banner Info */}
//                     <div className="space-y-4">
//                         <div>
//                             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                                 {banner.title}
//                             </h3>
//                             {banner.description && (
//                                 <p className="text-gray-600 dark:text-gray-400">
//                                     {banner.description}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                                     Vị trí
//                                 </label>
//                                 <p className="text-gray-900 dark:text-white">
//                                     {banner.position.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                                 </p>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                                     Thứ tự
//                                 </label>
//                                 <p className="text-gray-900 dark:text-white">{banner.order}</p>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                                     Trạng thái
//                                 </label>
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                     banner.isActive 
//                                         ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
//                                         : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
//                                 }`}>
//                                     {banner.isActive ? 'Hoạt động' : 'Không hoạt động'}
//                                 </span>
//                             </div>

//                             {banner.linkUrl && (
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                                         Link
//                                     </label>
//                                     <a
//                                         href={banner.linkUrl}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 break-all"
//                                     >
//                                         {banner.linkUrl}
//                                     </a>
//                                 </div>
//                             )}
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                                     Ngày tạo
//                                 </label>
//                                 <p className="text-gray-900 dark:text-white">
//                                     {new Date(banner.createdAt).toLocaleString('vi-VN')}
//                                 </p>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                                     Ngày cập nhật
//                                 </label>
//                                 <p className="text-gray-900 dark:text-white">
//                                     {new Date(banner.updatedAt).toLocaleString('vi-VN')}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
//                     <button
//                         onClick={onClose}
//                         className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//                     >
//                         Đóng
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// } 
