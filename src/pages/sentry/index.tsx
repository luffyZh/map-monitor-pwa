import styled from "styled-components";
import { Button } from "antd";
import { TableOutlined } from "@ant-design/icons";

import AMap from "@/components/amap";
import { Link } from "react-router-dom";

const Container = styled.section`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ListLinkContainer = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
`;

export default function Sentry() {
  return (
    <Container>
      <AMap />
      <ListLinkContainer>
        <Link to="/query-list">
          <Button icon={<TableOutlined />} />
        </Link>
      </ListLinkContainer>
    </Container>
  );
}
