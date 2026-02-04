import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Image, Input, Select } from 'antd';
import React, { useRef, useState } from 'react';
import './index.less';
import {
  EditOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';

const { Option } = Select;

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

const ReferralHospital: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [searchHospital, setSearchHospital] = useState<string>('');
  const [searchName, setSearchName] = useState<string>('');
  const [filteredHospital, setFilteredHospital] = useState<string>('');
  const [filteredName, setFilteredName] = useState<string>('');

  // 表格列定义
  const columns: ProColumns<HospitalItem>[] = [
    {
      title: '医院logo',
      dataIndex: 'hospitalLogo',
      width: 100,
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
    },
    {
      title: '医院地址',
      dataIndex: 'hospitalAddress',
      width: 200,
    },
    {
      title: '医院电话',
      dataIndex: 'hospitalPhone',
      width: 150,
    },
    {
      title: '对接医师姓名',
      dataIndex: 'contactDoctorName',
      width: 120,
    },
    {
      title: '职位',
      dataIndex: 'position',
      width: 100,
    },
    {
      title: '联系方式',
      dataIndex: 'contactMethod',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <div className="action-item" onClick={() => handleEdit(record)}>
          <EditOutlined />
          <span> 修改</span>
        </div>
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

  const handleQuery = () => {
    setFilteredHospital(searchHospital);
    setFilteredName(searchName);
    actionRef.current?.reload();
  };

  const handleReset = () => {
    setSearchHospital('');
    setSearchName('');
    setFilteredHospital('');
    setFilteredName('');
    actionRef.current?.reload();
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

  // 请求数据
  const fetchHospitalList = async (_params: any) => {
    const mockData = getMockData();
    let filteredData = mockData;

    if (filteredHospital) {
      filteredData = filteredData.filter((item) =>
        item.hospitalName.includes(filteredHospital),
      );
    }

    if (filteredName) {
      filteredData = filteredData.filter((item) =>
        item.contactDoctorName.includes(filteredName),
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
      <div className="referral-hospital-page">
        <div className="referral-hospital-card">
          <div className="toolbar">
            <div className="toolbar-left">
              <div className="toolbar-item">
                <span className="toolbar-label">所属医院：</span>
                <Select
                  placeholder="全部"
                  allowClear
                  style={{ width: 240 }}
                  value={searchHospital}
                  onChange={(value) => setSearchHospital(value)}
                >
                  <Option value="大医院">大医院</Option>
                </Select>
              </div>
              <div className="toolbar-item">
                <span className="toolbar-label">名称：</span>
                <Input
                  placeholder="请输入医师名称"
                  allowClear
                  style={{ width: 240 }}
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
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

          <ProTable<HospitalItem>
            actionRef={actionRef}
            rowKey="id"
            search={false}
            options={{
              reload: false,
              density: false,
              fullScreen: false,
              setting: false,
            }}
            request={fetchHospitalList}
            columns={columns}
            scroll={{ x: 1400 }}
            pagination={{
              pageSize: 10,
            }}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default ReferralHospital;
