import { isUrl } from '../utils/utils';

const menuData = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    name: '方案订单管理',
    icon: 'file-text',
    path: 'solutionOrders',
    authority: '2',
    children: [
      {
        name: '方案订单列表',
        path: 'list',
      },
    ],
  },
  {
    name: '库存管理',
    path: 'stockManagement',
    icon: 'api',
    authority: '2',
    children: [
      {
        name: '商品库存列表',
        path: 'goodsStockList',
      },
      {
        name: '出入库记录',
        path: 'GoodsInOutList',
      },
    ],
  },
  {
    name: '企业信息',
    icon: 'user',
    path: 'setting/userInfo',
  },
  {
    name: '合同管理',
    path: 'contractManagement',
    icon: 'code-o',
    authority: '2',
    children: [
      {
        name: '合同列表',
        path: 'contractList',
      },
    ],
  },
  {
    name: '帐号管理',
    path: 'accountManagement',
    icon: 'bar-chart',
    children: [
      {
        name: '帐号列表',
        path: 'accountList',
      },
    ],
  },
  {
    name: '财务结算',
    path: 'financialSettlement',
    icon: 'credit-card',
    children: [
      {
        name: '任务中心',
        path: 'taskCenter',
        children: [
            {
                name: '对账处理',
                path: 'reconcileProcess',
            },
        ],
      },
    ],
  },
];

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
      result.children = formatter(
        item.children,
        `${parentPath}${item.path}/`,
        item.authority
      );
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
