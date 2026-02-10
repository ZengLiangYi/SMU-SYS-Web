import { CloseOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { App, Button, Descriptions, Divider, Flex, Input, Space } from 'antd';
import React, { useMemo, useState } from 'react';
import PatientAvatarInfoContent from '@/components/PatientAvatarInfoContent';
import { updatePatient } from '@/services/patient-user';
import type { PatientDetail } from '@/services/patient-user/typings.d';

interface PatientInfoHeaderProps {
  patientDetail: PatientDetail;
}

const PatientInfoHeader: React.FC<PatientInfoHeaderProps> = ({
  patientDetail,
}) => {
  const { message } = App.useApp();

  // M3 fix: 用 useMemo 派生 archiveData，不用 useEffect
  const archiveData = useMemo(
    () => ({
      family_history: patientDetail.family_history ?? '',
      medical_history: patientDetail.medical_history ?? '',
      medication_history: patientDetail.medication_history ?? '',
    }),
    [patientDetail],
  );

  // 编辑模式使用单独状态，仅在点击"编辑"时初始化
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(archiveData);

  const { run: runSave } = useRequest(
    (data: Record<string, string>) => updatePatient(patientDetail.id, data),
    {
      manual: true,
      onSuccess: () => {
        message.success('保存成功');
        setIsEditing(false);
      },
      onError: () => {
        message.error('保存失败');
      },
    },
  );

  const handleStartEdit = () => {
    setEditData(archiveData);
    setIsEditing(true);
  };

  const handleSave = () => {
    runSave(editData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Flex gap={24} style={{ marginBottom: 24 }}>
      <div style={{ flexShrink: 0 }}>
        <PatientAvatarInfoContent
          name={patientDetail.name}
          gender={patientDetail.gender}
          age={patientDetail.age}
          phone={patientDetail.phone}
          categories={patientDetail.categories}
        />
      </div>

      <Divider type="vertical" style={{ height: 'auto' }} />

      <div style={{ flex: 1 }}>
        <Flex justify="space-between" align="flex-start">
          <Descriptions
            column={1}
            size="small"
            style={{ flex: 1 }}
            items={[
              {
                key: 'family_history',
                label: '家族史',
                children: isEditing ? (
                  <Input
                    value={editData.family_history}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        family_history: e.target.value,
                      }))
                    }
                    placeholder="请输入家族史…"
                  />
                ) : (
                  archiveData.family_history || '--'
                ),
              },
              {
                key: 'medical_history',
                label: '既往病史',
                children: isEditing ? (
                  <Input
                    value={editData.medical_history}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        medical_history: e.target.value,
                      }))
                    }
                    placeholder="请输入既往病史…"
                  />
                ) : (
                  archiveData.medical_history || '--'
                ),
              },
              {
                key: 'medication_history',
                label: '既往用药',
                children: isEditing ? (
                  <Input
                    value={editData.medication_history}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        medication_history: e.target.value,
                      }))
                    }
                    placeholder="请输入既往用药…"
                  />
                ) : (
                  archiveData.medication_history || '--'
                ),
              },
            ]}
          />
          <div>
            {!isEditing ? (
              <Button
                type="link"
                icon={<EditOutlined />}
                aria-label="编辑档案"
                onClick={handleStartEdit}
              />
            ) : (
              <Space>
                <Button
                  type="link"
                  icon={<SaveOutlined />}
                  aria-label="保存档案"
                  onClick={handleSave}
                />
                <Button
                  type="link"
                  icon={<CloseOutlined />}
                  aria-label="取消编辑"
                  onClick={handleCancel}
                />
              </Space>
            )}
          </div>
        </Flex>
      </div>
    </Flex>
  );
};

export default PatientInfoHeader;
