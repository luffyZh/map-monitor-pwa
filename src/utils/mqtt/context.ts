/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { MqttClient } from "mqtt";

export interface IMqttContext {
  client: MqttClient | null;
  parser: (data: any) => any;
}

// 创建一个符合 IMqttContext 类型的默认值
const defaultMqttContext: IMqttContext = {
  client: null,
  parser: (data: any) => data,
};

// 创建一个 Context 对象，它将用于向子组件提供 MQTT 客户端实例
const MqttContext = React.createContext<IMqttContext>(defaultMqttContext);

export default MqttContext;
