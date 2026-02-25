import { Descriptions, Modal } from 'antd';
import React from 'react';
import type { DiseaseType } from '@/services/disease-type/typings.d';
import { formatDateTime } from '@/utils/date';

interface DetailModalProps {
  open: boolean;
  record: DiseaseType | null;
  onCancel: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({
  open,
  record,
  onCancel,
}) => {
  return (
    <Modal
      title="疾病类型详情"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={700}
      destroyOnHidden
    >
      {record && (
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="疾病类别">
            {record.disease_category}
          </Descriptions.Item>
          <Descriptions.Item label="疾病名称">
            {record.disease_name}
          </Descriptions.Item>
          <Descriptions.Item label="疾病表现" span={2}>
            {record.manifestations}
          </Descriptions.Item>
          <Descriptions.Item label="康复处方建议" span={2}>
            {record.rehab_recommendation}
          </Descriptions.Item>
          <Descriptions.Item label="登记医师">
            {record.created_by_doctor_name ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {formatDateTime(record.created_at)}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default DetailModal;
