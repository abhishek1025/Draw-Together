import React from "react";
import {Avatar} from "antd";

type UserAvatarProps = {
    user: {
        name: string;
        photo?: string;
    }
}

const UserAvatar = ({user}: UserAvatarProps) => {
    return (
        <Avatar size={30} src={user.photo} className='!bg-indigo-600'>
            {!user.photo && user.name.charAt(0).toUpperCase()}
        </Avatar>
    )
}

export  default UserAvatar;