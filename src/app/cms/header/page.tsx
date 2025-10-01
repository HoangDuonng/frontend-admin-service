import HeaderConfigClient from '../../../components/client-config/HeaderConfigClient';

export default function HeaderConfigPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-extrabold mb-2 mt-6 text-center bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text drop-shadow">
                Cấu hình Header
            </h1>
            <p className="mb-8 text-gray-500 text-center max-w-2xl mx-auto leading-relaxed text-lg">
                Quản lý các header sẽ hiển thị trên trang web client.<br />
                Bạn có thể thêm, sửa, xóa hoặc sắp xếp các header tại đây.
            </p>
            <HeaderConfigClient />
        </div>
    );
} 
