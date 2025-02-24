'use client'

function getCookies (name: string): string | null  {

    const cookies = window.document.cookie.split(';');

    for(const cookie of cookies) {

        if(!cookie) return null;

        const _cookie = cookie.split('=');

        if(_cookie[0] === name) return _cookie[1];

    }

    return null;
}

export const getAuthTokenFromCookie = () => getCookies('token')

export const setCookie = (name: string, value: string, expiresAt: Date) => {
    document.cookie = `${name}=${value}; expires=${expiresAt.toUTCString()}`;
}

export const removeCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}