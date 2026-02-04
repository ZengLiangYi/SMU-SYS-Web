import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Input, message, Space } from 'antd';
import React, { useRef, useState } from 'react';
import './index.less';
import {
  EyeOutlined,
  KeyOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';

interface DoctorItem {
  id: string;
  name: string;
  gender: string;
  age: string;
  contactMethod: string;
  employeeNumber: string;
  joinTime: string;
}

const DoctorList: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [searchName, setSearchName] = useState<string>('');
  const [searchPhone, setSearchPhone] = useState<string>('');
  const [filteredName, setFilteredName] = useState<string>('');
  const [filteredPhone, setFilteredPhone] = useState<string>('');

  // 表格列定义
  const columns: ProColumns<DoctorItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 80,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 80,
    },
    {
      title: '联系方式',
      dataIndex: 'contactMethod',
      width: 150,
    },
    {
      title: '工号',
      dataIndex: 'employeeNumber',
      width: 100,
    },
    {
      title: '入职时间',
      dataIndex: 'joinTime',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space className="action-items">
          <div className="action-item" onClick={() => handleViewDetail(record)}>
            <EyeOutlined />
            <span> 详情</span>
          </div>
          <div className="action-item" onClick={() => handleViewQRCode(record)}>
            <KeyOutlined />
            <span> 重置密码</span>
          </div>
        </Space>
      ),
    },
  ];

  // 操作处理函数
  const handleAdd = () => {
    console.log('添加医师');
  };

  const handleViewDetail = (record: DoctorItem) => {
    console.log('查看详情:', record);
  };

  const handleViewQRCode = (record: DoctorItem) => {
    console.log('查看密码:', record);
    message.info(`查看 ${record.name} 的密码`);
  };

  const handleQuery = () => {
    setFilteredName(searchName);
    setFilteredPhone(searchPhone);
    actionRef.current?.reload();
  };

  const handleReset = () => {
    setSearchName('');
    setSearchPhone('');
    setFilteredName('');
    setFilteredPhone('');
    actionRef.current?.reload();
  };

  // 获取模拟数据
  const getMockData = (): DoctorItem[] => {
    return [
      {
        id: '1',
        name: '胡超',
        gender: '男',
        age: '78岁',
        contactMethod: '19829548475',
        employeeNumber: '001',
        joinTime: '1988年03月26日',
      },
      {
        id: '2',
        name: '田妍',
        gender: '女',
        age: '78岁',
        contactMethod: '14084285534',
        employeeNumber: '001',
        joinTime: '1970年07月13日',
      },
      {
        id: '3',
        name: '钱强',
        gender: '女',
        age: '78岁',
        contactMethod: '19130679814',
        employeeNumber: '001',
        joinTime: '1971年07月15日',
      },
      {
        id: '4',
        name: '钱真',
        gender: '男',
        age: '78岁',
        contactMethod: '16569991040',
        employeeNumber: '001',
        joinTime: '2016年03月06日',
      },
      {
        id: '5',
        name: '侯霞',
        gender: '女',
        age: '78岁',
        contactMethod: '19532627819',
        employeeNumber: '001',
        joinTime: '1981年03月27日',
      },
      {
        id: '6',
        name: '鲍玲',
        gender: '男',
        age: '78岁',
        contactMethod: '17705230984',
        employeeNumber: '001',
        joinTime: '2021年09月17日',
      },
      {
        id: '7',
        name: '孟亨',
        gender: '女',
        age: '78岁',
        contactMethod: '16410083786',
        employeeNumber: '001',
        joinTime: '1990年01月16日',
      },
      {
        id: '8',
        name: '王帮',
        gender: '男',
        age: '78岁',
        contactMethod: '19516815745',
        employeeNumber: '001',
        joinTime: '2011年01月18日',
      },
      {
        id: '9',
        name: '曹伦',
        gender: '男',
        age: '78岁',
        contactMethod: '19966265926',
        employeeNumber: '001',
        joinTime: '1980年06月08日',
      },
      {
        id: '10',
        name: '傅洁',
        gender: '女',
        age: '78岁',
        contactMethod: '19090346409',
        employeeNumber: '001',
        joinTime: '2022年10月09日',
      },
    ];
  };

  // 请求数据
  const fetchDoctorList = async (_params: any) => {
    const mockData = getMockData();
    let filteredData = mockData;

    if (filteredName) {
      filteredData = filteredData.filter((item) =>
        item.name.includes(filteredName),
      );
    }

    if (filteredPhone) {
      filteredData = filteredData.filter((item) =>
        item.contactMethod.includes(filteredPhone),
      );
    }

    return {
      data: filteredData,
      success: true,
      total: filteredData.length,
    };
  };

  return (
    <PageContainer>
      <div className="doctor-list-page">
        <div className="doctor-list-card">
          <div className="toolbar">
            <div className="toolbar-left">
              <div className="toolbar-item">
                <span className="toolbar-label">姓名：</span>
                <Input
                  placeholder="请输入医师姓名"
                  allowClear
                  style={{ width: 240 }}
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
              <div className="toolbar-item">
                <span className="toolbar-label">手机号：</span>
                <Input
                  placeholder="输入手机号"
                  allowClear
                  style={{ width: 240 }}
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="toolbar-right">
              <Button
                className="add-button"
                variant="outlined"
                onClick={handleAdd}
              >
                <PlusCircleOutlined />
                添加
              </Button>
              <Button
                className="query-button"
                variant="solid"
                onClick={handleQuery}
              >
                <SearchOutlined />
                查询
              </Button>
              <Button
                className="reset-button"
                variant="outlined"
                onClick={handleReset}
              >
                <ReloadOutlined />
                重置
              </Button>
            </div>
          </div>

          <ProTable<DoctorItem>
            actionRef={actionRef}
            rowKey="id"
            search={false}
            options={{
              reload: false,
              density: false,
              fullScreen: false,
              setting: false,
            }}
            request={fetchDoctorList}
            columns={columns}
            scroll={{ x: 1000 }}
            pagination={{
              pageSize: 10,
            }}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default DoctorList;
