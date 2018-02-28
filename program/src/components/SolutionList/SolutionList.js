import React from 'react';
import { List, Avatar } from 'antd';
import { withRouter } from 'dva/router';
import styles from './solution-list.less';
/*
const data = [
  {
    title: '方案一',
    desc:'方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述'
  },
  {
    title: '方案二',
    desc:'方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述'
  },
  {
    title: '方案三',
    desc:'方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述'
  },
  {
    title: '方案四',
    desc:'方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述方案一描述'
  },
];
*/

@withRouter
class SolutionList extends React.Component {
  constructor(props) {
    super(props);
    this.jumpToDetail = this.jumpToDetail.bind(this);
  }

  // 跳转到需求-方案详情页
  jumpToDetail(reqId, solutionId, e) {
    e.preventDefault();
    console.log('跳转', reqId, solutionId, this.props);
    this.props.history.push(`/solution/detail?solution_id=${solutionId}`);
  }

  render() {
    // console.log("需求列表接收数据：",this.props);
    const data = this.props.data;
    return (
      <List
        itemLayout="horizontal"
        className={styles['solution-list']}
        locale={{ emptyText: '还没有方案商提供解决方案' }}
        dataSource={data}
        renderItem={item => (
          <List.Item actions={[<a className="more" onClick={this.jumpToDetail.bind(this, item.req_id, item.id)}>详情</a>]}>
            <List.Item.Meta
              avatar={<Avatar shape="square" src={require('./solution-icon.png')} style={{ backgroundColor: '#fff' }} />}
              title={<a href="javascript:void(0)">{item.title}</a>}
              description={item.desc}
            />
          </List.Item>
        )}
      />
    );
  }
}


export default SolutionList;
