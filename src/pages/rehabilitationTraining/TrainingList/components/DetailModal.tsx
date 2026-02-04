import { Image, Modal } from 'antd';
import React from 'react';

interface TrainingItem {
  id: string;
  levelType: string;
  levelName: string;
  levelImage: string;
  levelIntro: string;
  levelRange: string;
  createTime: string;
}

interface DetailModalProps {
  visible: boolean;
  record: TrainingItem | null;
  onCancel: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({
  visible,
  record,
  onCancel,
}) => {
  return (
    <Modal
      title="关卡详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
    >
      {record && (
        <div style={{ padding: '20px 0' }}>
          <div style={{ marginBottom: 16, textAlign: 'center' }}>
            <Image
              src={record.levelImage}
              alt={record.levelName}
              width={120}
              height={120}
              style={{ objectFit: 'cover', borderRadius: 8 }}
            />
          </div>
          <p style={{ marginBottom: 12, fontSize: 14 }}>
            <strong>关卡类型：</strong>
            {record.levelType}
          </p>
          <p style={{ marginBottom: 12, fontSize: 14 }}>
            <strong>关卡名称：</strong>
            {record.levelName}
          </p>
          <p style={{ marginBottom: 12, fontSize: 14 }}>
            <strong>关卡简介：</strong>
            {record.levelIntro}
          </p>
          <p style={{ marginBottom: 12, fontSize: 14 }}>
            <strong>关卡等级范围：</strong>
            {record.levelRange}
          </p>
          <p style={{ marginBottom: 0, fontSize: 14 }}>
            <strong>创建时间：</strong>
            {record.createTime}
          </p>
        </div>
      )}
    </Modal>
  );
};

export default DetailModal;
