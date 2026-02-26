import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import type { FC } from 'react';
import type { PrescriptionExerciseItem } from '@/services/patient-user/typings.d';

interface ExerciseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: PrescriptionExerciseItem | null;
  onFinish: (values: Omit<PrescriptionExerciseItem, 'id'>) => void;
}

const UNIT_OPTIONS = [
  { label: '分钟', value: '分钟' },
  { label: '次', value: '次' },
  { label: '组', value: '组' },
  { label: '米', value: '米' },
];

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
    onFinish={async (values: Omit<PrescriptionExerciseItem, 'id'>) => {
      onFinish(values);
      return true;
    }}
  >
    <ProFormText
      name="name"
      label="运动名称"
      rules={[{ required: true }]}
      placeholder="请输入运动名称…"
    />
    <ProFormDigit
      name="quantity"
      label="数量"
      rules={[{ required: true }]}
      placeholder="请输入数量…"
      min={1}
      fieldProps={{ precision: 0 }}
    />
    <ProFormSelect
      name="unit"
      label="单位"
      rules={[{ required: true }]}
      placeholder="请选择单位…"
      options={UNIT_OPTIONS}
    />
  </ModalForm>
);

export default ExerciseModal;
