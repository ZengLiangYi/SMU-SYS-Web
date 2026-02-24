import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Flex, List, Typography } from 'antd';
import type { FC } from 'react';
import type { PrescriptionMedicationItem } from '@/services/patient-user/typings.d';

const { Title, Text } = Typography;

interface MedicationTreatmentProps {
  medications: PrescriptionMedicationItem[];
  onAdd: () => void;
  onEdit: (item: PrescriptionMedicationItem) => void;
  onDelete: (id: string) => void;
}

const MedicationTreatment: FC<MedicationTreatmentProps> = ({
  medications,
  onAdd,
  onEdit,
  onDelete,
}) => (
  <div>
    <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
      <Title level={5} style={{ margin: 0 }}>
        药物治疗
      </Title>
      <Button type="link" icon={<PlusOutlined />} onClick={onAdd}>
        添加药物
      </Button>
    </Flex>
    {medications.length > 0 ? (
      <List
        dataSource={medications}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                key="edit"
                type="link"
                size="small"
                icon={<EditOutlined />}
                aria-label={`编辑${item.medicineName}`}
                onClick={() => onEdit(item)}
              />,
              <Button
                key="delete"
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
                aria-label={`删除${item.medicineName}`}
                onClick={() => onDelete(item.id)}
              />,
            ]}
          >
            <List.Item.Meta
              title={item.medicineName}
              description={`用法：${item.usage}`}
            />
            <Text type="secondary">{item.dosage}</Text>
          </List.Item>
        )}
      />
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无药物" />
    )}
  </div>
);

export default MedicationTreatment;
