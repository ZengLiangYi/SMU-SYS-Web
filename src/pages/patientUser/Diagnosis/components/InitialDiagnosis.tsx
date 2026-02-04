import { Input } from 'antd';
import React from 'react';

const { TextArea } = Input;

interface InitialDiagnosisProps {
  formData: {
    chiefComplaint: string;
    appearance: string;
    currentHistory: string;
  };
  onChange: (data: any) => void;
}

const InitialDiagnosis: React.FC<InitialDiagnosisProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="diagnosis-content">
      <h3 className="content-title">初诊信息录入</h3>

      <div className="form-section">
        <div className="form-label">主诉</div>
        <TextArea
          value={formData.chiefComplaint}
          onChange={(e) =>
            onChange({ ...formData, chiefComplaint: e.target.value })
          }
          placeholder="请输入主诉"
          rows={3}
          className="form-textarea"
        />
      </div>

      <div className="form-section">
        <div className="form-label">用户外在表现</div>
        <TextArea
          value={formData.appearance}
          onChange={(e) =>
            onChange({ ...formData, appearance: e.target.value })
          }
          placeholder="请记录用户外在表现"
          rows={3}
          className="form-textarea"
        />
      </div>

      <div className="form-section">
        <div className="form-label">现病史</div>
        <TextArea
          value={formData.currentHistory}
          onChange={(e) =>
            onChange({ ...formData, currentHistory: e.target.value })
          }
          placeholder="请输入现病史"
          rows={3}
          className="form-textarea"
        />
      </div>

      {formData.chiefComplaint && (
        <div className="form-tip">
          基于患者主诉（{formData.chiefComplaint}
          ）及家族史，建议启动认知障碍专项筛查流程。点击"下一步"获取AI检查方案建议。
        </div>
      )}
    </div>
  );
};

export default InitialDiagnosis;
