import { Descriptions, Image, Modal } from 'antd';
import React from 'react';
import type { Medicine } from '@/services/medicine/typings.d';
import { getStaticUrl } from '@/services/static';
import { formatDateTime } from '@/utils/date';

interface DetailModalProps {
  open: boolean;
  record: Medicine | null;
  onCancel: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({
  open,
  record,
  onCancel,
}) => {
  return (
    <Modal
      title="药物详情"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={700}
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
            <Descriptions.Item label="治疗类型">
              {record.treatment_type}
            </Descriptions.Item>
            <Descriptions.Item label="药物名称">
              {record.name}
            </Descriptions.Item>
            <Descriptions.Item label="适应症" span={2}>
              {record.indications}
            </Descriptions.Item>
            <Descriptions.Item label="药物功效" span={2}>
              {record.efficacy}
            </Descriptions.Item>
            <Descriptions.Item label="药物用法" span={2}>
              {record.usage}
            </Descriptions.Item>
            <Descriptions.Item label="用药禁忌" span={2}>
              {record.contraindications}
            </Descriptions.Item>
            <Descriptions.Item label="登记医师">
              {record.creator_name ?? '-'}
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
