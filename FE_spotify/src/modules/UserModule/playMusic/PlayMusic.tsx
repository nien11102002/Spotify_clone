import { useEffect, useRef, useState } from "react";
import "./playMusic.css";
import { useGlobalContext } from "../../../globalContext/GlobalContext";
import { apiPlayMusic } from "../../../apis/apiPlayMusic";
import { TypeSong } from "../../../types/typeSong";
import ReactPlayer from "react-player";
import { Button, Drawer, Input } from "antd";
import { TypeComment } from "../../../types/typeComment";
import { apiGetComment } from "../../../apis/apiGetComment";
import { CloseOutlined } from "@ant-design/icons";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "../../../redux/hooks";

export default function PlayMusic() {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : {};

  if (!user || Object.keys(user).length === 0) {
    return <div></div>;
  }

  const { currentUser } = useAppSelector((state) => state.currentUser);
  const [isPlaying, setIsPlaying] = useState(true);
  const { idMusic } = useGlobalContext();
  console.log("idMusic", idMusic);
  const { nameArtists } = useGlobalContext();
  const [duration, setDuration] = useState(0);
  const [dataMusic, setDataMusic] = useState<TypeSong>();
  const [currentTime, setCurrentTime] = useState(0);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState<TypeComment[]>([]);
  const [commentInput, setCommentInput] = useState<string>(""); // Add state for comment input

  const SOCKET_URL = "http://localhost:8080";
  const socketRef = useRef<Socket | null>(null);

  const accessToken = user?.tokens?.accessToken;

  //   socketRef.current = io(SOCKET_URL, {
  //     path: "/socket",
  //     transports: ["websocket"],
  //     reconnection: true,
  //     reconnectionAttempts: Infinity,
  //     reconnectionDelay: 1000,
  //     secure: false,
  //     timeout: 20000,
  //     autoConnect: true,
  //     auth: {
  //       token: accessToken || "",
  //     },
  //   });

  const songDiscussRef = useRef<number>(0);

  useEffect(() => {
    songDiscussRef.current = Number(idMusic);
  }, [idMusic]);

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
        console.log("Socket connected");
      });

      socketRef.current.on("comment", (newComment: TypeComment) => {
        console.log("New comment received:", { newComment });
        if (newComment.songId === songDiscussRef.current) {
          setComment((prev) => [newComment, ...prev]);
        }
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    }

    return () => {
      socketRef.current?.off("connect");
      socketRef.current?.disconnect();
    };
  }, []);

  const handleComment = () => {
    if (!socketRef.current || !socketRef.current.connected) {
      console.error("Socket is not connected yet!");
      return;
    }
    if (!commentInput.trim()) return;

    const newComment = {
      userId: user?.userId,
      content: commentInput,
      songId: Number(idMusic),
      discussDate: new Date(),
      replyDiscussId: null,
      User: {
        userId: currentUser?.userId,
        name: currentUser?.name,
        nationality: currentUser?.nationality,
        channelName: currentUser?.channelName,
        avatar: currentUser?.avatar,
        description: currentUser?.description,
        banner: currentUser?.banner,
        role: currentUser?.role,
      },
    };

    socketRef.current.emit("comment", newComment, (response: any) => {
      console.log("comment send success", response);
    });

    setCommentInput(""); // Clear input after sending
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleProgress = (state: {
    playedSeconds: number;
    loadedSeconds: number;
    played: number;
  }) => {
    setCurrentTime(state.playedSeconds);
    setDuration(state.loadedSeconds); // `loadedSeconds` thường chính xác hơn `duration`
  };

  const handleProgressChange = (e: any) => {
    const newTime = (e.target.value / 100) * duration;
    setCurrentTime(newTime);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // handle drawer comment
  const handleDrawerComment = () => {
    return (
      <div>
        <Drawer
          title="Comment"
          style={{ backgroundColor: "black", color: "white" }}
          closeIcon={<CloseOutlined style={{ color: "white" }} />}
          onClose={onClose}
          open={open}
          bodyStyle={{
            display: "flex",
            flexDirection: "column",
            height: "70vh",
            padding: 0,
          }}
        >
          {/* Scrollable comment list */}
          <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            {comment.map((item: TypeComment, index: number) => {
              const dateComment = new Date(item.discussDate);
              return (
                <div className="comment-item mb-4" key={index}>
                  <div className="flex items-start">
                    {/* Avatar */}
                    <img
                      style={{ objectFit: "cover" }}
                      src={
                        item.User?.avatar !== "none"
                          ? item.User?.avatar
                          : "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg"
                      }
                      alt="Avatar"
                      className="w-10 h-10 rounded-full mr-3"
                    />

                    <div className="comment-content">
                      {/* User name and comment content */}
                      <div className="bg-white p-3 rounded-2xl mb-1">
                        <span className="text-md font-medium text-black">
                          {item.User?.name}
                        </span>
                        <br />
                        <span className="ml-2 text-black">{item.content}</span>
                      </div>
                      {/* Time */}
                      <p className="text-sm text-gray-500">
                        {dateComment.toLocaleTimeString("vn-VN") +
                          " - " +
                          dateComment.toLocaleDateString("vn-VN")}
                      </p>
                      {/* Actions: Like, Comment */}
                      <div className="like-comment flex space-x-4">
                        <button className="text-blue-600 hover:text-blue-800">
                          <i className="fa-solid fa-thumbs-up mr-1"></i>Like
                        </button>
                        <button className="text-blue-600 hover:text-blue-800">
                          <i className="fa-solid fa-comment mr-1"></i>Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Fixed input area at the bottom */}
          <div
            style={{
              borderTop: "1px solid #333",
              background: "#111",
              padding: 12,
            }}
          >
            <div className="flex items-center bg-white rounded-2xl p-2">
              {/* Comment input */}
              <div className="flex-1">
                <Input.TextArea
                  placeholder="Write a comment..."
                  rows={1}
                  className="resize-none bg-transparent border-none focus:bg-transparent focus:ring-0 focus:outline-none"
                  autoSize={{ minRows: 1, maxRows: 10 }}
                  style={{ width: "260px", height: "90px" }}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onPressEnter={(e) => {
                    e.preventDefault();
                    handleComment();
                  }}
                />
              </div>
              {/* Post button with icon */}
              <button
                className="ml-2 text-black px-4 py-1 rounded-full hover:text-gray-400 transition-all duration-150 flex items-center"
                onClick={handleComment}
                disabled={!commentInput.trim()}
              >
                <i className="fa-solid fa-paper-plane mr-1"></i>
              </button>
            </div>
          </div>
        </Drawer>
      </div>
    );
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const callApiGetComment = async (id: any) => {
    const result = await apiGetComment(id);
    console.log("comment", result);
    if (result) {
      setComment(result);
    }
  };

  useEffect(() => {
    if (idMusic) {
      callApiPlayMusic();
      callApiGetComment(idMusic);
    }
  }, [idMusic]);

  const callApiPlayMusic = async () => {
    const result = await apiPlayMusic(idMusic);
    setDataMusic(result);
  };

  return (
    dataMusic && (
      <div className="">
        <div className="container mx-auto play-music fixed bottom-0 left-0 right-0 z-50 bg-black text-white">
          <div className="flex items-center justify-around">
            {/* Thông tin bài hát */}
            <div className="flex items-center">
              {dataMusic && (
                <img
                  style={{
                    width: "50px",
                    objectFit: "cover",
                  }}
                  src={dataMusic?.songImage}
                  alt="Album Art"
                  className="w-12 h-12 mr-4"
                />
              )}

              <div>
                <div className="text-sm font-semibold">
                  {dataMusic?.songName}
                </div>
                <div className="text-xs text-gray-400">{nameArtists}</div>
              </div>
            </div>

            <div className="flex text-center items-center">
              {/* Điều khiển phát nhạc */}
              <div className="flex items-center justify-center btn-control">
                <button>
                  <i className="fa-solid fa-shuffle"></i>
                </button>
                <button className="mr-4">
                  <i className="fa-solid fa-backward-step"></i>
                </button>
                <button onClick={togglePlayPause}>
                  <i
                    className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`}
                  ></i>
                </button>
                <button>
                  <i className="fa-solid fa-forward-step"></i>
                </button>
                <button>
                  <i className="fa-solid fa-repeat"></i>
                </button>
                <Button
                  className="showComment"
                  type="link"
                  onClick={showDrawer}
                >
                  <i className="fa-regular fa-message"></i>
                </Button>
                {handleDrawerComment()}
              </div>
              {/* Thanh thời gian */}
              <input
                type="range"
                min="0"
                max="100"
                value={(currentTime / duration) * 100 || 0}
                onChange={handleProgressChange}
              />
              <span>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="play-music">
              <ReactPlayer
                url={dataMusic?.filePath}
                playing={isPlaying}
                controls={true}
                width="0"
                height="0"
                onProgress={handleProgress}
                onDuration={handleDuration}
              />
            </div>
          </div>
        </div>
      </div>
    )
  );
}
