import React, { useEffect, useRef, useState } from "react";
import { Button, Menu, Avatar, List, Drawer } from "antd";
import { useAppSelector } from "../../../redux/hooks";
import { apiGetFriend } from "../../../apis/apiGetFriend";
import { TypeListFriend } from "../../../types/typeListFriend";
import "./listFriend.css";
import { io, Socket } from "socket.io-client";
import { apiGetMessage } from "../../../apis/apiGetMessage";
import { TypeMessage } from "../../../types/typeMessage";
import { TypeUser } from "../../../types/typeUser";
import moment from "moment";
import { useModal } from "../../../globalContext/ModalContext";

interface ContentMessage {
  message: TypeMessage[]; // Định nghĩa là một mảng các TypeMessage
  senderId?: TypeUser;
}

const ListFriend: React.FC = () => {
  const SOCKET_URL = "http://localhost:8080";
  const { openModal } = useModal();
  const userLocal = localStorage.getItem("user");
  const isLoggedIn = !!userLocal;

  // If not logged in, only render the button and open login modal on click
  if (!isLoggedIn) {
    return (
      <Button
        className="btn-show-listFriend mb-1"
        type="primary"
        onClick={() => openModal("login")}
      >
        <i className="fa-solid fa-user-group"></i>
      </Button>
    );
  }

  const { currentUser } = useAppSelector((state) => state.currentUser);
  const [open, setOpen] = useState(false);
  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [showListFriend, isShowListFriend] = useState<
    TypeListFriend[] | undefined
  >([]);
  const [chatWith, setChatWith] = useState<TypeListFriend>();
  const [contentMessages, setContentMessages] = useState<
    ContentMessage | undefined
  >(undefined);
  const [roomChat, setRoomChat] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const { friendLists } = useAppSelector((state) => state.friend);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const accessToken = user?.tokens.accessToken;

  socketRef.current = io(SOCKET_URL, {
    path: "/socket",
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    secure: false,
    timeout: 20000,
    autoConnect: true,
    auth: {
      token: accessToken || "",
    },
  });

  const roomChatRef = useRef<string>("");

  // whenever roomChat changes, update the ref:
  useEffect(() => {
    roomChatRef.current = roomChat;
  }, [roomChat]);

  // show drawer
  const showDrawer = (data?: any) => {
    setOpen(!open);
    if (data) {
      setChatWith(data);
      setOpenMessageBox(true);
      createRoomChat(currentUser.userId, data.friendId);
    }
  };

  // close drawer
  const onClose = () => {
    setOpen(false);
  };

  // call api get message
  const callApiGetMessage = async () => {
    if (roomChat) {
      const result = await apiGetMessage(roomChat);

      setContentMessages(result);
    }
  };

  // func api get ListFriend
  const callApiGetListFriend = async (id: any) => {
    const result = await apiGetFriend(id);
    if (result) {
      isShowListFriend(result);
    }
  };

  // call function api getListFriend
  useEffect(() => {
    if (currentUser) {
      callApiGetListFriend(currentUser.userId);
    }
  }, [currentUser, friendLists]);

  // call api getMessage
  useEffect(() => {
    callApiGetMessage();
  }, [roomChat]);

  // handler render listFriend
  const renderListFriend = () => {
    if (showListFriend) {
      return (
        <List
          dataSource={showListFriend}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar src={item.User_ListFriends_friendIdToUser.avatar} />
                }
                title={
                  <button
                    onClick={() => {
                      showDrawer(item);
                    }}
                    className="font-medium"
                  >
                    {item.User_ListFriends_friendIdToUser.name}
                  </button>
                }
              />
            </List.Item>
          )}
        />
      );
    }
  };

  const createRoomChat = (user1: string, user2: string) => {
    setRoomChat([user1, user2].sort().join("-"));
  };

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        path: "/socket",
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        secure: false,
        timeout: 20000,
        autoConnect: true,
        auth: {
          token: accessToken || "",
        },
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected successfully!");
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected, trying to reconnect...");
        socketRef.current?.connect();
      });

      socketRef.current.on("message", (newMessage: TypeMessage) => {
        if (newMessage.idSender !== currentUser.userId) {
          if (newMessage.roomChat === roomChatRef.current) {
            setContentMessages((prevMessages) => {
              if (prevMessages) {
                return {
                  ...prevMessages,
                  message: [...prevMessages.message, newMessage],
                };
              } else {
                return {
                  message: [newMessage],
                  sender: currentUser.userId,
                };
              }
            });
            console.log(contentMessages);
          }
        }
      });
    }

    return () => {
      socketRef.current?.off("connect");
      socketRef.current?.disconnect();
    };
  }, []);

  const handleSendMessage = (content: string) => {
    if (!socketRef.current || !socketRef.current.connected) {
      console.error("Socket is not connected yet!");
      return;
    }

    const date = new Date();
    if (chatWith) {
      const newMessage: TypeMessage = {
        idSender: currentUser.userId,
        timeSend: date,
        contentMess: content,
        roomChat: roomChat,
      };

      // Optimistically update the UI
      setContentMessages((prevMessages) => {
        if (prevMessages) {
          return {
            ...prevMessages,
            message: [...prevMessages.message, newMessage],
          };
        } else {
          return {
            message: [newMessage],
            sender: currentUser.userId,
          };
        }
      });

      // Emit the message to the server
      socketRef.current.emit("message", newMessage, (response: any) => {
        console.log("message send success", response);
      });
    }
  };
  // handler scroll when open message box
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom(); // Cuộn đến cuối khi messages thay đổi
    }, 480);
  }, [contentMessages, openMessageBox]);

  const handleShowMessage = () => {
    if (contentMessages) {
      return contentMessages.message.map((message: TypeMessage, index) => {
        const date = moment(message.timeSend).format("DD/MM/YYYY HH:mm:ss");
        return (
          <div
            key={index}
            className={`message-item my-2 p-2 max-w-xs rounded-lg w-3/6 ${
              message.idSender === currentUser.userId
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-white text-black"
            }`}
          >
            {message.contentMess}
            <p className="contentMessage text-xs mt-2">{date}</p>
          </div>
        );
      });
    }
  };

  return (
    <>
      <div>
        <Button
          className="btn-show-listFriend mb-1"
          type="primary"
          onClick={() => {
            showDrawer(null);
          }}
        >
          <i className="fa-solid fa-user-group"></i>
        </Button>
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
        />
        <Drawer title="List Friend" onClose={onClose} open={open} width={250}>
          {renderListFriend()}
        </Drawer>

        {chatWith && openMessageBox && (
          <div
            className="message-box bg-slate-900 h-96 flex flex-col justify-between"
            style={{
              width: "320px",
            }}
          >
            <div className="flex items-center">
              <button
                onClick={() => {
                  setOpenMessageBox(false);
                }}
              >
                <i className="fa-solid fa-x mr-3 text-white"></i>
              </button>
              <img
                style={{
                  width: "25px",
                  height: "25px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
                src={chatWith.User_ListFriends_friendIdToUser?.avatar}
              ></img>
              <h2 className="text-white">
                Chat with {chatWith.User_ListFriends_friendIdToUser?.name}
              </h2>
            </div>
            <div className="message-list">
              {handleShowMessage()}
              <div ref={chatEndRef} />
            </div>
            <MessageInput onSend={handleSendMessage} />
          </div>
        )}
      </div>
    </>
  );
};
interface MessageInputProps {
  onSend: (content: string) => void;
}
const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [inputValue, setInputValue] = useState("");
  const handleSend = () => {
    if (inputValue.trim()) {
      onSend(inputValue);
      setInputValue(""); // Reset input sau khi gửi
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend(); // Gửi tin nhắn khi nhấn Enter
    }
  };

  return (
    <div className="message-input">
      <input
        className="text-black"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message..."
        onKeyPress={handleKeyPress}
      />
      <button className="text-white" onClick={handleSend}>
        Send
      </button>
    </div>
  );
};
export default ListFriend;
