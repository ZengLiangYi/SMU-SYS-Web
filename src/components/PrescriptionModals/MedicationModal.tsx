import { ModalForm, ProFormText } from '@ant-design/pro-components';
import type { FC } from 'react';
import type { PrescriptionMedicationItem } from '@/services/patient-user/typings.d';

interface MedicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: PrescriptionMedicationItem | null;
  onFinish: (values: Omit<PrescriptionMedicationItem, 'id'>) => void;
}

const MedicationModal: FC<MedicationModalProps> = ({
  open,
  onOpenChange,
  editing,
  onFinish,
}) => (
  <ModalForm
    title={editing ? '编辑药物' : '添加药物'}
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
      name="medicineName"
      label="药品名称"
      rules={[{ required: true }]}
      placeholder="请输入药品名称…"
    />
    <ProFormText
      name="usage"
      label="用法"
      rules={[{ required: true }]}
      placeholder="请输入用法…"
    />
    <ProFormText
      name="dosage"
      label="剂量"
      rules={[{ required: true }]}
      placeholder="请输入剂量…"
    />
  </ModalForm>
);

export default MedicationModal;
