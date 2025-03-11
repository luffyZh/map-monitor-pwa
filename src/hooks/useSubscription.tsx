/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState, useEffect, useCallback } from "react";
import { IClientSubscribeOptions } from "mqtt";
import { matches } from "mqtt-pattern";
import { message as toast } from "antd";
import { MqttContext } from "../utils/mqtt";
import { IMqttContext } from "../utils/mqtt/context";

type MQTTSubscriptionRes = {
  client: any;
  topic: string | string[];
  message:
    | {
        topic: string;
        value: any;
      }
    | undefined;
  error: any;
};

const useSubscription = (
  topic: string,
  options: IClientSubscribeOptions = { qos: 0 }
): MQTTSubscriptionRes => {
  const { client, parser } = useContext<IMqttContext>(MqttContext);
  const [message, setMessage] = useState<{
    topic: string;
    value: any;
  }>();

  const [error, setError] = useState<any>(null);

  const subscribe = useCallback(async () => {
    client?.subscribe(topic, options, (error) => {
      if (error) {
        setError(error);
        toast.error(`${error.message}: 订阅失败`);
      }
    });
  }, [client, options, topic]);

  const handleMessage = useCallback(
    (receivedTopic: string, receivedMessage: any) => {
      if ([topic].flat().some((rTopic) => matches(rTopic, receivedTopic))) {
        setMessage({
          topic: receivedTopic,
          value: parser(receivedMessage.toString()),
        });
        console.log("Receive message: ", {
          topic: receivedTopic,
          value: parser(receivedMessage.toString()),
        });
      }
    },
    [parser, topic]
  );

  useEffect(() => {
    if (client?.connected) {
      subscribe();

      client.on("message", handleMessage);
    }
    return () => {
      client?.off("message", handleMessage);
    };
  }, [handleMessage, client, subscribe]);

  return { client, topic, message, error };
};

export default useSubscription;
