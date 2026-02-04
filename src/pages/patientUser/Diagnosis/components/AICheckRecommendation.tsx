import React from 'react';

interface CheckItem {
  id: string;
  name: string;
  checked: boolean;
}

interface AICheckRecommendationProps {
  checkItems: {
    scaleAssessment: CheckItem[];
    laboratoryTest: CheckItem[];
    imagingTest: CheckItem[];
  };
  aiSuggestion: string;
  onCheckItemToggle: (category: string, id: string) => void;
}

const AICheckRecommendation: React.FC<AICheckRecommendationProps> = ({
  checkItems,
  aiSuggestion,
  onCheckItemToggle,
}) => {
  return (
    <div className="diagnosis-content">
      <div className="check-items-header">
        <h3 className="content-title">
          AI检查项目推荐{' '}
          <span className="subtitle">
            基于《中国认知功能社区筛查及管理指南(2025版)》及患者画像生成
          </span>
        </h3>
        <div className="confidence-badge">置信度 92%</div>
      </div>

      <div className="check-items-container">
        {/* 量表评估 */}
        <div className="check-category">
          <h4 className="category-title">量表评估</h4>
          <div className="check-items-list">
            {checkItems.scaleAssessment.map((item) => (
              <div
                key={item.id}
                className={`check-item ${item.checked ? 'checked' : ''}`}
                onClick={() => onCheckItemToggle('scaleAssessment', item.id)}
              >
                <input type="checkbox" checked={item.checked} readOnly />
                <span className="item-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 实验室筛查 */}
        <div className="check-category">
          <h4 className="category-title">实验室筛查</h4>
          <div className="check-items-list">
            {checkItems.laboratoryTest.map((item) => (
              <div
                key={item.id}
                className={`check-item ${item.checked ? 'checked' : ''}`}
                onClick={() => onCheckItemToggle('laboratoryTest', item.id)}
              >
                <input type="checkbox" checked={item.checked} readOnly />
                <span className="item-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 影像学检测 */}
        <div className="check-category">
          <h4 className="category-title">影像学检测</h4>
          <div className="check-items-list">
            {checkItems.imagingTest.map((item) => (
              <div
                key={item.id}
                className={`check-item ${item.checked ? 'checked' : ''}`}
                onClick={() => onCheckItemToggle('imagingTest', item.id)}
              >
                <input type="checkbox" checked={item.checked} readOnly />
                <span className="item-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI建议 */}
      <div className="ai-suggestion-box">
        <div className="ai-label">AI建议：</div>
        <div className="ai-content">{aiSuggestion}</div>
      </div>

      <div className="check-tip">
        医生可参考勾选调整上述AI建议，确认后进入结果录入环节
      </div>
    </div>
  );
};

export default AICheckRecommendation;
