import React from 'react';
import moment from 'moment';
import {Table} from 'antd';
import { STOCK_OPERATION_TYPE } from "../../constant/statusList";
import { isMoment } from '../../../node_modules/moment';
export default class StockInOutTable extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        const {total,data,loading,current,pageSize,onTableChange} = this.props;
        data.map((ele,idx) => {
            ele.idx = idx +1;
        })
        const columns = [
            {
                title:"序号",
                dataIndex:'idx',
                key:"idx"
            },
            {
                title:"单号",
                dataIndex:'order_id',
                key:"order_id"
            },
            {
                title:"操作类型",
                dataIndex:'change_option',
                key:"change_option",
                render:val => <span>{STOCK_OPERATION_TYPE[val]}</span>
            },
            {
                title:"库存变动数量",
                dataIndex:'change_count',
                key:"change_count"
            },
            {
                title:"商品ID",
                dataIndex:'gno',
                key:"gno"
            },
            {
                title:"商品名称",
                dataIndex:'product_name',
                key:"product_name"
            },
            {
                title:"型号",
                dataIndex:'partnumber',
                key:"partnumber"
            },
            {
                title:"品牌",
                dataIndex:'brand_name',
                key:"brand_name"
            },
            {
                title:"产地",
                dataIndex:'registration_place',
                key:"registration_place"
            },
            {
                title:"操作人",
                dataIndex:'operator',
                key:"operator"
            },
            {
                title:"操作时间",
                dataIndex:'add_time',
                key:"add_time",
                render:val=><span>{moment(val*1000).format("YYYY-MM-DD HH:mm:ss")}</span>
            },
        ]
        const paginationOptions = {
            total,
            current,
            pageSize,
            showQuickJumper:true,
            showSizeChanger:true
        }
        return (
            <Table dataSource={data} columns={columns}
            loading={loading}
            rowKey={record => record.idx}
            onChange={onTableChange}
            pagination={paginationOptions}
            scroll={{x:1500}}

            />
        )
    }
}