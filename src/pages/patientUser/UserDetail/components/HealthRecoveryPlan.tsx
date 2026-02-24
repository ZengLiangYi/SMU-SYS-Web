import { Alert, Flex } from 'antd';
import type { FC } from 'react';
import CognitiveTraining from '@/components/PrescriptionComponents/CognitiveTraining';
import DietPrescription from '@/components/PrescriptionComponents/DietPrescription';
import ExercisePrescription from '@/components/PrescriptionComponents/ExercisePrescription';
import MedicationTreatment from '@/components/PrescriptionComponents/MedicationTreatment';
import usePrescriptionState from '@/components/PrescriptionComponents/usePrescriptionState';
import CognitiveModal from '@/components/PrescriptionModals/CognitiveModal';
import DietModal from '@/components/PrescriptionModals/DietModal';
import ExerciseModal from '@/components/PrescriptionModals/ExerciseModal';
import MedicationModal from '@/components/PrescriptionModals/MedicationModal';
import type {
  PrescriptionCognitiveItem,
  PrescriptionExerciseItem,
  PrescriptionMedicationItem,
} from '@/services/patient-user/typings.d';

// TODO: 替换为后端 API 接口
const MOCK_MEDICATIONS: PrescriptionMedicationItem[] = [
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

const MOCK_COGNITIVE_CARDS: PrescriptionCognitiveItem[] = [
  { id: '1', cardName: '记忆力翻牌', difficulty: '难度：中等' },
  { id: '2', cardName: '逻辑排序', difficulty: '难度：高' },
  { id: '3', cardName: '舒尔特方格', difficulty: '难度：初级' },
];

const MOCK_DIET =
  '建议地中海饮食模式：多食深海鱼类、坚果、蔬菜、减少咸肉摄入。补充富含维生素B12的食物。';

const MOCK_EXERCISES: PrescriptionExerciseItem[] = [
  { id: '1', exerciseName: '有氧运动 (快走/慢跑)', duration: '30分钟/天' },
  { id: '2', exerciseName: '手指操 (精细动作)', duration: '10分钟/天' },
];

const HealthRecoveryPlan: FC = () => {
  const { data, actions, modalState } = usePrescriptionState({
    medications: MOCK_MEDICATIONS,
    cognitiveCards: MOCK_COGNITIVE_CARDS,
    dietContent: MOCK_DIET,
    exercises: MOCK_EXERCISES,
  });

  return (
    <div>
      <Alert
        type="warning"
        message="AI综合建议"
        description="根据患者的病情和治疗效果，给出综合建议，包括药物治疗、认知训练、饮食处方、运动处方等。"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <MedicationTreatment
        medications={data.medications}
        onAdd={() => actions.openMedModal()}
        onEdit={(item) => actions.openMedModal(item)}
        onDelete={actions.deleteMedication}
      />

      <Flex vertical gap={20} style={{ marginTop: 20 }}>
        <CognitiveTraining
          cards={data.cognitiveCards}
          onAdd={() => actions.openCogModal()}
          onEdit={(item) => actions.openCogModal(item)}
          onDelete={actions.deleteCognitive}
        />

        <DietPrescription
          content={data.dietContent}
          onEdit={actions.openDietModal}
        />

        <ExercisePrescription
          exercises={data.exercises}
          onAdd={() => actions.openExModal()}
          onEdit={(item) => actions.openExModal(item)}
          onDelete={actions.deleteExercise}
        />
      </Flex>

      <MedicationModal
        open={modalState.med.open}
        onOpenChange={modalState.setMedOpen}
        editing={modalState.med.editing}
        onFinish={actions.saveMedication}
      />
      <CognitiveModal
        open={modalState.cog.open}
        onOpenChange={modalState.setCogOpen}
        editing={modalState.cog.editing}
        onFinish={actions.saveCognitive}
      />
      <DietModal
        open={modalState.diet.open}
        onOpenChange={modalState.setDietOpen}
        dietContent={data.dietContent}
        onFinish={actions.saveDiet}
      />
      <ExerciseModal
        open={modalState.ex.open}
        onOpenChange={modalState.setExOpen}
        editing={modalState.ex.editing}
        onFinish={actions.saveExercise}
      />
    </div>
  );
};

export default HealthRecoveryPlan;
