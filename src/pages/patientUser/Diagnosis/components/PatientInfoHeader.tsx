import { EditOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, Flex } from 'antd';
import React from 'react';
import EditPatientDrawer from '@/components/EditPatientDrawer';
import PatientAvatarInfoContent from '@/components/PatientAvatarInfoContent';
import type { PatientDetail } from '@/services/patient-user/typings.d';

interface PatientInfoHeaderProps {
  patientDetail: PatientDetail;
  onSaved?: () => void;
}

const PatientInfoHeader: React.FC<PatientInfoHeaderProps> = ({
  patientDetail,
  onSaved,
}) => {
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

      <Divider orientation="vertical" style={{ height: 'auto' }} />

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
                children: patientDetail.family_history || '--',
              },
              {
                key: 'medical_history',
                label: '既往病史',
                children: patientDetail.medical_history || '--',
              },
              {
                key: 'medication_history',
                label: '既往用药',
                children: patientDetail.medication_history || '--',
              },
            ]}
          />
          <EditPatientDrawer
            patientId={patientDetail.id}
            patientDetail={patientDetail}
            onSaved={onSaved}
            trigger={
              <Button
                type="link"
                icon={<EditOutlined />}
                aria-label="编辑档案"
              />
            }
          />
        </Flex>
      </div>
    </Flex>
  );
};

export default PatientInfoHeader;
