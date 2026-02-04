import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { Input, Upload } from 'antd';
import React, { useState } from 'react';

interface TestResultEntryProps {
  checkItems: {
    scaleAssessment: Array<{ id: string; name: string; checked: boolean }>;
    laboratoryTest: Array<{ id: string; name: string; checked: boolean }>;
    imagingTest: Array<{ id: string; name: string; checked: boolean }>;
  };
}

const TestResultEntry: React.FC<TestResultEntryProps> = ({ checkItems }) => {
  const [labFileList, setLabFileList] = useState<UploadFile[]>([]);
  const [imagingFileList, setImagingFileList] = useState<UploadFile[]>([]);

  const handleLabUploadChange: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    setLabFileList(newFileList);
  };

  const handleImagingUploadChange: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    setImagingFileList(newFileList);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </button>
  );

  // 获取选中的检查项目
  const selectedLabItems = checkItems.laboratoryTest.filter(
    (item) => item.checked,
  );
  const selectedImagingItems = checkItems.imagingTest.filter(
    (item) => item.checked,
  );

  return (
    <div className="diagnosis-content">
      <h3 className="content-title">检测结果录入</h3>

      {/* 实验室筛查结果 */}
      {selectedLabItems.length > 0 && (
        <div className="result-section">
          <h4 className="section-subtitle">实验室筛查结果（选填）</h4>
          <Upload
            listType="picture-card"
            fileList={labFileList}
            onChange={handleLabUploadChange}
            beforeUpload={() => false}
            maxCount={5}
          >
            {labFileList.length >= 5 ? null : uploadButton}
          </Upload>
        </div>
      )}

      {/* 影像学资料 */}
      {selectedImagingItems.length > 0 && (
        <div className="result-section">
          <h4 className="section-subtitle">影像学资料（选填）</h4>
          <Upload
            listType="picture-card"
            fileList={imagingFileList}
            onChange={handleImagingUploadChange}
            beforeUpload={() => false}
            maxCount={5}
          >
            {imagingFileList.length >= 5 ? null : uploadButton}
          </Upload>
        </div>
      )}
    </div>
  );
};

export default TestResultEntry;
