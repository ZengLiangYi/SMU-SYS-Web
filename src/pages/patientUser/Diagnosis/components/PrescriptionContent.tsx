import { ReloadOutlined } from '@ant-design/icons';
import { Alert, Button, Flex, Spin } from 'antd';
import { forwardRef, useImperativeHandle, useMemo } from 'react';
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
  onRetry?: () => void;
  onDirty?: () => void;
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
      onRetry,
      onDirty,
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

    // 仅在用户实际操作（增删改）时触发 dirty，避免引用比较误触发
    const dirtyActions = useMemo(() => {
      const notify = () => onDirty?.();
      return {
        addMedication: (...args: Parameters<typeof actions.addMedication>) => {
          actions.addMedication(...args);
          notify();
        },
        deleteMedication: (
          ...args: Parameters<typeof actions.deleteMedication>
        ) => {
          actions.deleteMedication(...args);
          notify();
        },
        addCognitive: (...args: Parameters<typeof actions.addCognitive>) => {
          actions.addCognitive(...args);
          notify();
        },
        deleteCognitive: (
          ...args: Parameters<typeof actions.deleteCognitive>
        ) => {
          actions.deleteCognitive(...args);
          notify();
        },
        saveDiet: async (...args: Parameters<typeof actions.saveDiet>) => {
          const r = await actions.saveDiet(...args);
          notify();
          return r;
        },
        saveExercise: async (
          ...args: Parameters<typeof actions.saveExercise>
        ) => {
          const r = await actions.saveExercise(...args);
          notify();
          return r;
        },
        deleteExercise: (
          ...args: Parameters<typeof actions.deleteExercise>
        ) => {
          actions.deleteExercise(...args);
          notify();
        },
      };
    }, [actions, onDirty]);

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
        <Flex
          justify={aiSummary ? 'space-between' : 'flex-end'}
          align="center"
          style={{ marginBottom: aiSummary ? 0 : 12 }}
        >
          {aiSummary ? (
            <Alert
              type="info"
              showIcon
              title="AI 处方建议"
              description={aiSummary}
              style={{
                marginBottom: 20,
                flex: 1,
                marginRight: onRetry ? 12 : 0,
              }}
            />
          ) : null}
          {onRetry ? (
            <Button
              icon={<ReloadOutlined />}
              size="small"
              onClick={onRetry}
              style={{ flexShrink: 0 }}
            >
              重新生成
            </Button>
          ) : null}
        </Flex>

        <MedicationTreatment
          medications={data.medications}
          onAdd={dirtyActions.addMedication}
          onDelete={dirtyActions.deleteMedication}
        />

        <Flex vertical gap={20} style={{ marginTop: 20 }}>
          <CognitiveTraining
            cards={data.cognitiveCards}
            onAdd={dirtyActions.addCognitive}
            onDelete={dirtyActions.deleteCognitive}
          />

          <DietPrescription
            content={data.dietContent}
            onEdit={actions.openDietModal}
          />

          <ExercisePrescription
            exercises={data.exercises}
            onAdd={() => actions.openExModal()}
            onEdit={(item) => actions.openExModal(item)}
            onDelete={dirtyActions.deleteExercise}
          />
        </Flex>

        <DietModal
          open={modalState.diet.open}
          onOpenChange={modalState.setDietOpen}
          dietContent={data.dietContent}
          onFinish={dirtyActions.saveDiet}
        />
        <ExerciseModal
          open={modalState.ex.open}
          onOpenChange={modalState.setExOpen}
          editing={modalState.ex.editing}
          onFinish={dirtyActions.saveExercise}
        />
      </div>
    );
  },
);

PrescriptionContent.displayName = 'PrescriptionContent';

export default PrescriptionContent;
