'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/card';
import Icon from '@/components/icon';
import Product from '@/components/products';
import { products } from '@/mocks/products';

interface ProductItem {
    id: number;
    product: string;
    link: string;
    image: string;
    image2x: string;
    price: number;
    date: string;
    ratingValue: number;
    ratingCounter: number;
}

const socials = [
    {
        title: 'Facebook',
        icon: 'facebook',
        url: 'https://www.facebook.com/ui8.net/',
    },
    {
        title: 'Twitter',
        icon: 'twitter',
        url: 'https://twitter.com/ui8',
    },
    {
        title: 'Instagram',
        icon: 'instagram',
        url: 'https://www.instagram.com/ui8net/',
    },
];

const ShareProducts = () => {
    const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

    const handleChange = (id: number) => {
        if (selectedFilters.includes(id)) {
            setSelectedFilters(selectedFilters.filter((x) => x !== id));
        } else {
            setSelectedFilters((prevFilters) => [...prevFilters, id]);
        }
    };

    return (
        <Card
            title="Share your products"
            classTitle="title-blue"
            head={
                <Link
                    className="button-stroke button-small hidden md:flex items-center dark:text-gray-300 dark:hover:text-gray-300"
                    href="/promote"
                >
                    <span>Go to promote</span>
                    <Icon category="interface" name="promotion" size="24" />
                </Link>
            }
        >
            <div>
                <div className="flex flex-wrap -mt-8 -mx-4 md:block md:mt-0 md:mx-0">
                    {products.map(
                        (x, index) =>
                            index < 2 && (
                                <div
                                    key={index}
                                    className="w-[calc(50%-32px)] mx-4 mt-8 md:w-full md:mx-0 md:mt-0 md:mb-6"
                                >
                                    <Product
                                        className="w-full"
                                        views="1"
                                    />
                                </div>
                            )
                    )}
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-gray-500 font-medium md:mt-6 md:pt-6">
                    50% of new customers explore products because the author sharing the work
                    on the social media network. Gain your earnings right now!{' '}
                    <span role="img" aria-label="fire">
                        🔥
                    </span>
                </div>
                <div className="flex -mx-2">
                    {socials.map((x, index) => (
                        <a
                            key={index}
                            className="button-stroke flex-1 mx-2 md:text-0"
                            href={x.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Icon category="interface" name={x.icon} size="24" />
                            <span className="md:hidden">{x.title}</span>
                        </a>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default ShareProducts; 
