import { Alert, Flex, Spin } from 'antd';
import { forwardRef, useImperativeHandle } from 'react';
import CognitiveTraining from '@/components/PrescriptionComponents/CognitiveTraining';
import DietPrescription from '@/components/PrescriptionComponents/DietPrescription';
import ExercisePrescription from '@/components/PrescriptionComponents/ExercisePrescription';
import MedicationTreatment from '@/components/PrescriptionComponents/MedicationTreatment';
import usePrescriptionState from '@/components/PrescriptionComponents/usePrescriptionState';
import DietModal from '@/components/PrescriptionModals/DietModal';
import ExerciseModal from '@/components/PrescriptionModals/ExerciseModal';
import type {
  PrescriptionCognitiveItem,
  PrescriptionData,
  PrescriptionExerciseItem,
  PrescriptionMedicationItem,
} from '@/services/patient-user/typings.d';

export interface PrescriptionDataRef {
  getData: () => PrescriptionData;
}

interface PrescriptionContentProps {
  loading?: boolean;
  aiSummary: string | null;
  initialMedications?: PrescriptionMedicationItem[];
  initialCognitiveCards?: PrescriptionCognitiveItem[];
  initialDietContent?: string;
  initialExercises?: PrescriptionExerciseItem[];
}

const PrescriptionContent = forwardRef<
  PrescriptionDataRef,
  PrescriptionContentProps
>(
  (
    {
      loading,
      aiSummary,
      initialMedications = [],
      initialCognitiveCards = [],
      initialDietContent = '',
      initialExercises = [],
    },
    ref,
  ) => {
    const { data, actions, modalState } = usePrescriptionState({
      medications: initialMedications,
      cognitiveCards: initialCognitiveCards,
      dietContent: initialDietContent,
      exercises: initialExercises,
    });

    useImperativeHandle(ref, () => ({
      getData: () => data,
    }));

    if (loading) {
      return (
        <Spin
          description="AI 正在生成处方建议，大约需要 1-2 分钟…"
          style={{ display: 'block', padding: 60, textAlign: 'center' }}
        />
      );
    }

    return (
      <div>
        {aiSummary ? (
          <Alert
            type="info"
            showIcon
            title="AI 处方建议"
            description={aiSummary}
            style={{ marginBottom: 20 }}
          />
        ) : null}

        <MedicationTreatment
          medications={data.medications}
          onAdd={actions.addMedication}
          onDelete={actions.deleteMedication}
        />

        <Flex vertical gap={20} style={{ marginTop: 20 }}>
          <CognitiveTraining
            cards={data.cognitiveCards}
            onAdd={actions.addCognitive}
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
  },
);

PrescriptionContent.displayName = 'PrescriptionContent';

export default PrescriptionContent;
