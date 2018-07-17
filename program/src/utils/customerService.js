
/* eslint-disable */
const service = {
    initService(param) {
        (function (w, d, s, n, a, e) {
            w[n] = w[n] || function () { (w[n].z = w[n].z || []).push(arguments); };
            a = d.createElement(s), e = d.getElementsByTagName(s)[0];
            a.async = 1; a.charset = 'UTF-8';
            a.src = 'https://pubres.aihecong.com/hecong.js';
            e.parentNode.insertBefore(a, e);
        }(window, document, 'script', '_AIHECONG'));
        _AIHECONG('update');
        _AIHECONG('ini', { entId: 10132 });
        const userName = param.username || '未登录';
        const mobile = param.mobile || '未登录';
        const email = param.email||'无'
        const href = location.href;
        _AIHECONG('customer', {
            名称: userName, // '属性名' : '值'
            手机: mobile,
            邮箱:email,
            // 如果需要让显示在对话面板右侧的顾客参数带链接，可以用下面的方式
            // 需要注意链接类型的参数 属性名 不能与顾客名片字段一样，只能归类到自定义信息
            访问页面: href,
        });
    },
};
export default {
    service,
};

