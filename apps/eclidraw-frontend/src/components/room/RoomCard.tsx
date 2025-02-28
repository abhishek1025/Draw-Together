"use client"

import React, {useState} from 'react';
import {Card, Avatar, Tooltip, Tag, Popover, Button} from 'antd';
import {format} from 'date-fns';
import {MessageSquare, Users, Shield, Calendar, Info} from 'lucide-react';
import {RoomCardPropsType} from "@/iterfaces";
import {useRouter} from "next/navigation";

const RoomCard: React.FC<RoomCardPropsType> = ({id, slug, createdAt, user, description}) => {
    const formattedDate = format(new Date(createdAt), 'MMM dd, yyyy');
    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    const router = useRouter();

    const PopOverContent = (
        <div className="max-w-xs">
            <h4 className="text-base font-medium mb-2">About this Room</h4>
            <p className="text-sm text-gray-600 mb-3">
                {description}
            </p>
            <div className="text-xs text-gray-500">
                <div className="flex items-center mb-1">
                    <Calendar size={12} className="mr-1"/>
                    <span>Created on {formattedDate}</span>
                </div>
                <div className="flex items-center">
                    <Shield size={12} className="mr-1"/>
                    <span>Private access only</span>
                </div>
            </div>
        </div>
    );

    return (
        <Card
            hoverable
            className="w-full max-w-md overflow-hidden transition-all duration-300 hover:shadow-lg"
        >
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    <Avatar
                        size={48}
                        src={user.photo}
                        className="!bg-indigo-600"
                    >
                        {!user.photo && user.name.charAt(0).toUpperCase()}
                    </Avatar>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {slug}
                    </h3>

                    <div className="flex items-center mt-1 text-sm text-gray-500">
                        <span className="truncate">Created by {user.name}</span>
                    </div>

                    <div className="flex items-center mt-3 space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                            <MessageSquare size={16} className="mr-1"/>
                            <span>Active</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-500">
                            <Users size={16} className="mr-1"/>
                            <span>1 member</span>
                        </div>

                        <div className="text-sm text-gray-500">
                            {formattedDate}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-between gap-2">
                <Tooltip title="Join room">
                    <Button type="primary"
                            onClick={() => {
                                router.push(`/canvas/${id}`);
                            }}
                            className="flex-1"
                    >
                        Join Room
                    </Button>
                </Tooltip>

                <Popover
                    content={PopOverContent}
                    title={null}
                    trigger="click"
                    open={open}
                    onOpenChange={handleOpenChange}
                    placement="bottom"
                    className="room-details-popover"
                >
                    <button
                        className="px-3 py-2 text-sm font-medium text-[#4F46E5] bg-indigo-50 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Info size={18}/>
                    </button>
                </Popover>
            </div>
        </Card>
    );
};

export default RoomCard;