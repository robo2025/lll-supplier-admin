const permissionDetail = [
  {
    code: 'contract_all',
    name: '合同管理',
  },
  {
    code: 'goods_all',
    name: '商品管理',
  },
  {
    code: 'bus_scope_all',
    name: '经营范围',
  },
  {
    code: 'trande_all',
    name: '交易管理',
  },
  {
    code: 'stock_all',
    name: '库存管理',
  },
  {
    code: 'return_all',
    name: '退货管理',
  },
  {
    code: 'refund_all',
    name: '退款管理',
  },
  {
    code: 'sln_quote_all',
    name: '方案询价管理',
  },
  {
    code: 'sln_order_all',
    name: '方案订单管理',
  },
  {
    code: 'account_management_all',
    name: '账号管理',
  },
  {
    code: 'financial_settlement_all',
    name: '财务结算',
  },
  // {
  //   code: 'company_all',
  //   name: '企业信息',
  // },
];
const allPermissions = permissionDetail.map(item => item.name);

const convertCodeToName = (codeList) => {
  if (!codeList) {
    return [];
  } else {
    let result = [];
     codeList.map((code) => {
      return permissionDetail.map((item) => {
        if (item.code === code) {
          result = [...result, item.name];
        }
        return null;
      });
    });
    return result;
  }
};
const convertNameToCode = (nameList) => {
  if (!nameList) {
    return [];
  } else {
    let result = [];
    nameList.map((name) => {
      return permissionDetail.map((item) => {
        if (item.name === name) {
          result = [...result, item.code];
        }
        return null;
      });
    });
    return result;
  }
};
export default permissionDetail;
export { permissionDetail, allPermissions, convertCodeToName, convertNameToCode };
