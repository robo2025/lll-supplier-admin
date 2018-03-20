import '@babel/polyfill';
import 'url-polyfill';
import { hashHistory } from 'dva/router';
import dva from 'dva';
import 'moment/locale/zh-cn';
import FastClick from 'fastclick';
import createLoading from 'dva-loading';
import './g2';
import './rollbar';
import onError from './error';
import './index.less';
// 1. Initialize
const app = dva({
  history: hashHistory,
  onError,
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/user').default);
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
FastClick.attach(document.body);

export default app._store;
