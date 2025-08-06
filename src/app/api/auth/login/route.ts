import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env.mjs';

const API_BASE_URL = env.NEXT_PUBLIC_AUTH_API_URL;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email và mật khẩu là bắt buộc'
                },
                { status: 400 }
            );
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (!response.ok) {
            console.log('Login failed with status:', response.status);
            let errorMessage = 'Đăng nhập thất bại';

            // Clone response để có thể đọc body
            const responseClone = response.clone();

            try {
                const errorData = await response.json();
                console.log('Error data from backend:', errorData);
                errorMessage = errorData.message || errorData.error || errorData.msg || errorData.detail || errorMessage;
            } catch (parseError) {
                console.log('Failed to parse error response as JSON, trying as text');
                try {
                    const errorText = await responseClone.text();
                    console.log('Error text from backend:', errorText);
                    errorMessage = errorText || response.statusText || errorMessage;
                } catch (textError) {
                    console.log('Failed to read error response as text:', textError);
                    errorMessage = response.statusText || errorMessage;
                }
            }

            console.log('Returning error message:', errorMessage);

            let translatedMessage = errorMessage;
            if (errorMessage === 'Email or password is incorrect') {
                translatedMessage = 'Email hoặc mật khẩu không đúng';
            } else if (errorMessage === 'User not found') {
                translatedMessage = 'Không tìm thấy người dùng';
            } else if (errorMessage === 'Invalid credentials') {
                translatedMessage = 'Thông tin đăng nhập không hợp lệ';
            } else if (errorMessage === 'Account is locked') {
                translatedMessage = 'Tài khoản đã bị khóa';
            } else if (errorMessage === 'Account is disabled') {
                translatedMessage = 'Tài khoản đã bị vô hiệu hóa';
            }

            return NextResponse.json(
                {
                    success: false,
                    message: translatedMessage
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        const nextResponse = NextResponse.json({
            success: true,
            data: data
        });

        if (data.accessToken) {
            nextResponse.cookies.set('accessToken', data.accessToken, {
                httpOnly: false,
                secure: false,
                sameSite: 'lax',
                path: '/',
                maxAge: 30 * 60 // 30 minutes
            });
        }

        if (data.refreshToken) {
            nextResponse.cookies.set('refreshToken', data.refreshToken, {
                httpOnly: false,
                secure: false,
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 // 7 days
            });
        }

        if (data.user) {
            nextResponse.cookies.set('user', JSON.stringify(data.user), {
                httpOnly: false,
                secure: false,
                sameSite: 'lax',
                path: '/',
                maxAge: 30 * 60 // 30 minutes
            });
        }

        return nextResponse;

    } catch (error) {
        console.error('Login error:', error);

        if (error instanceof TypeError && error.message.includes('fetch')) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Không thể kết nối đến server, vui lòng thử lại sau'
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Lỗi server, vui lòng thử lại sau'
            },
            { status: 200 }
        );
    }
} 
