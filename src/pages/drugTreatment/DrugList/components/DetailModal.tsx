import { Image, Modal } from 'antd';
import React from 'react';

interface DrugItem {
  id: string;
  diseaseType: string;
  drugName: string;
  drugImage: string;
  drugEffect: string;
  drugContraindication: string;
  registrationDoctor: string;
  registrationTime: string;
}

interface DetailModalProps {
  visible: boolean;
  record: DrugItem | null;
  onCancel: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({
  visible,
  record,
  onCancel,
}) => {
  return (
    <Modal
      title="药物详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
    >
      {record && (
        <div className="detail-modal-content">
          <div style={{ marginBottom: 16, textAlign: 'center' }}>
            <Image
              src={record.drugImage}
              alt={record.drugName}
              width={120}
              height={120}
              style={{ objectFit: 'cover', borderRadius: 8 }}
            />
          </div>
          {/* 基础信息 */}
          <div className="base-info">
            <p className="base-info-item">
              <strong>治疗疾病类型：</strong>
              {record.diseaseType}
            </p>
            <p className="base-info-item">
              <strong>登记医师：</strong>
              {record.registrationDoctor}
            </p>
            <p className="base-info-item">
              <strong>登记时间：</strong>
              {record.registrationTime}
            </p>
          </div>
          <p className="info-item">
            <strong>药物名称：</strong>
            {record.drugName}
          </p>
          <p className="info-item">
            <strong>药物功效：</strong>
            {record.drugEffect}
          </p>
          <p className="info-item">
            <strong>药物禁忌：</strong>
            {record.drugContraindication}
          </p>
        </div>
      )}
    </Modal>
  );
};

export default DetailModal;
