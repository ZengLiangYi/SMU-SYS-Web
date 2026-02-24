import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Flex, List, Typography } from 'antd';
import type { FC } from 'react';
import type { PrescriptionExerciseItem } from '@/services/patient-user/typings.d';

const { Title } = Typography;

interface ExercisePrescriptionProps {
  exercises: PrescriptionExerciseItem[];
  onAdd: () => void;
  onEdit: (item: PrescriptionExerciseItem) => void;
  onDelete: (id: string) => void;
}

const ExercisePrescription: FC<ExercisePrescriptionProps> = ({
  exercises,
  onAdd,
  onEdit,
  onDelete,
}) => (
  <div>
    <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
      <Title level={5} style={{ margin: 0 }}>
        运动处方
      </Title>
      <Button type="link" icon={<PlusOutlined />} onClick={onAdd}>
        添加计划
      </Button>
    </Flex>
    {exercises.length > 0 ? (
      <List
        dataSource={exercises}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                key="edit"
                type="link"
                size="small"
                icon={<EditOutlined />}
                aria-label={`编辑${item.exerciseName}`}
                onClick={() => onEdit(item)}
              />,
              <Button
                key="delete"
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
                aria-label={`删除${item.exerciseName}`}
                onClick={() => onDelete(item.id)}
              />,
            ]}
          >
            <List.Item.Meta
              title={item.exerciseName}
              description={item.duration}
            />
          </List.Item>
        )}
      />
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无运动计划" />
    )}
  </div>
);

export default ExercisePrescription;
