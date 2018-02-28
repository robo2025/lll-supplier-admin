const menuData = [{
  name: '商品管理',
  icon: 'dashboard',
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
    {
      name: '修改商品信息',
      path: 'modify',
    },
  ],
}, {
  name: '使用文档',
  icon: 'book',
  path: 'http://blog.liaolunling.top',
  target: '_blank',
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
