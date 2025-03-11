import { useEffect, useRef, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import styled from "styled-components";
import { message as toast } from "antd";

import useSubscription from "@/hooks/useSubscription";
import { SENTRY_CLASSES_COLOR_MAP, MOCK_SENTRY_DATA } from "@/utils/constant";
import { wgs84togcj02 } from "@/utils";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  // 这里优化的是地图体验，拖拽的时候鼠标是手的形状，符合地图的交互
  cursor: grab !important;
  &:active {
    cursor: grabbing !important;
  }
`;

function shapeMapCenter(centerStr: string): [number, number] {
  const arr = centerStr.split(",");
  return [+arr[0], +arr[1]];
}

export default function AMap() {
  const [mapInstance, setMapInstance] = useState<any>();
  const mapRef = useRef<any>(null);
  const sentryRef = useRef<any>(null);
  const [sentry, setSentry] = useState<any>();

  const { message } = useSubscription("nhy/sentinel");

  useEffect(() => {
    AMapLoader.load({
      key: "a25faef6cc513ad967f71fb38da2ab35", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ["AMap.ToolBar", "AMap.Scale", "AMap.MapType"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
      .then((AMap) => {
        setMapInstance(AMap);
        mapRef.current = new AMap.Map("map_container", {
          resizeEnable: true,
          dragEnable: true,
          // 80.095679, 32.529883 西藏阿里地区
          center: shapeMapCenter(import.meta.env.VITE_MAP_CENTER),
          // layers: [new AMap.TileLayer.Satellite()],
          zoom: 15,
        });
        // 添加比例尺
        const scale = new AMap.Scale();
        mapRef.current?.addControl(scale);
        // 添加工具条
        const toolbar = new AMap.ToolBar({
          position: "LT",
        });
        mapRef.current?.addControl(toolbar);
        // 地图类型切换
        const type = new AMap.MapType({
          defaultType: 1,
          showRoad: true,
          showTraffic: false,
        });
        mapRef.current?.addControl(type);
      })
      .catch((e) => {
        console.log(e);
      });

    /**
     * 模拟哨兵告警，每隔 20 秒告警一次
     */
    function generateMockSentry() {
      let i = 0;
      setInterval(() => {
        setSentry(MOCK_SENTRY_DATA[i]);
        i += 1;
      }, 1000 * 20);
    }
    generateMockSentry();
    return () => {
      mapRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!message) return;
    setSentry(message.value);
  }, [message]);

  useEffect(() => {
    // 每次收到告警，处理
    if (!sentry || !sentry?.deviceId) return;
    toast.warning(`收到告警信息，设备ID: ${sentry.deviceId}`);
    const generateMarker = (data: any) => {
      // 如果当前存在此设备的告警 timer，那么清除上一个定时器，并且立即执行移除 marker 的操作，后续才能新增 marker
      const target = sentryRef.current?.[data.deviceId];
      if (target?.timer && target?.marker) {
        clearTimeout(target.timer);
        mapRef.current?.remove(target.marker);
      }
      console.log(
        data.longitude,
        data.latitude,
        wgs84togcj02(data.longitude, data.latitude)
      );
      const marker = new mapInstance.Marker({
        position: wgs84togcj02(data.longitude, data.latitude),
        icon: "/assets/images/monitor-icon-red.svg",
        // 宽高都是 48，偏移量 x 是 24，y 是 45， 因为有 3px 的底部阴影
        offset: new mapInstance.Pixel(-24, -45),
      });

      marker.setMap(mapRef.current);

      // 设置鼠标划过点标记显示的文字提示
      marker.setTitle("我是marker的title");

      // 设置label标签
      // label默认蓝框白底左上角显示，样式className为：amap-marker-label
      marker.setLabel({
        offset: new mapInstance.Pixel(12, -10), //设置文本标注偏移量
        content: `<div class='sentry-container' style='line-height: 30px'>
            <img src='${data.warnRecord?.imageUrl}' />
            <div class="sentry-row"><h2 class="sentry-title">${
              data.deviceId
            }</h2></div>
            <div class="sentry-row"><span class="sentry-lnglat">[${
              data.longitude
            }, ${data.latitude}]</span></div>
            ${
              !data.warnRecord?.classes
                ? ""
                : "<div class='sentry-row'>" +
                  data.warnRecord?.classes
                    .map(
                      (c: string) =>
                        `<span class="sentry-classes ${SENTRY_CLASSES_COLOR_MAP[c]}">${c}</span>`
                    )
                    .join("") +
                  "</div>"
            }
            ${
              !data.warnRecord?.warnDatatime
                ? ""
                : "<div class='sentry-row'><span class='sentry-date'>" +
                  data.warnRecord?.warnDatatime +
                  "</span></div>"
            }
          </div>`, //设置文本标注内容
        direction: "top", //设置文本标注方位
      });
      const destroyMarker = () => {
        // 一分钟之后，在地图上移除此点标记，如果一分钟之内，又出现了告警，那么就清除上一个定时器
        const timer = setTimeout(() => {
          mapRef.current?.remove(marker);
          const sentries = sentryRef.current || {};
          sentryRef.current = {
            ...sentries,
            [data.deviceId]: {
              ...sentryRef.current[data.deviceId],
              marker: null,
              timer: null,
            },
          };
        }, 1000 * 60);
        return timer;
      };
      const timer = destroyMarker();
      return { marker, timer };
    };
    // 把告警信息添加到地图上
    const { marker, timer } = generateMarker(sentry);
    const sentries = sentryRef.current || {};
    const did = sentry.deviceId;
    sentryRef.current = {
      ...sentries,
      [did]: {
        ...sentries[did],
        marker,
        timer,
      },
    };
  }, [sentry, mapInstance]);

  return <Container id="map_container" />;
}
