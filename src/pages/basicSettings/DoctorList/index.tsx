import {
  EyeOutlined,
  KeyOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Space } from 'antd';
import React, { useRef } from 'react';

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

  // 表格列定义
  const columns: ProColumns<DoctorItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 100,
      fieldProps: {
        placeholder: '请输入医师姓名',
      },
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 80,
      search: false,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 80,
      search: false,
    },
    {
      title: '联系方式',
      dataIndex: 'contactMethod',
      width: 150,
      fieldProps: {
        placeholder: '输入手机号',
      },
    },
    {
      title: '工号',
      dataIndex: 'employeeNumber',
      width: 100,
      search: false,
    },
    {
      title: '入职时间',
      dataIndex: 'joinTime',
      width: 150,
      search: false,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<KeyOutlined />}
            onClick={() => handleResetPassword(record)}
          >
            重置密码
          </Button>
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

  const handleResetPassword = (record: DoctorItem) => {
    console.log('重置密码:', record);
    message.info(`重置 ${record.name} 的密码`);
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

  // 请求数据 - 使用 ProTable 传入的 params
  const fetchDoctorList = async (params: Record<string, any>) => {
    const mockData = getMockData();
    let filteredData = mockData;

    if (params.name) {
      filteredData = filteredData.filter((item) =>
        item.name.includes(params.name),
      );
    }

    if (params.contactMethod) {
      filteredData = filteredData.filter((item) =>
        item.contactMethod.includes(params.contactMethod),
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
      <ProTable<DoctorItem>
        headerTitle="医师列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={handleAdd}
          >
            添加
          </Button>,
        ]}
        request={fetchDoctorList}
        columns={columns}
        scroll={{ x: 1000 }}
        pagination={{
          pageSize: 10,
        }}
      />
    </PageContainer>
  );
};

export default DoctorList;
