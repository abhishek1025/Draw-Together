"use client"

import {Logo} from "@/components/index";
import Link from "next/link";
import React from "react";
import {usePathname} from "next/navigation";

export default function NavFooterLayout({children}: {children: React.ReactNode}) {

    const pathName = usePathname();

    const emptyLayoutPathNames = ['/sign-in', '/sign-up', '/reset-password', '/forgot-password'];

    if(emptyLayoutPathNames.includes(pathName) || pathName.startsWith('/canvas')) return children;


    return <div>
        <nav className='container mx-auto px-6 py-4 flex items-center justify-between'>
            <Logo/>

            <div className='hidden md:flex items-center space-x-8'>

                <Link href='/rooms' className='text-gray-600 hover:text-indigo-600'>
                    Rooms
                </Link>

                <Link href='' className='text-gray-600 hover:text-indigo-600'>
                    My Rooms
                </Link>

                <Link href='#features' className='text-gray-600 hover:text-indigo-600'>
                    Features
                </Link>

                <Link href="/sign-in">
                    <button
                        className='bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors'>
                        Try Now
                    </button>
                </Link>
            </div>
        </nav>

        <div>
            {children}
        </div>

        <footer className='bg-gray-50 py-12'>
            <div className='container mx-auto px-6'>
                <div className='flex flex-col md:flex-row justify-between items-center'>

                    <Logo />

                    <div className='flex space-x-6'>
                        <a href='#' className='text-gray-600 hover:text-indigo-600'>
                            Privacy
                        </a>
                        <a href='#' className='text-gray-600 hover:text-indigo-600'>
                            Terms
                        </a>
                        <a href='#' className='text-gray-600 hover:text-indigo-600'>
                            Contact
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
}