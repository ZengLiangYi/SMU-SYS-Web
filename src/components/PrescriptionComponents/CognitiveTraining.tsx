import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Flex, Row, Typography } from 'antd';
import type { FC } from 'react';
import type { PrescriptionCognitiveItem } from '@/services/patient-user/typings.d';

const { Title, Text } = Typography;

interface CognitiveTrainingProps {
  cards: PrescriptionCognitiveItem[];
  onAdd: () => void;
  onEdit: (item: PrescriptionCognitiveItem) => void;
  onDelete: (id: string) => void;
}

const CognitiveTraining: FC<CognitiveTrainingProps> = ({
  cards,
  onAdd,
  onEdit,
  onDelete,
}) => (
  <div>
    <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
      <Title level={5} style={{ margin: 0 }}>
        认知训练
      </Title>
      <Text type="secondary">每日30分钟</Text>
    </Flex>
    <Row gutter={[16, 16]}>
      {cards.map((item) => (
        <Col span={12} key={item.id}>
          <Card size="small">
            <Flex justify="space-between" align="center">
              <div>
                <Text strong>{item.cardName}</Text>
                <br />
                <Text type="secondary">{item.difficulty}</Text>
              </div>
              <Flex gap={4}>
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  aria-label={`编辑${item.cardName}`}
                  onClick={() => onEdit(item)}
                />
                <Button
                  type="link"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  aria-label={`删除${item.cardName}`}
                  onClick={() => onDelete(item.id)}
                />
              </Flex>
            </Flex>
          </Card>
        </Col>
      ))}
      <Col span={12}>
        <Button
          type="dashed"
          block
          icon={<PlusOutlined />}
          style={{ height: '100%', minHeight: 60 }}
          onClick={onAdd}
        >
          更多卡片
        </Button>
      </Col>
    </Row>
  </div>
);

export default CognitiveTraining;
