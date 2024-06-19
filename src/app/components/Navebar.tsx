'use client'

import React from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/nextjs';

function Navbar() {
    const user = useUser()
    const { isSignedIn } = user

    return (
        <nav className="stick top-0 z-50 border-b w-full backdrop-blur px-3 py-2 bg-background/50">
            <div className="container mx-auto flex flex-row justify-between items-center px-0">
                <div>Hello</div>
                <div>
                    { isSignedIn ? <UserButton /> : <SignInButton /> }
                </div>
            </div>
        </nav>
    );
}

export default Navbar;