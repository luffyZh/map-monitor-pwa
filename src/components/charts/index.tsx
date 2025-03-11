import styled from "styled-components";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const Container = styled.section`
  position: relative;
  display: flex;
  margin-bottom: 20px;
`;

const ChartContainer = styled.div`
  width: 49%;
  margin-right: 1%;
`;

const chartData = [
  {
    date: "2024-03-01",
    count: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    date: "2024-03-02",
    count: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    date: "2024-03-03",
    count: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    date: "2024-03-04",
    count: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    date: "2024-03-05",
    count: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    date: "2024-03-06",
    count: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    date: "2024-03-07",
    count: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const pieData = [
  { name: "人", value: 400 },
  { name: "车", value: 300 },
];

const COLORS = ["#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <>
      <text
        x={x}
        y={y - 10}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${pieData[index].name} ${pieData[index].value}`}
      </text>
      <text
        x={x}
        y={y + 8}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </>
  );
};

export default function Charts() {
  return (
    <Container>
      <ChartContainer>
        <AreaChart
          width={730}
          height={250}
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            {/* <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient> */}
          </defs>
          <XAxis dataKey="date" />
          <YAxis dataKey="count" />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          {/* <Area
            type="monotone"
            dataKey="pv"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorPv)"
          /> */}
        </AreaChart>
      </ChartContainer>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Container>
  );
}
