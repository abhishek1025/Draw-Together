import {Copy, QrCode, Users, X} from "lucide-react";
import {Button, Flex, Input, Modal, Tooltip} from "antd";
import {useEffect, useState} from "react";
import { Divider } from "antd";
import UserAvatar from "@/components/User/UserAvatar";
import {ActiveUser} from "@/interfaces/chat";
import {MessageType} from "@repo/common/messageTypeConstant";
import {toast} from "sonner";

const ActiveUsersList = ({ws, roomId}: {ws: WebSocket, roomId: string}) => {
    const currentUrl = window.location.href;
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
    const [displayUsersList , setDisplayUsersList] = useState(false);
    const [inviteModal, setInviteModal] = useState(true);

    const toggleDisplayUsersList = () => {
        setDisplayUsersList(!displayUsersList);
    }

    const handleActiveUsersList = (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        if (message.type === MessageType.JOIN_ROOM) {
            const _activeUsers: ActiveUser[] = JSON.parse(message.activeUsers);
            setActiveUsers(_activeUsers);
        }

        if (message.type === MessageType.LEAVE_ROOM) {
            const userId: string = message.userId;
            console.log(userId);
            setActiveUsers((prevUsers) => [...prevUsers.filter(user => user.id !== userId)]);
        }
    };


    const leaveRoom = () => {
        ws.send(JSON.stringify({
            type: MessageType.LEAVE_ROOM,
            roomId,
        }));
    }

    const closeInviteModal = () => {
        setInviteModal(false);
    }

    const openInviteModal = () => {
        setInviteModal(true);
    }

    const copyInviteLink = () => {
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
               toast.success("Copied link!");
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }

    useEffect(() => {
        ws.addEventListener("message", handleActiveUsersList);

        return () => {
            ws.removeEventListener("message", handleActiveUsersList);
        }
    }, [ws])

    useEffect(() => {
        window.addEventListener('beforeunload', leaveRoom);

        return () => {
            window.removeEventListener('beforeunload', leaveRoom);
        }
    }, []);


    return <>

        <div className="absolute right-4 top-4">
            <div className="bg-white w-[140px] px-3 py-2 rounded relative flex items-center justify-between">

                <Tooltip title="Users List" placement="bottomLeft" className="cursor-pointer">
                    <div className="flex items-center justify-center gap-x-2" onClick={toggleDisplayUsersList}>
                        <div>
                            <div className="w-2 h-2 rounded-full bg-green-600 absolute left-7 top-2"></div>
                            <Users/>
                        </div>

                        <div>{activeUsers.length}</div>

                    </div>
                </Tooltip>

                <div>
                    <Button size="middle" type="primary" onClick={openInviteModal}>Invite</Button>
                </div>
            </div>

        </div>

        {
            displayUsersList && <div className="absolute bottom-5 right-4 bg-white rounded p-4 w-[325px] z-[2000]">

                <div className="flex items-center justify-between">
                    <h3 className="font-medium">Active Users</h3>

                    <Button icon={<X/>} type="text" onClick={toggleDisplayUsersList}/>

                </div>

                <Divider className="!m-0 !my-2"  />

                <div className="space-y-3 h-[250px] overflow-auto py-2">

                    {activeUsers.map((user) => (
                        <div className="flex gap-x-3 items-center" key={user.id}>
                            <UserAvatar user={{...user}}/>
                            <p>{user.name}</p>
                        </div>
                    ))}

                </div>

            </div>
        }

            <Modal
                open={inviteModal}
                onCancel={closeInviteModal}
                title="Invite"
                centered
                footer={
                    <div className="space-x-3">
                        <Button type="default" onClick={closeInviteModal}>Cancel</Button>

                        <Button type="primary" onClick={copyInviteLink}>Copy Invite</Button>
                    </div>
                }
            >
                <div className="py-4">

                    <div className="flex justify-end mb-5">
                       <Button type="default" size="middle" icon={<QrCode size="15px" />}>
                        QR Code
                       </Button>
                    </div>

                    <Input value={currentUrl} size="large"   suffix={<Copy className="cursor-pointer" onClick={copyInviteLink} />}  />
                </div>

            </Modal>


    </>
}

export default ActiveUsersList;