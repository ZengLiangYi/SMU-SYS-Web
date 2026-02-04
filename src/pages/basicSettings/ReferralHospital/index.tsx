import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Image } from 'antd';
import React, { useRef } from 'react';

interface HospitalItem {
  id: string;
  hospitalLogo: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalPhone: string;
  contactDoctorName: string;
  position: string;
  contactMethod: string;
  createTime: string;
}

// 医院 valueEnum
const hospitalValueEnum = {
  大医院: { text: '大医院' },
};

const ReferralHospital: React.FC = () => {
  const actionRef = useRef<ActionType>(null);

  // 表格列定义
  const columns: ProColumns<HospitalItem>[] = [
    {
      title: '医院logo',
      dataIndex: 'hospitalLogo',
      width: 100,
      search: false,
      render: (_, record) => (
        <Image
          src={record.hospitalLogo}
          alt={record.hospitalName}
          width={50}
          height={50}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: '医院名称',
      dataIndex: 'hospitalName',
      width: 150,
      valueType: 'select',
      valueEnum: hospitalValueEnum,
      fieldProps: {
        placeholder: '全部',
      },
    },
    {
      title: '医院地址',
      dataIndex: 'hospitalAddress',
      width: 200,
      search: false,
    },
    {
      title: '医院电话',
      dataIndex: 'hospitalPhone',
      width: 150,
      search: false,
    },
    {
      title: '对接医师姓名',
      dataIndex: 'contactDoctorName',
      width: 120,
      fieldProps: {
        placeholder: '请输入医师名称',
      },
    },
    {
      title: '职位',
      dataIndex: 'position',
      width: 100,
      search: false,
    },
    {
      title: '联系方式',
      dataIndex: 'contactMethod',
      width: 150,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 120,
      search: false,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          修改
        </Button>
      ),
    },
  ];

  // 操作处理函数
  const handleAdd = () => {
    console.log('添加医院');
  };

  const handleEdit = (record: HospitalItem) => {
    console.log('编辑医院:', record);
  };

  // 获取模拟数据
  const getMockData = (): HospitalItem[] => {
    return [
      {
        id: '1',
        hospitalLogo: '/images/avatar.png',
        hospitalName: '大医院',
        hospitalAddress: '广东省深圳市',
        hospitalPhone: '028-94929624',
        contactDoctorName: '胡义',
        position: '医师',
        contactMethod: '17628793910',
        createTime: '1971/07/14',
      },
      {
        id: '2',
        hospitalLogo: '/images/avatar.png',
        hospitalName: '大医院',
        hospitalAddress: '广东省深圳市',
        hospitalPhone: '056-88541248',
        contactDoctorName: '邵明',
        position: '医师',
        contactMethod: '16895370474',
        createTime: '1987/02/13',
      },
      {
        id: '3',
        hospitalLogo: '/images/avatar.png',
        hospitalName: '大医院',
        hospitalAddress: '广东省深圳市',
        hospitalPhone: '0293-55869390',
        contactDoctorName: '侯寒',
        position: '医师',
        contactMethod: '15375403923',
        createTime: '1978/04/04',
      },
      {
        id: '4',
        hospitalLogo: '/images/avatar.png',
        hospitalName: '大医院',
        hospitalAddress: '广东省深圳市',
        hospitalPhone: '0291-7291556',
        contactDoctorName: '丁政',
        position: '医师',
        contactMethod: '18427000782',
        createTime: '2019/07/26',
      },
      {
        id: '5',
        hospitalLogo: '/images/avatar.png',
        hospitalName: '大医院',
        hospitalAddress: '广东省深圳市',
        hospitalPhone: '0833-62284047',
        contactDoctorName: '钱茹',
        position: '医师',
        contactMethod: '17846678352',
        createTime: '1980/07/13',
      },
    ];
  };

  // 请求数据 - 使用 ProTable 传入的 params
  const fetchHospitalList = async (params: Record<string, any>) => {
    const mockData = getMockData();
    let filteredData = mockData;

    if (params.hospitalName) {
      filteredData = filteredData.filter((item) =>
        item.hospitalName.includes(params.hospitalName),
      );
    }

    if (params.contactDoctorName) {
      filteredData = filteredData.filter((item) =>
        item.contactDoctorName.includes(params.contactDoctorName),
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
      <ProTable<HospitalItem>
        headerTitle="转诊医院列表"
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
        request={fetchHospitalList}
        columns={columns}
        scroll={{ x: 1400 }}
        pagination={{
          pageSize: 10,
        }}
      />
    </PageContainer>
  );
};

export default ReferralHospital;
