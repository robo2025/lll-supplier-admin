import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import Test from './routes/Test/Test';

import styles from './index.less';

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const PRSPLayout = routerData['/prsp'].component;
  const BasicLayout = routerData['/'].component;
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/user" render={props => <UserLayout {...props} />} />
          <Route path="/prsp" render={props => <PRSPLayout {...props} />} />
          <Route path="/test" component={Test} />
          <Route path="/" render={props => <BasicLayout {...props} />} />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
