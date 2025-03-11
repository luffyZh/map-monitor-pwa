import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tag,
  theme,
} from "antd";
import dayjs from "dayjs";
import { SYSTEM_COLOR_MAP } from "@/utils/constant";

const rangePresets = [
  {
    label: <Tag color={SYSTEM_COLOR_MAP.primary}>昨天</Tag>,
    value: [dayjs().add(-1, "d"), dayjs()],
  },
  {
    label: <Tag color={SYSTEM_COLOR_MAP.primary}>今天</Tag>,
    value: () => [dayjs().startOf("day"), dayjs().endOf("day")], // 5.8.0+ support function
  },
  {
    label: <Tag color={SYSTEM_COLOR_MAP.primary}>过去7天</Tag>,
    value: [dayjs().add(-7, "d"), dayjs()],
  },
  {
    label: <Tag color={SYSTEM_COLOR_MAP.primary}>过去15天</Tag>,
    value: [dayjs().add(-15, "d"), dayjs()],
  },
  {
    label: <Tag color={SYSTEM_COLOR_MAP.primary}>过去30天</Tag>,
    value: [dayjs().add(-30, "d"), dayjs()],
  },
  {
    label: <Tag color={SYSTEM_COLOR_MAP.primary}>过去90天</Tag>,
    value: [dayjs().add(-90, "d"), dayjs()],
  },
];

type SearchFormProps = {
  onFilterChange: (filter: any) => void;
};

const SearchForm = ({ onFilterChange }: SearchFormProps) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const formStyle: React.CSSProperties = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    const { classes, deviceId, exceptionFlag, range } = values;
    const filters = {
      classes,
      deviceId,
      exceptionFlag,
      warnStartDatetime: range?.[0].format("YYYY-MM-DD HH:mm:ss"),
      warnEndDatetime: range?.[1].format("YYYY-MM-DD HH:mm:ss"),
    };
    onFilterChange(filters);
  };

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={5}>
          <Form.Item name="deviceId" label="设备ID">
            <Input placeholder="输入想查询的设备ID" />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item name="exceptionFlag" label="设备状态">
            <Select
              options={[
                {
                  key: "all",
                  label: "全部",
                  value: -1,
                },
                {
                  key: "normal",
                  label: "正常",
                  value: "E00",
                },
                {
                  key: "lowpowser",
                  label: "电量低",
                  value: "E01",
                },
                {
                  key: "gpserror",
                  label: "GPS失效",
                  value: "E02",
                },
              ]}
              placeholder="选择设备状态"
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item name="classes" label="识别类别">
            <Select
              mode="multiple"
              options={[
                {
                  key: "person",
                  label: "人",
                  value: 0,
                },
                {
                  key: "car",
                  label: "车",
                  value: 1,
                },
                {
                  key: "uav",
                  label: "无人机",
                  value: 2,
                },
              ]}
              placeholder="选择识别类别"
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={9}>
          <Form.Item name="range" label="时间范围">
            <DatePicker.RangePicker
              // @ts-ignore
              presets={rangePresets}
              style={{ width: "100%" }}
              showTime={{ format: "HH:mm:ss" }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
        </Col>
      </Row>
      <div style={{ textAlign: "right" }}>
        <Space size="small">
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
            }}
          >
            重置
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default SearchForm;
