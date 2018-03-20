const menuData = [{
  name: '商品管理',
  icon: 'shop',
  path: 'goods',
  children: [
    {
      name: '商品列表',
      path: 'list',
    },
    {
      name: '新增商品信息',
      path: 'new',
    },
  ],
}, {
  name: '交易管理',
  icon: 'credit-card',
  path: 'deal',
  children: [
    {
      name: '客户订单列表',
      path: 'orders',
    },
  ],
}, {
  name: '退货管理',
  icon: 'check-square-o',
  path: 'returns',
  children: [
    {
      name: '退货单列表',
      path: 'list',
    },
  ],
}, {
  name: '退款管理',
  icon: 'check-square',
  path: 'refunds',
  children: [
    {
      name: '退款单列表',
      path: 'list',
    },
  ],
}];

function formatter(data, parentPath = '') {
  const list = [];
  data.forEach((item) => {
    if (item.children) {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
        children: formatter(item.children, `${parentPath}${item.path}/`),
      });
    } else {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
      });
    }
  });
  return list;
}

export const getMenuData = () => formatter(menuData);
