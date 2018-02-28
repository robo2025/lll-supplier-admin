import React from 'react';
import './my-solution-list.less';
import { withRouter } from 'dva/router';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim';
import { Button, Modal, message, Badge } from 'antd';

const confirm = Modal.confirm;

// 需求列表组件
const List = ({ data, dispatch, viewOnly }) => {
  // console.log("List组件:",data);
  return (
    <div className="demand-list">
      <QueueAnim
        delay={300}
        className="queue-simple"
        duration={1000}
      >
        {
        data.map((val, idx) => {
          return <ListItem key={idx} index={idx} viewOnly={viewOnly} data={val} dispatch={dispatch} />;
        })
      }
      </QueueAnim>
    </div>
  );
};

/* 单个需求组件 */
@withRouter
class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.jumpToDetail = this.jumpToDetail.bind(this);
    this.viewSolution = this.viewSolution.bind(this);
    this.editSolution = this.editSolution.bind(this);
    this.deleteSolution = this.deleteSolution.bind(this);
  }

  // 跳转到对应需求详情页
  jumpToDetail(reqId, solutionId) {
    if (this.props.viewOnly) {
      this.props.history.push(`/me/solution?req_id=${reqId}`);
    } else {
      this.props.history.push(`/detail?req_id=${reqId}`);
    }
  }

  // 查看提案
  viewSolution(reqId, e) {
    e.stopPropagation();
    this.jumpToDetail(reqId);
    console.log('查看提案', reqId);
  }

  // 修改提案
  editSolution(reqId, e) {
    e.stopPropagation();
    console.log('编辑提案', reqId);
    this.props.history.push(`me/solution?viewOnly=edit&req_id=${reqId}`);
  }

  // 删除提案|撤销提案
  deleteSolution(solutionId, e) {
    e.stopPropagation();
    this.showDeleteConfirm(this.deleteFun.bind(this, solutionId), this.cancelDelete);
    console.log('删除提案', solutionId);
  }
  // -弹窗：确定删除执行事件
  deleteFun(solutionId) {
    this.props.dispatch({
      type: 'solutions/removeMySolution',
      solutionId,
    });
    console.log(`你要删除${solutionId}号方案`);
    message.success('删除成功');
  }
  // -弹窗：取消删除执行事件
  cancelDelete() {
    message.info('你取消了删除');
  }

  // 删除全局提示框
  showDeleteConfirm(okFunc, cancelFunc) {
    confirm({
      title: '确定要删除这条需求吗?',
      content: '删除后不可恢复',
      okText: '删除',
      okType: 'danger',
      cancelText: '返回',
      onOk() {
        okFunc();
      },
      onCancel() {
        cancelFunc();
      },
    });
  }

  render() {
    // console.log("listItem",this.props);
    const data = this.props.data;

    // 将服务器代码转换成需求类型
    function getReqType(code) {
      switch (code) {
        case 'si':
          return '系统集成';
        case 'purchase':
          return '产品购买';
        case 'tech':
          return '技术支持';
        case 'other':
          return '其它';
        default:
          return '其它类型';
      }
    }

    // 将服务器代码转换成需求周期
    function getExceptCycle(code) {
      switch (code) {
        case 1:
          return '7天内';
        case 2:
          return '1~3月';
        case 3:
          return '3~6月';
        case 4:
          return '6~12月';
        case 5:
          return '一年以上';
        default:
          return '不限时间';
      }
    }

    // 将服务器代码转换成需求状态
    function getReqStatus(code) {
      switch (code) {
        case 0:
          return '审核中';
        case 1:
          return '已审核';
        default:
          return '审核中';
      }
    }

    // badge不同状态的样式
    const styles = {
      pass: {
        backgroundColor: '#52c41a',
      },
      reviewing: {
        backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset',
      },
    };

    return (
      <div className="ly-item" onClick={this.jumpToDetail.bind(this, data.id)}>
        <div className="hd demand-abstract clearfix">
          <h2 className="title">
            {data.title}
            {
             /* (this.props.location.pathname === "/me") ?
                <Badge count={getReqStatus(data.status)} style={data.status == 1 ? styles.pass : styles.reviewing}>
                  {data.title}
                </Badge> :
                <span>{data.title}</span> */
            }

            {/*  <span
              className={`type ${this.props.viewOnly ? '' : 'active'}`}
              style={{float: 'right'}}
            >
              {getReqType(data.req_type)}
            </span> */}
            <span
              className="type"
              style={{ float: 'right' }}
            >
              期限:&nbsp;{getExceptCycle(data.except_cycle)}
            </span>
            <span
              className="type price"
              style={{ float: 'right' }}
            >
              报价: &nbsp;￥{data.budget}
            </span>
          </h2>
          {/* <span className='price'>￥{data.budget}</span> */}
          {/* <span className='limit'>需求期限：{getExceptCycle(data.except_cycle)}</span> */}
        </div>
        <div className="bd demand-info">
          <p className="desc">{data.desc}</p>
        </div>
        <div className="ft demand-remark">
          {/* <span>9 个公司提供方案</span> */}
          <span>{data.created_time}</span>
          <span>{getReqStatus(data.status)}</span>
          {
            this.props.location.pathname === '/me' ?
              (
                <div className="ly-btn-group">
                  <Button
                    size="small"
                    onClick={this.viewSolution.bind(this, data.id)}
                  >
                  我的提案
                  </Button>
                  <Button
                    size="small"
                    onClick={this.editSolution.bind(this, data.id)}
                  >
                  修改提案
                  </Button>
                  <Button
                    size="small"
                    onClick={this.deleteSolution.bind(this, data.solution_id)}
                  >
                  撤销提案
                  </Button>
                </div>
) : null
          }

        </div>
      </div>
    );
  }
}


/* 暴露需求列表组件 */
@connect()
class MySolutionList extends React.Component {
  render() {
    const demandList = this.props.data;
    return (
      <List data={demandList} {...this.props} />
    );
  }
}


export default MySolutionList;
