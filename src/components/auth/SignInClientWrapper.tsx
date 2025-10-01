'use client';

import { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ConfigProvider } from 'antd';
import { useAuth } from '@/hooks/useAuth';

export default function SignInClientWrapper() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        const newErrors: { email?: string; password?: string } = {};

        if (!formData.email) {
            newErrors.email = 'Vui lòng nhập email';
        }

        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setIsLoading(true);

        try {
            await login({
                email: formData.email,
                password: formData.password,
            });

            setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...');

            setFormData({
                email: '',
                password: '',
            });

            // Redirect immediately
            window.location.href = '/';

        } catch (error: any) {
            const errorMessage = error.message || 'Đăng nhập thất bại. Vui lòng thử lại.';

            setErrors(prev => ({
                ...prev,
                general: errorMessage
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ConfigProvider
            theme={{
                components: {
                    Tooltip: {
                        zIndexPopup: 0,
                    },
                },
            }}
        >
            <div className="min-h-screen relative flex">
                {/* Full Screen Background Image - Fixed */}
                <div className="fixed inset-0">
                    <Image
                        src="/images/signin-signup.webp"
                        alt="Du lịch Việt Nam"
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Gradient Overlay - chìm dưới và sáng dần từ trái qua phải */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />

                    {/* Decorative Elements */}
                    <div className="absolute inset-0">
                        {/* Curved Line */}
                        <svg className="absolute top-0 right-0 w-full h-full" viewBox="0 0 400 600" fill="none">
                            <path
                                d="M 350 50 Q 300 150 320 300 Q 340 450 280 550"
                                stroke="white"
                                strokeWidth="2"
                                strokeDasharray="8 8"
                                opacity="0.4"
                            />
                        </svg>
                    </div>
                </div>

                {/* Form Overlay */}
                <div className="relative z-10 w-full max-w-md ml-8 lg:ml-16 mt-20">
                    <div className="p-8 lg:p-12 min-h-[600px]">
                        {/* Header */}
                        <div className="mb-12">
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Hệ thống quản trị
                                <span className="text-blue-400">.</span>
                            </h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            {successMessage && (
                                <div className="bg-green-500/20 border border-green-400 rounded-lg p-3">
                                    <p className="text-green-400 text-sm flex items-center">
                                        <span className="mr-2">✅</span>
                                        {successMessage}
                                    </p>
                                </div>
                            )}
                            {errors.general && (
                                <div className="bg-red-500/20 border border-red-400 rounded-lg p-3">
                                    <p className="text-red-400 text-sm flex items-center">
                                        <span className="mr-2">⚠</span>
                                        {errors.general}
                                    </p>
                                </div>
                            )}
                            <div className="h-24">
                                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        autoComplete="email"
                                        className={`w-full px-4 py-4 bg-white/20 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-gray-300 transition-all duration-200 ${errors.email ? 'border-red-400 ring-2 ring-red-400' : 'border-white/30'}`}
                                        placeholder="Nhập email"
                                    />
                                    <FiMail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300" />
                                </div>
                                {errors.email && (
                                    <p className="text-red-400 text-xs mt-1 flex items-center">
                                        <span className="mr-1">⚠</span>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="h-24">
                                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        autoComplete="current-password"
                                        className={`w-full px-4 py-4 bg-white/20 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-gray-300 transition-all duration-200 ${errors.password ? 'border-red-400 ring-2 ring-red-400' : 'border-white/30'}`}
                                        placeholder="Nhập mật khẩu"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-400 text-xs mt-1 flex items-center">
                                        <span className="mr-1">⚠</span>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input type="checkbox" className="rounded border-white/30 bg-white/20 text-blue-400 focus:ring-blue-400 focus:ring-offset-transparent" />
                                    <span className="ml-2 text-sm text-gray-200">Ghi nhớ đăng nhập</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-500/80 backdrop-blur-sm text-white py-4 px-6 rounded-lg hover:bg-blue-600/80 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg border border-white/20"
                            >
                                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
} 
