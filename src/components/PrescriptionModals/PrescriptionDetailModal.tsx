import { Modal } from 'antd';
import React from 'react';

interface PrescriptionData {
  medications?: any[];
  cognitiveCards?: any[];
  dietContent?: string;
  exercises?: any[];
}

interface PrescriptionDetailModalProps {
  open: boolean;
  title?: string;
  prescription: PrescriptionData | null;
  extraInfo?: React.ReactNode;
  onCancel: () => void;
}

const PrescriptionDetailModal: React.FC<PrescriptionDetailModalProps> = ({
  open,
  title = '康复处方详情',
  prescription,
  extraInfo,
  onCancel,
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={900}
      styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
    >
      <div style={{ padding: '20px 0' }}>
        {extraInfo && (
          <div
            style={{
              marginBottom: 24,
              paddingBottom: 16,
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            {extraInfo}
          </div>
        )}

        {prescription && (
          <div className="prescription-detail-view">
            {/* 药物治疗 - 只读 */}
            {prescription.medications &&
              prescription.medications.length > 0 && (
                <div className="prescription-section">
                  <div className="section-header">
                    <h3 className="section-title">药物治疗</h3>
                  </div>
                  <div className="prescription-list">
                    {prescription.medications.map((item: any) => (
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
            {prescription.cognitiveCards &&
              prescription.cognitiveCards.length > 0 && (
                <div className="prescription-section">
                  <div className="section-header">
                    <h3 className="section-title">认知训练</h3>
                    <span className="section-subtitle">每日30分钟</span>
                  </div>
                  <div className="cognitive-cards-container">
                    {prescription.cognitiveCards.map((item: any) => (
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
            {prescription.dietContent && (
              <div className="prescription-section">
                <div className="section-header">
                  <h3 className="section-title">饮食处方</h3>
                </div>
                <div className="diet-content">{prescription.dietContent}</div>
              </div>
            )}

            {/* 运动处方 - 只读 */}
            {prescription.exercises && prescription.exercises.length > 0 && (
              <div className="prescription-section">
                <div className="section-header">
                  <h3 className="section-title">运动处方</h3>
                </div>
                <div className="exercise-list">
                  {prescription.exercises.map((item: any) => (
                    <div key={item.id} className="exercise-item">
                      <div className="exercise-content">
                        <div className="exercise-name">{item.exerciseName}</div>
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
    </Modal>
  );
};

export default PrescriptionDetailModal;
