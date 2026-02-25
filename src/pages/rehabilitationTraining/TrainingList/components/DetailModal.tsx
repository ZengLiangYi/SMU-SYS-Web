import { Descriptions, Image, Modal } from 'antd';
import React from 'react';
import type { RehabLevel } from '@/services/rehab-level/typings.d';
import { getStaticUrl } from '@/services/static';
import { formatDateTime } from '@/utils/date';

interface DetailModalProps {
  open: boolean;
  record: RehabLevel | null;
  onCancel: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({
  open,
  record,
  onCancel,
}) => {
  return (
    <Modal
      title="关卡详情"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={700}
      destroyOnHidden
    >
      {record && (
        <>
          <div style={{ marginBottom: 16, textAlign: 'center' }}>
            <Image
              src={getStaticUrl(record.image_url)}
              alt={record.name}
              width={120}
              height={120}
              style={{ objectFit: 'cover', borderRadius: 8 }}
            />
          </div>
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="关卡类型">
              {record.level_type}
            </Descriptions.Item>
            <Descriptions.Item label="关卡名称">
              {record.name}
            </Descriptions.Item>
            <Descriptions.Item label="关卡简介" span={2}>
              {record.description}
            </Descriptions.Item>
            <Descriptions.Item label="关卡等级范围" span={2}>
              {record.level_range}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {formatDateTime(record.created_at)}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Modal>
  );
};

export default DetailModal;
