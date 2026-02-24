import { EditOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Typography } from 'antd';
import type { FC } from 'react';

const { Title, Text } = Typography;

interface DietPrescriptionProps {
  content: string;
  onEdit: () => void;
}

const DietPrescription: FC<DietPrescriptionProps> = ({ content, onEdit }) => (
  <div>
    <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
      <Title level={5} style={{ margin: 0 }}>
        饮食处方
      </Title>
      <Button
        type="link"
        icon={<EditOutlined />}
        aria-label="编辑饮食处方"
        onClick={onEdit}
      />
    </Flex>
    <Card size="small">
      <Text type="secondary">{content || '暂无饮食处方'}</Text>
    </Card>
  </div>
);

export default DietPrescription;
