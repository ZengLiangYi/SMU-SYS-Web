import { ModalForm, ProFormTextArea } from '@ant-design/pro-components';
import type { FC } from 'react';

interface DietModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dietContent: string;
  onFinish: (content: string) => void;
}

const DietModal: FC<DietModalProps> = ({
  open,
  onOpenChange,
  dietContent,
  onFinish,
}) => (
  <ModalForm
    title="编辑饮食处方"
    open={open}
    onOpenChange={onOpenChange}
    initialValues={{ dietContent }}
    modalProps={{ destroyOnHidden: true }}
    onFinish={async (values) => {
      onFinish(values.dietContent);
      return true;
    }}
  >
    <ProFormTextArea
      name="dietContent"
      label="饮食建议"
      rules={[{ required: true }]}
      placeholder="请输入饮食建议…"
      fieldProps={{ rows: 4 }}
    />
  </ModalForm>
);

export default DietModal;
