import { Button, Input, Select, Tag } from 'antd';
import React, { useState } from 'react';

const { TextArea } = Input;

interface AIDiagnosisClassificationProps {
  onConfirm: () => void;
  confirmed?: boolean;
}

const AIDiagnosisClassification: React.FC<AIDiagnosisClassificationProps> = ({
  onConfirm,
  confirmed = true,
}) => {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string[]>([
    '轻度认知障碍',
  ]);
  const [remarks, setRemarks] = useState('');

  // AI诊断结果
  const aiDiagnosis = {
    primary: '轻度认知障碍',
    confidence: '88%',
    others: [
      {
        name: '阿尔茨海默症 (AD)',
        probability: '15%',
        note: '(尚无明显日常生活能力受损)',
      },
      { name: '血管性痴呆 (VaD)', probability: '5%', note: '(无明显卒中史)' },
    ],
  };

  const handleDiagnosisChange = (value: string[]) => {
    setSelectedDiagnosis(value);
  };

  const _handleRemoveDiagnosis = (diagnosis: string) => {
    setSelectedDiagnosis(selectedDiagnosis.filter((d) => d !== diagnosis));
  };

  return (
    <div className="diagnosis-content">
      <div className="ai-diagnosis-header">
        <h3 className="content-title">AI认知障碍分类诊断</h3>
        <div className="generate-time">生成耗时 1.2s</div>
      </div>

      <div className="ai-diagnosis-container">
        {/* 左侧：AI诊断结果 */}
        <div className="ai-diagnosis-left">
          <div className="primary-diagnosis">
            <div className="diagnosis-label">首选诊断</div>
            <div className="diagnosis-result">
              <span className="diagnosis-name">{aiDiagnosis.primary}</span>
              <Tag className="confidence-tag">
                置信度 {aiDiagnosis.confidence}
              </Tag>
            </div>
            <div className="diagnosis-description">
              综合实验室数据(Hcy升高)及影像学(海马体轻度萎缩)特征，符合MCI诊断标准。需警惕向阿尔茨海默病(AD)转化风险。
            </div>
          </div>

          <div className="other-diagnosis">
            <div className="diagnosis-label">其他诊断</div>
            {aiDiagnosis.others.map((item) => (
              <div key={item.name} className="diagnosis-item">
                <div className="diagnosis-name-row">
                  <span className="name">{item.name}</span>
                  <span className="probability">
                    可能性 {item.probability} {item.note}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：医师确认 */}
        <div className="ai-diagnosis-right">
          <h4 className="section-title">医师确认</h4>

          <div className="confirm-section">
            <div className="confirm-label">最终诊断结果</div>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请选择诊断结果"
              value={selectedDiagnosis}
              onChange={handleDiagnosisChange}
              options={[
                { label: '轻度认知障碍', value: '轻度认知障碍' },
                { label: '阿尔茨海默症 (AD)', value: '阿尔茨海默症 (AD)' },
                { label: '血管性痴呆 (VaD)', value: '血管性痴呆 (VaD)' },
                { label: '路易体痴呆 (DLB)', value: '路易体痴呆 (DLB)' },
                { label: '额颞叶痴呆 (FTD)', value: '额颞叶痴呆 (FTD)' },
              ]}
            />
          </div>

          <div className="confirm-section">
            <div className="confirm-label">分型备注</div>
            <TextArea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="请输入备注信息"
              rows={4}
              className="remarks-textarea"
            />
          </div>

          <Button
            type="primary"
            block
            onClick={onConfirm}
            className="confirm-btn"
            disabled={confirmed}
          >
            {confirmed ? '已确认诊断' : '确认诊断并生成处方'}
          </Button>
          {confirmed && (
            <div
              style={{
                textAlign: 'center',
                marginTop: '8px',
                color: '#52c41a',
                fontSize: '12px',
              }}
            >
              ✓ 诊断已确认，可以进入下一步
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDiagnosisClassification;
