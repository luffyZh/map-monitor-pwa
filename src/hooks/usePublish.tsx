/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState, useCallback, useEffect } from "react";
import { IClientPublishOptions } from "mqtt";
import { MqttContext } from "../utils/mqtt";
import { IMqttContext } from "../utils/mqtt/context";

export interface ITopicResponse {
  topic: string;
  message: string;
  correlationData: string;
}

type MqttPublishRes = {
  publish: (topic: string, message: string) => void;
  response: ITopicResponse | null;
  error: any;
};

const usePublish = (
  responseTopic: string,
  correlationData: any
): MqttPublishRes => {
  const { client, parser } = useContext<IMqttContext>(MqttContext);
  const [response, setResponse] = useState<ITopicResponse | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!client) return;
    // 订阅 MQTT 主题
    client.subscribe(responseTopic, (err: any) => {
      if (err) {
        setError(err);
      }
    });
    // 创建一个处理响应消息的监听器
    const handleMessage = (topic: string, message: any, packet: any) => {
      // 检查是否有 responseTopic 和 correlationData
      if (
        topic === responseTopic &&
        packet.properties &&
        packet.properties.correlationData
      ) {
        setResponse({
          topic: topic,
          message: parser(message.toString()),
          correlationData: packet.properties.correlationData.toString(),
        });
      }
    };

    client.on("message", handleMessage);

    // 清理函数
    return () => {
      if (client) {
        client.removeListener("message", handleMessage);
      }
    };
  }, [client, parser]);

  const publish = useCallback(
    (publishTopic: string, message: string) => {
      if (!client) {
        setError(new Error("MQTT Client not connected"));
        return;
      }
      const publishOptions = {
        qos: 2,
        properties: {
          responseTopic,
          correlationData,
        },
      } as IClientPublishOptions;
      client.publish(publishTopic, message, publishOptions);
    },
    [client, responseTopic, correlationData]
  );

  return { publish, response, error };
};

export default usePublish;
