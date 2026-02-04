import { Modal } from 'antd';
import React from 'react';
import '@/components/PrescriptionComponents/index.less';

interface DiseaseTypeItem {
  id: string;
  diseaseCategory: string;
  diseaseName: string;
  diseaseSymptoms: string;
  recoveryPlan: string;
  registrationDoctor: string;
  registrationTime: string;
  prescription?: {
    medications: any[];
    cognitiveCards: any[];
    dietContent: string;
    exercises: any[];
  };
}

interface DetailModalProps {
  visible: boolean;
  record: DiseaseTypeItem | null;
  onCancel: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({
  visible,
  record,
  onCancel,
}) => {
  return (
    <Modal
      title="疾病类型详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
    >
      {record && (
        <div className="detail-modal-content">
          <div className="base-info">
            <p className="base-info-item">
              <strong>疾病类别：</strong>
              {record.diseaseCategory}
            </p>
            <p className="base-info-item">
              <strong>疾病名称：</strong>
              {record.diseaseName}
            </p>
          </div>

          <p className="info-item">
            <strong>疾病表现：</strong>
            {record.diseaseSymptoms}
          </p>

          <div className="base-info">
            <p className="base-info-item">
              <strong>登记医师：</strong>
              {record.registrationDoctor}
            </p>
            <p className="base-info-item">
              <strong>登记时间：</strong>
              {record.registrationTime}
            </p>
          </div>
          {record.prescription && (
            <div className="prescription-detail-view">
              <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
                康复处方详情
              </h4>

              {/* 药物治疗 - 只读 */}
              {record.prescription.medications?.length > 0 && (
                <div className="prescription-section">
                  <div className="section-header">
                    <h3 className="section-title">药物治疗</h3>
                  </div>
                  <div className="prescription-list">
                    {record.prescription.medications.map((item: any) => (
                      <div key={item.id} className="prescription-item">
                        <div className="prescription-content">
                          <div className="prescription-name">
                            {item.medicineName}
                          </div>
                          <div className="prescription-detail">
                            用法：{item.usage}
                          </div>
                        </div>
                        <div className="prescription-dosage">{item.dosage}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 认知训练 - 只读 */}
              {record.prescription.cognitiveCards?.length > 0 && (
                <div className="prescription-section">
                  <div className="section-header">
                    <h3 className="section-title">认知训练</h3>
                    <span className="section-subtitle">每日30分钟</span>
                  </div>
                  <div className="cognitive-cards-container">
                    {record.prescription.cognitiveCards.map((item: any) => (
                      <div key={item.id} className="cognitive-card">
                        <div className="cognitive-card-content">
                          <div className="cognitive-card-name">
                            {item.cardName}
                          </div>
                          <div className="cognitive-card-difficulty">
                            {item.difficulty}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 饮食处方 - 只读 */}
              {record.prescription.dietContent && (
                <div className="prescription-section">
                  <div className="section-header">
                    <h3 className="section-title">饮食处方</h3>
                  </div>
                  <div className="diet-content">
                    {record.prescription.dietContent}
                  </div>
                </div>
              )}

              {/* 运动处方 - 只读 */}
              {record.prescription.exercises?.length > 0 && (
                <div className="prescription-section">
                  <div className="section-header">
                    <h3 className="section-title">运动处方</h3>
                  </div>
                  <div className="exercise-list">
                    {record.prescription.exercises.map((item: any) => (
                      <div key={item.id} className="exercise-item">
                        <div className="exercise-content">
                          <div className="exercise-name">
                            {item.exerciseName}
                          </div>
                        </div>
                        <div className="exercise-duration">{item.duration}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default DetailModal;
