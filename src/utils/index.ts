// @ts-ignore
import coordtransform from 'coordtransform';

export function noop() {}

/**
 * wgs84坐标转国测局
 * wgs84: 谷歌国外以及绝大部分国外在线地图使用的坐标
 * gcj02: 国测局坐标，火星坐标系（高德地图在用）
 * @param lng
 * @param lat
 * @returns
 */
export function wgs84togcj02(lng: number, lat: number): [number, number] {
  const coord = coordtransform.wgs84togcj02(lng, lat);
  return coord;
}