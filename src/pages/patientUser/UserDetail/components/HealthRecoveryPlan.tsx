import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import {
  Alert,
  App,
  Button,
  Card,
  Col,
  Flex,
  List,
  Row,
  Typography,
} from 'antd';
import React, { useState } from 'react';
// 直接路径引用 (bundle-barrel-imports)
import MedicationTreatment from '@/components/PrescriptionComponents/MedicationTreatment';

const { Title, Text } = Typography;

// -------- 本地类型定义（暂无对应 API） --------
interface MedicationItem {
  id: string;
  medicineName: string;
  usage: string;
  dosage: string;
}

interface CognitiveTrainingCard {
  id: string;
  cardName: string;
  difficulty: string;
}

interface ExerciseItem {
  id: string;
  exerciseName: string;
  duration: string;
}

// TODO: 替换为后端 API 接口
const MOCK_MEDICATIONS: MedicationItem[] = [
  {
    id: '1',
    medicineName: '盐酸多奈哌齐片',
    usage: '每日1次，晨起口服',
    dosage: '5mg x 7片',
  },
  {
    id: '2',
    medicineName: '甲钴胺片',
    usage: '每日3次，晨饭口服',
    dosage: '0.5mg x 20片',
  },
];

const MOCK_COGNITIVE_CARDS: CognitiveTrainingCard[] = [
  { id: '1', cardName: '记忆力翻牌', difficulty: '难度：中等' },
  { id: '2', cardName: '逻辑排序', difficulty: '难度：高' },
  { id: '3', cardName: '舒尔特方格', difficulty: '难度：初级' },
];

const MOCK_DIET =
  '建议地中海饮食模式：多食深海鱼类、坚果、蔬菜、减少咸肉摄入。补充富含维生素B12的食物。';

const MOCK_EXERCISES: ExerciseItem[] = [
  { id: '1', exerciseName: '有氧运动 (快走/慢跑)', duration: '30分钟/天' },
  { id: '2', exerciseName: '手指操 (精细动作)', duration: '10分钟/天' },
];

const HealthRecoveryPlan: React.FC = () => {
  const { message } = App.useApp();
  const [medicationList, setMedicationList] =
    useState<MedicationItem[]>(MOCK_MEDICATIONS);
  const [cognitiveCards, setCognitiveCards] =
    useState<CognitiveTrainingCard[]>(MOCK_COGNITIVE_CARDS);
  const [dietPrescription, setDietPrescription] = useState(MOCK_DIET);
  const [exerciseList, setExerciseList] =
    useState<ExerciseItem[]>(MOCK_EXERCISES);

  return (
    <div>
      {/* AI 综合建议 */}
      <Alert
        type="warning"
        message="AI综合建议"
        description="根据患者的病情和治疗效果，给出综合建议，包括药物治疗、认知训练、饮食处方、运动处方等。"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* -------- 药物治疗 -------- */}
      <MedicationTreatment
        medications={medicationList}
        onAdd={() => {
          setMedicationList((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              medicineName: '',
              usage: '',
              dosage: '',
            },
          ]);
        }}
        onEdit={() => {}}
        onDelete={(id: string) => {
          setMedicationList((prev) => prev.filter((item) => item.id !== id));
          message.success('删除成功');
        }}
      />

      {/* -------- 认知训练 -------- */}
      <Flex
        justify="space-between"
        align="center"
        style={{ margin: '24px 0 12px' }}
      >
        <Title level={5} style={{ margin: 0 }}>
          认知训练
        </Title>
        <Text type="secondary">每日30分钟</Text>
      </Flex>
      <Row gutter={[16, 16]}>
        {cognitiveCards.map((item) => (
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
                  />
                  <Button
                    type="link"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    aria-label={`删除${item.cardName}`}
                    onClick={() => {
                      setCognitiveCards((prev) =>
                        prev.filter((c) => c.id !== item.id),
                      );
                      message.success('删除成功');
                    }}
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
            onClick={() => {
              setCognitiveCards((prev) => [
                ...prev,
                {
                  id: Date.now().toString(),
                  cardName: '新关卡',
                  difficulty: '难度：初级',
                },
              ]);
            }}
          >
            更多关卡
          </Button>
        </Col>
      </Row>

      {/* -------- 饮食处方 -------- */}
      <Flex
        justify="space-between"
        align="center"
        style={{ margin: '24px 0 12px' }}
      >
        <Title level={5} style={{ margin: 0 }}>
          饮食处方
        </Title>
        <ModalForm
          title="修改饮食处方"
          trigger={<Button type="link">修改计划</Button>}
          initialValues={{ content: dietPrescription }}
          modalProps={{ destroyOnHidden: true }}
          onFinish={async (values) => {
            setDietPrescription(values.content);
            message.success('修改成功');
            return true;
          }}
        >
          <ProFormTextArea
            name="content"
            label="饮食处方内容"
            rules={[{ required: true }]}
            fieldProps={{ rows: 6 }}
          />
        </ModalForm>
      </Flex>
      <Card size="small">
        <Text type="secondary">{dietPrescription}</Text>
      </Card>

      {/* -------- 运动处方 -------- */}
      <Flex
        justify="space-between"
        align="center"
        style={{ margin: '24px 0 12px' }}
      >
        <Title level={5} style={{ margin: 0 }}>
          运动处方
        </Title>
        <Button
          type="link"
          icon={<PlusOutlined />}
          onClick={() => {
            setExerciseList((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                exerciseName: '新运动',
                duration: '15分钟/天',
              },
            ]);
          }}
        >
          添加计划
        </Button>
      </Flex>
      <List
        dataSource={exerciseList}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                key="edit"
                type="link"
                size="small"
                icon={<EditOutlined />}
                aria-label={`编辑${item.exerciseName}`}
              />,
              <Button
                key="delete"
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
                aria-label={`删除${item.exerciseName}`}
                onClick={() => {
                  setExerciseList((prev) =>
                    prev.filter((e) => e.id !== item.id),
                  );
                  message.success('删除成功');
                }}
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
    </div>
  );
};

export default HealthRecoveryPlan;
