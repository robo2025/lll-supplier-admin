import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
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
    '/prsp': {
      component: dynamicWrapper(app, [], () => import('../layouts/PRSPLayout')),
    },
    '/prsp/register': {
      component: dynamicWrapper(app, ['upload', 'user'], () => import('../routes/User/UserRegister')),
    },
    '/setting/userinfo': {
      component: dynamicWrapper(app, ['upload', 'user'], () => import('../routes/Setting/SupplierInfo')),
      name: '企业信息审核',
    },
    '/goods/list': {
      component: dynamicWrapper(app, ['good', 'product'], () => import('../routes/GoodsList')),
    },
    '/goods/new': {
      component: dynamicWrapper(app, ['product', 'good'], () => import('../routes/NewGood')),
    },
    '/goods/:list/modify': {
      component: dynamicWrapper(app, ['product', 'good', 'logs'], () => import('../routes/ModifyGood')),
      name: '修改商品信息',
    },
    '/goods/:list/detail': {
      component: dynamicWrapper(app, ['product', 'good', 'logs'], () => import('../routes/GoodDetail')),
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
    '/solution/list': {
      component: dynamicWrapper(app, ['solution'], () => import('../routes/SolutionManagement')),
      name: '方案询价列表',
    },
    '/solution/:list/detail': {
      component: dynamicWrapper(app, ['solution'], () => import('../routes/SolutionManagement/SolutionOrderDetail')),
      name: '方案询价详情',
    },
    '/solution/:list/solutionPriceQuotation': {
      component: dynamicWrapper(app, ['solution'], () => import('../routes/SolutionManagement/SolutionPriceQuotation')),
      name: '方案报价',
    },
    '/solution/:list/solutionDetail': {
      component: dynamicWrapper(app, ['solution'], () => import('../routes/SolutionManagement/SolutionDetail')),
      name: '方案详情',
    },
    '/solutionOrders/list': {
      component: dynamicWrapper(app, ['solutionOrders'], () => import('../routes/SolutionOrdersManagement')),
      name: '方案订单列表',
    },
    '/solutionOrders/:list/detail': {
      component: dynamicWrapper(app, ['solutionOrders'], () => import('../routes/SolutionOrdersManagement/SolutionOrderDetail')),
      name: '方案订单详情',
    },
  };

  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach((path) => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};

