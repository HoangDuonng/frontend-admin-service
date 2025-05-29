'use client';

import React from 'react';
import Link from 'next/link';
import Card from '@/components/card';

const comments = [
    {
        title: 'Winnifred',
        login: '@username',
        time: '30m',
        content: 'Message goes here <span role="img" aria-label="smile">😊</span>',
        avatar: '/images/content/avatar-1.jpg',
    },
    {
        title: 'Esther',
        login: '@username',
        time: '1h',
        content: 'Message goes here <span role="img" aria-label="smile">😊</span>',
        avatar: '/images/content/avatar-4.jpg',
    },
    {
        title: 'Leland',
        login: '@username',
        time: '1h',
        content: 'Message goes here <span role="img" aria-label="smile">😊</span>',
        avatar: '/images/content/avatar-3.jpg',
    },
    {
        title: 'Jimmy',
        login: '@username',
        time: '2h',
        content: 'Message goes here <span role="img" aria-label="smile">😊</span>',
        avatar: '/images/content/avatar-2.jpg',
    },
    {
        title: 'Chad',
        login: '@username',
        time: '4h',
        content: 'Message goes here <span role="img" aria-label="smile">😊</span>',
        avatar: '/images/content/avatar-5.jpg',
    },
];

const Message = () => {
    return (
        <Card title="Message" classTitle="title-purple">
            <div>
                <div>
                    {comments.map((x, index) => (
                        <div
                            key={index}
                            className="flex mb-8 pb-6 border-b border-gray-200 dark:border-gray-700 md:mb-6"
                        >
                            <div className="flex-shrink-0 w-12 h-12 mr-3">
                                <img
                                    src={x.avatar}
                                    alt="Avatar"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center">
                                    <div className="mr-auto">
                                        <span className="font-bold">{x.title}</span>{' '}
                                        <span className="font-medium text-gray-500">{x.login}</span>
                                    </div>
                                    <div className="ml-5 text-xs text-gray-500">{x.time}</div>
                                </div>
                                <div
                                    className="font-medium text-gray-900 dark:text-white"
                                    dangerouslySetInnerHTML={{ __html: x.content }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <Link
                    className="button-stroke w-full mt-8"
                    href="/message-center"
                >
                    View all message
                </Link>
            </div>
        </Card>
    );
};

export default Message; 
