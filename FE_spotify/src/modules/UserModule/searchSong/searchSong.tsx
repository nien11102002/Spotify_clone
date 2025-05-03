import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { useAppSelector } from "../../../redux/hooks";
import { TypeSong, TypeSongResponse } from "../../../types/typeSong";
import { TypeUser } from "../../../types/typeUser";
import { TypeGenre } from "../../../types/typeGenre";
import { apiGetUser } from "../../../apis/apiGetUser";
import { useGlobalContext } from "../../../globalContext/GlobalContext";
import moment from "moment";
import "../playList/Playlist.css";
import { Link, useParams } from "react-router-dom";
import { ClockCircleOutlined } from "@ant-design/icons";
import { apiSearchSong } from "../../../apis/apiSearchSong";
import { fetchAndSetSongGenre } from "../../../apis/apiGetSongGenre";

function SearchSong() {
  const dispatch = useDispatch<AppDispatch>();
  const [users, setUsers] = useState<TypeUser[]>([]);
  const { setIdMusic } = useGlobalContext();
  const { keyword } = useParams();
  const [searchResults, setSearchResults] = useState<TypeSong[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    dispatch(fetchAndSetSongGenre());
  }, [dispatch]);

  useEffect(() => {
    setPage(1);
    setPageSize(10);
  }, [keyword]);

  useEffect(() => {
    callApiGetUser();
    if (keyword) {
      handleSearchSong(keyword, page, pageSize);
    } else {
      setSearchResults([]);
      setTotal(0);
      setTotalPage(0);
    }
  }, [dispatch, keyword, page, pageSize]);

  const callApiGetUser = async () => {
    const result = await apiGetUser();
    setUsers(Array.isArray(result) ? result : [result]);
  };

  const handleSearchSong = async (kw: string, pageNum = 1, pageSz = 10) => {
    const result: TypeSongResponse | undefined = await apiSearchSong(
      kw,
      pageNum,
      pageSz
    );
    if (result) {
      setSearchResults(Array.isArray(result.data) ? result.data : []);
      setTotal(result.total || 0);
      setTotalPage(result.totalPage || 0);
    } else {
      setSearchResults([]);
      setTotal(0);
      setTotalPage(0);
    }
  };

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "number",
      key: "number",
      width: "5%",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "40%",
      render: (_: any, record: any) => {
        const artist = users.find(
          (user: TypeUser) => user.userId === record.userId
        );
        return (
          <div className="flex">
            <img
              src={record.songImage}
              alt={record.songName}
              style={{ width: "65px", height: "50px" }}
            />
            <div className="pl-5">
              <div>{record.songName}</div>
              <div style={{ fontSize: "14px", color: "gray" }}>
                <Link
                  to={`/detail-artists/${artist?.userId}`}
                  className="hover:text-green-500"
                >
                  {artist ? artist.name : ""}
                </Link>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Genre",
      dataIndex: "genreId",
      key: "genreId",
      render: (_: any, record: any) => {
        return record.genreName;
      },
      width: "20%",
    },
    {
      title: "Publish Date",
      dataIndex: "publicDate",
      key: "publicDate",
      render: (_: any, record: any) => {
        const formattedDate = moment(record.publicDate).format("DD/MM/YYYY");
        return <span>{formattedDate}</span>;
      },
      width: "15%",
    },
    {
      title: <ClockCircleOutlined />,
      dataIndex: "duration",
      key: "duration",
      width: "10%",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#0f1a1a",
        padding: 20,
        borderRadius: 10,
        color: "white",
      }}
    >
      <h1 className="text-2xl font-bold mb-5">
        Result: <span className="text-green-400">{keyword}</span>
      </h1>
      <Table
        columns={columns}
        dataSource={searchResults}
        rowKey="songId"
        className="custom-transparent-table"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50],
        }}
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () => setIdMusic(String(record.songId)),
        })}
      />
    </div>
  );
}

export default SearchSong;
