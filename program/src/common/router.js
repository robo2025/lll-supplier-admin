import React from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  // eslint-disable-next-line no-underscore-dangle
  models: () => models.filter(m => !app._models.some(({ namespace }) => namespace === m)).map(m => import(`../models/${m}.js`)),
  // add routerData prop
  component: () => {
    const routerData = getRouterData(app);
    return component().then((raw) => {
      const Component = raw.default || raw;
      return props => <Component {...props} routerData={routerData} />;
    });
  },
});

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = item.name;
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = item.name;
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerData = {
    '/': {
      component: dynamicWrapper(app, ['user'], () => import('../layouts/BasicLayout')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/goods/list': {
      component: dynamicWrapper(app, ['good'], () => import('../routes/GoodsList')),
    },
    '/goods/new': {
      component: dynamicWrapper(app, ['product', 'good'], () => import('../routes/NewGood')),
    },
    '/goods/:list/modify': {
      component: dynamicWrapper(app, ['product', 'good'], () => import('../routes/ModifyGood')),
      name: '修改商品信息',
    },
    '/:goods/detail': {
      component: dynamicWrapper(app, ['product', 'good'], () => import('../routes/GoodDetail')),
    },
    '/deal/orders': {
      component: dynamicWrapper(app, ['orders', 'upload'], () => import('../routes/DealManagement/OrderList')),
    },
    '/deal/:orders/detail': {
      component: dynamicWrapper(app, ['orders'], () => import('../routes/DealManagement/OrderDetail')),
      name: '订单详情',
    },
    '/returns/list': {
      component: dynamicWrapper(app, ['orders'], () => import('../routes/ReturnsManagement/ReturnsList')),
    },
    '/returns/:list/detail': {
      component: dynamicWrapper(app, ['orders'], () => import('../routes/ReturnsManagement/ReturnsDetail')),
      name: '退货单详情',
    },
    '/refunds/list': {
      component: dynamicWrapper(app, ['orders'], () => import('../routes/RefundsManagement/RefundsList')),
      name: '退款单列表',
    },
    '/refunds/:list/detail': {
      component: dynamicWrapper(app, ['orders'], () => import('../routes/RefundsManagement/RefundDetail')),
      name: '退款单详情',
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  const routerDataWithName = {};
  Object.keys(routerData).forEach((item) => {
    routerDataWithName[item] = {
      ...routerData[item],
      name: routerData[item].name || menuData[item.replace(/^\//, '')],
    };
  });
  return routerDataWithName;
};
