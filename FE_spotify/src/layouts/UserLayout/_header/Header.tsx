import { Button, ConfigProvider } from "antd";
import "./header.css";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { useModal } from "../../../globalContext/ModalContext";
import { useState } from "react";
import Search from "antd/es/input/Search";
import { SearchOutlined } from "@ant-design/icons";

export default function Header() {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { currentUser } = useAppSelector((state) => state.currentUser);
  const [searchValue, setSearchValue] = useState<string>("");

  const handlerPrev = () => navigate(-1);
  const handlerNext = () => navigate(1);
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate(0);
  };

  const handleSearch = (value: string) => {
    navigate(`/searchSong/${value}`);
  };

  return (
    <header id="css-header">
      <div className="flex justify-between">
        <div className="header-left">
          <button onClick={handlerPrev}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button onClick={handlerNext}>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
        <div>
          <Search
            placeholder="Search..."
            enterButton={
              <Button
                className="custom-button"
                color="cyan"
                type="primary"
                icon={<SearchOutlined />}
              />
            }
            onSearch={handleSearch}
            onPressEnter={(e) => handleSearch(e.currentTarget.value)}
            onChange={(e) => setSearchValue(e.currentTarget.value)}
            value={searchValue}
            className="header-search"
            size="large"
          />
        </div>
        <div className="header-right">
          {currentUser ? (
            <Button onClick={handleLogout}>Log out</Button>
          ) : (
            <>
              <Button
                className="btn-signup"
                onClick={() => openModal("register")}
              >
                Sign up
              </Button>
              <Button className="btn-signin" onClick={() => openModal("login")}>
                Log in
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
