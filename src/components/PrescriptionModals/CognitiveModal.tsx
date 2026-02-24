import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import type { FC } from 'react';
import type { PrescriptionCognitiveItem } from '@/services/patient-user/typings.d';

interface CognitiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: PrescriptionCognitiveItem | null;
  onFinish: (values: Omit<PrescriptionCognitiveItem, 'id'>) => void;
}

const CognitiveModal: FC<CognitiveModalProps> = ({
  open,
  onOpenChange,
  editing,
  onFinish,
}) => (
  <ModalForm
    title={editing ? '编辑训练项' : '添加训练项'}
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
      name="cardName"
      label="训练名称"
      rules={[{ required: true }]}
      placeholder="请输入训练名称…"
    />
    <ProFormSelect
      name="difficulty"
      label="难度"
      rules={[{ required: true }]}
      placeholder="请选择难度…"
      options={[
        { label: '初级', value: '难度：初级' },
        { label: '中等', value: '难度：中等' },
        { label: '高', value: '难度：高' },
      ]}
    />
  </ModalForm>
);

export default CognitiveModal;
