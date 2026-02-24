import { useRequest } from '@umijs/max';
import {
  Empty,
  Flex,
  List,
  Pagination,
  Spin,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import {
  getExternalReferrals,
  getInternalReferrals,
} from '@/services/patient-user';
import type {
  ExternalReferralItem,
  InternalReferralItem,
} from '@/services/patient-user/typings.d';
import { formatDateTime } from '@/utils/date';

const { Title, Text } = Typography;

interface TransferRecordProps {
  patientId: string;
}

const PAGE_SIZE = 5;

const TransferRecord: React.FC<TransferRecordProps> = ({ patientId }) => {
  const [internalPage, setInternalPage] = useState(1);
  const [externalPage, setExternalPage] = useState(1);

  const { data: internalData, loading: internalLoading } = useRequest(
    () =>
      getInternalReferrals(patientId, {
        offset: (internalPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      }),
    { refreshDeps: [patientId, internalPage] },
  );

  const { data: externalData, loading: externalLoading } = useRequest(
    () =>
      getExternalReferrals(patientId, {
        offset: (externalPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      }),
    { refreshDeps: [patientId, externalPage] },
  );

  const internalItems = internalData?.items ?? [];
  const externalItems = externalData?.items ?? [];

  return (
    <div>
      <Title level={5}>院内转诊</Title>
      <Spin spinning={internalLoading}>
        {internalItems.length > 0 ? (
          <>
            <Timeline
              items={internalItems.map((item: InternalReferralItem) => ({
                children: (
                  <div key={item.id}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {formatDateTime(item.referral_date)}
                    </Text>
                    <div>
                      {item.from_doctor_name ?? '--'} →{' '}
                      {item.to_doctor_name ?? '--'}
                    </div>
                    {item.note ? (
                      <Text type="secondary">{item.note}</Text>
                    ) : null}
                  </div>
                ),
              }))}
            />
            {(internalData?.total ?? 0) > PAGE_SIZE ? (
              <Flex justify="end">
                <Pagination
                  size="small"
                  current={internalPage}
                  pageSize={PAGE_SIZE}
                  total={internalData?.total ?? 0}
                  onChange={setInternalPage}
                />
              </Flex>
            ) : null}
          </>
        ) : (
          <Empty description="暂无院内转诊记录" />
        )}
      </Spin>

      <Title level={5} style={{ marginTop: 24 }}>
        院外转诊
      </Title>
      <Spin spinning={externalLoading}>
        {externalItems.length > 0 ? (
          <>
            <List<ExternalReferralItem>
              dataSource={externalItems}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    title={item.hospital_name ?? '--'}
                    description={
                      <Flex vertical gap={4}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatDateTime(item.referral_date)}
                        </Text>
                        <Text type="secondary">
                          转出：{item.from_doctor_name ?? '--'} → 接诊：
                          {item.to_doctor_name ?? '--'}
                          {item.to_doctor_phone
                            ? ` · ${item.to_doctor_phone}`
                            : ''}
                        </Text>
                      </Flex>
                    }
                  />
                  <Tag color={item.is_accepted ? 'blue' : 'red'}>
                    {item.is_accepted ? '已同意' : '未同意'}
                  </Tag>
                </List.Item>
              )}
            />
            {(externalData?.total ?? 0) > PAGE_SIZE ? (
              <Flex justify="end">
                <Pagination
                  size="small"
                  current={externalPage}
                  pageSize={PAGE_SIZE}
                  total={externalData?.total ?? 0}
                  onChange={setExternalPage}
                />
              </Flex>
            ) : null}
          </>
        ) : (
          <Empty description="暂无院外转诊记录" />
        )}
      </Spin>
    </div>
  );
};

export default TransferRecord;
