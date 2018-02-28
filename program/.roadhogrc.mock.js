import mockjs from 'mockjs';
import {getNotices} from './mock/notices';
import {format, delay} from 'roadhog-api-doc';
import {URL1} from "./src/constant/config";

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
};

export default noProxy ? {} : delay(proxy, 1000);
