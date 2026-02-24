import { Alert, Flex, Spin } from 'antd';
import React, { forwardRef, useImperativeHandle } from 'react';
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

/**
 * 使用 key prop 在外层触发重新挂载来重置 initialData，
 * 避免 useEffect 同步 props 到 state 的反模式 (rerender-derived-state-no-effect)。
 */
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
          tip="AI 正在生成处方建议…"
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
  },
);

PrescriptionContent.displayName = 'PrescriptionContent';

export default PrescriptionContent;
