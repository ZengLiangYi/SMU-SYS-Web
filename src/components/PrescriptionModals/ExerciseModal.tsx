import { ModalForm, ProFormText } from '@ant-design/pro-components';
import type { FC } from 'react';
import type { PrescriptionExerciseItem } from '@/services/patient-user/typings.d';

interface ExerciseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: PrescriptionExerciseItem | null;
  onFinish: (values: Omit<PrescriptionExerciseItem, 'id'>) => void;
}

const ExerciseModal: FC<ExerciseModalProps> = ({
  open,
  onOpenChange,
  editing,
  onFinish,
}) => (
  <ModalForm
    title={editing ? '编辑运动项' : '添加运动项'}
    open={open}
    onOpenChange={onOpenChange}
    initialValues={editing ?? undefined}
    modalProps={{ destroyOnHidden: true }}
    onFinish={async (values) => {
      onFinish(values);
      return true;
    }}
  >
    <ProFormText
      name="exerciseName"
      label="运动名称"
      rules={[{ required: true }]}
      placeholder="请输入运动名称…"
    />
    <ProFormText
      name="duration"
      label="时长"
      rules={[{ required: true }]}
      placeholder="请输入时长…"
    />
  </ModalForm>
);

export default ExerciseModal;
