import React from "react";

export function IconButton({icon, onClick, activated}: {
    icon: React.ReactNode;
    onClick: () => void;
    activated: boolean;
}) {
    return <div
        className={`text-sm pointer rounded p-2 cursor-pointer ${activated ? 'bg-indigo-400' : 'text-white'}`} onClick={onClick}>
        {icon}
    </div>
}