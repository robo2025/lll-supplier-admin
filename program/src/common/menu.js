import { isUrl } from '../utils/utils';

const menuData = [{
  name: '商品管理',
  icon: 'shop',
  path: 'goods',
  authority: '2',
  children: [
    {
      name: '商品列表',
      path: 'list',
    },
    {
      name: '新建商品信息',
      path: 'new',
    },
  ],
}, {
  name: '交易管理',
  icon: 'credit-card',
  path: 'deal',
  authority: '2',
  children: [
    {
      name: '商品订单列表',
      path: 'orders',
    },
  ],
}, {
  name: '退货管理',
  icon: 'check-square-o',
  path: 'returns',
  authority: '2',
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
  authority: '2',
  children: [
    {
      name: '退款单列表',
      path: 'list',
    },
  ],
}, {
  name: '方案询价管理',
  icon: 'solution',
  path: 'solution',
  authority: '2',
  children: [
    {
      name: '询价单列表',
      path: 'list',
    },
  ],
}];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
