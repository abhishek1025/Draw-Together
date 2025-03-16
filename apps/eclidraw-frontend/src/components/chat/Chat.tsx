import { Avatar, Button, Input } from "antd";
import { ArrowUp, MessageSquareText, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { getExistingShapes } from "@/draw/http";

const Chat = ({ socket, roomId }: { socket: WebSocket; roomId: string }) => {
  type ChatMessage = {
    id: string;
    message: string;
    user: {
      id: string;
      name: string;
      email: string;
      photo: string;
    };
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [displayChat, setDisplayChat] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchChatMessages = async () => {
      const messages = await getExistingShapes(roomId, "message");
      // @ts-ignore
      setMessages(messages);
    };
    fetchChatMessages();
  }, []);

  // Scroll to the bottom when messages change or component mounts
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // @ts-ignore
  const handleSendMessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "chat_message") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, user: JSON.parse(message.user) },
      ]);
    }
  };

  useEffect(() => {
    socket.addEventListener("message", handleSendMessage);
    return () => {
      socket.removeEventListener("message", handleSendMessage);
    };
  }, [socket]);

  const openChat = () => {
    setDisplayChat(true);
  };

  const closeChat = () => {
    setDisplayChat(false);
  };

  const sendMessage = () => {
    socket.send(
      JSON.stringify({
        type: "chat_message",
        roomId,
        message: newMessage,
      }),
    );

    setNewMessage("");
  };

  const renderAvatar = (index: number, message: ChatMessage) => {
    if (
      index === 0 ||
      (index > 0 && messages[index - 1]?.user.id !== message.user.id)
    ) {
      return (
        <Avatar size={30} src={message.user.photo} className="!bg-indigo-600">
          {!message.user.photo && message.user.name.charAt(0).toUpperCase()}
        </Avatar>
      );
    }
  };

  return (
    <div className="fixed right-[20px] bottom-[30px] ">
      {displayChat && (
        <div className="w-[350px]">
          <div className="relative group">
            <div className="absolute top-2 right-2">
              <Button
                icon={<X />}
                type="default"
                size="middle"
                className="rounded"
                onClick={closeChat}
              />
            </div>

            <div className="flex flex-col-reverse h-[400px] overflow-y-auto group-hover:bg-white group-hover:bg-opacity-10 mb-2 rounded">
              <div
                ref={chatContainerRef}
                className="px-3 py-4 rounded space-y-1 flex flex-col"
              >
                {messages.map((message, index) => (
                  <div key={index} className="flex space-x-2">
                    <div className="w-[35px]">
                      {renderAvatar(index, message)}
                    </div>

                    <div className="flex-1">
                      <div className=" text-sm flex items-center flex-1">
                        <p className="bg-white py-1 px-2 rounded inline">
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-x-5 items-center bg-white p-4 rounded">
              <Input
                placeholder="Please enter your chat"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                }}
              />
              <Button
                icon={<ArrowUp />}
                type="primary"
                size="middle"
                className=""
                shape="circle"
                onClick={sendMessage}
                disabled={!newMessage}
              />
            </div>
          </div>
        </div>
      )}
      {!displayChat && (
        <div
          className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-indigo-600 text-white cursor-pointer"
          onClick={openChat}
        >
          <MessageSquareText size="30px" />
        </div>
      )}
    </div>
  );
};

export default Chat;
