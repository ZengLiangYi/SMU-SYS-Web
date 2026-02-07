import { Image, Modal } from 'antd';
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
    >
      {record && (
        <div style={{ padding: '20px 0' }}>
          <div style={{ marginBottom: 16, textAlign: 'center' }}>
            <Image
              src={getStaticUrl(record.image_url)}
              alt={record.name}
              width={120}
              height={120}
              style={{ objectFit: 'cover', borderRadius: 8 }}
            />
          </div>
          <p style={{ marginBottom: 12, fontSize: 14 }}>
            <strong>关卡类型：</strong>
            {record.level_type}
          </p>
          <p style={{ marginBottom: 12, fontSize: 14 }}>
            <strong>关卡名称：</strong>
            {record.name}
          </p>
          <p style={{ marginBottom: 12, fontSize: 14 }}>
            <strong>关卡简介：</strong>
            {record.description}
          </p>
          <p style={{ marginBottom: 12, fontSize: 14 }}>
            <strong>关卡等级范围：</strong>
            {record.level_range}
          </p>
          <p style={{ marginBottom: 0, fontSize: 14 }}>
            <strong>创建时间：</strong>
            {formatDateTime(record.created_at)}
          </p>
        </div>
      )}
    </Modal>
  );
};

export default DetailModal;
