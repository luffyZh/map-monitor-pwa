/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import mqtt, { MqttClient, IClientOptions } from "mqtt";
import MqttContext, { IMqttContext } from "./context";

export interface IMqttProviderProps {
  host: string;
  options?: IClientOptions;
  children: React.ReactNode;
  parser: (data: any) => any;
}

const MqttProvider = ({
  children,
  host,
  options,
  parser,
}: IMqttProviderProps) => {
  const [client, setClient] = useState<MqttClient | null>(null);

  useEffect(() => {
    // 使用提供的参数连接到 MQTT broker
    const mqttClient = mqtt.connect(host, options);

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT Broker!");
      // 连接成功之后才设置 client
      setClient(mqttClient);
    });

    // 组件卸载时断开连接
    return () => {
      console.log("Disconnecting from MQTT Broker");
      mqttClient.end();
    };
  }, [host, options]);

  const value: IMqttContext = useMemo<IMqttContext>(
    () => ({
      client,
      parser,
    }),
    [client, parser]
  );

  return <MqttContext.Provider value={value}>{children}</MqttContext.Provider>;
};

export default MqttProvider;
