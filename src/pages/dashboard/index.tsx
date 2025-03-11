import React, { useEffect } from "react";
import styled from "styled-components";
import { Image, Table, Tag, Progress, Divider, message } from "antd";
import { green, red, orange } from "@ant-design/colors";
import type { TableProps } from "antd";

import { SYSTEM_COLOR_MAP } from "@/utils/constant";
import SearchForm from "./search-form";

const Container = styled.section`
  position: relative;
  width: 100%;

  .ant-table-tbody tr td {
    padding: 10px 16px;
  }

  .ant-table-footer {
    padding: 10px 16px;
  }
`;

const BgContainer = styled.div`
  margin: 16px;
  padding: 16px;
  border-radius: 8px;
  background-color: ${SYSTEM_COLOR_MAP.white};
`;

interface DataType {
  deviceId: string;
  longitude: number;
  latitude: number;
  warnDatetime: string;
  imageUrl: string;
  battery: number;
  exceptionFlag: string;
  classes: string[];
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "设备ID",
    dataIndex: "deviceId",
    key: "deviceId",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "经纬度",
    dataIndex: "lat_lng",
    key: "lat_lng",
    render: (_, record) => (
      <span>
        [{record.longitude}, {record.latitude}]
      </span>
    ),
  },
  {
    title: "哨兵状态",
    dataIndex: "exceptionFlag",
    key: "exceptionFlag",
    render: (_, { exceptionFlag }) => (
      <Tag color={exceptionFlag === "正常" ? "green" : "red"}>
        {exceptionFlag}
      </Tag>
    ),
  },
  {
    title: "哨兵电量",
    dataIndex: "battery",
    key: "battery",
    render: (val) => (
      <Progress
        percent={val === 100 ? 99 : val}
        steps={10}
        size="small"
        strokeColor={val >= 70 ? green[6] : val <= 30 ? red[6] : orange[6]}
      />
    ),
  },
  {
    title: "告警时间",
    key: "warnDatetime",
    dataIndex: "warnDatetime",
  },
  {
    title: "告警类型",
    key: "classes",
    render: (_, record) =>
      record.classes.map((tag) => {
        return <Tag key={tag}>{tag}</Tag>;
      }),
  },
  {
    title: "告警图片",
    key: "imageUrl",
    // eslint-disable-next-line
    render: (record) => {
      return <Image height={60} width={100} src={record.imageUrl} />;
    },
  },
];

const Dashboard: React.FC = () => {
  const [list, setList] = React.useState([]);
  const [pagination, setPagination] = React.useState<{
    current: number;
    pageSize: number;
    total: number;
  }>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filterCondition, setFilterCondition] = React.useState<any>({
    exceptionFlag: undefined,
    classes: undefined,
    warnStartDatetime: undefined,
    warnEndDatetime: undefined,
  });

  const fetchQueryList = () => {
    const data = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      filterCondition,
    };
    fetch(
      `${import.meta.env.VITE_HTTP_HOST}:${
        import.meta.env.VITE_HTTP_PORT
      }/sentinel/warn/query`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setList(res.data?.records || []);
        setPagination({
          ...pagination,
          total: res.data?.total || 0,
        });
      })
      .catch((e) => {
        message.error(`${e.message}: 获取列表失败`);
      });
  };

  const onPageChange = (page: any) => {
    const { current, pageSize } = page;
    setPagination({
      ...pagination,
      current,
      pageSize: pageSize || 10,
    });
  };

  useEffect(() => {
    fetchQueryList();
  }, [pagination.current, pagination.pageSize, filterCondition]);

  return (
    <Container>
      <BgContainer>
        <SearchForm onFilterChange={setFilterCondition} />
        <Divider />
        <Table
          rowKey={(record) => `${record.deviceId}_${record.warnDatetime}`}
          columns={columns}
          dataSource={list}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => (
              <>
                共{" "}
                <span style={{ color: "red", fontSize: "1.5rem" }}>
                  {total}
                </span>{" "}
                条,
              </>
            ),
          }}
          onChange={onPageChange}
          // footer={() => (
          //   <>
          //     告警总数:{" "}
          //     <span
          //       style={{
          //         display: "inline-block",
          //         color: pagination.total ? red[6] : green[6],
          //         fontSize: 18,
          //         marginLeft: 10,
          //       }}
          //     >
          //       {pagination.total || "暂无告警"}
          //     </span>
          //   </>
          // )}
        />
      </BgContainer>
    </Container>
  );
};

export default Dashboard;
