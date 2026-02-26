import { SaveOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Alert, App, Button, Empty, Flex, Spin } from 'antd';
import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CognitiveTraining from '@/components/PrescriptionComponents/CognitiveTraining';
import DietPrescription from '@/components/PrescriptionComponents/DietPrescription';
import ExercisePrescription from '@/components/PrescriptionComponents/ExercisePrescription';
import MedicationTreatment from '@/components/PrescriptionComponents/MedicationTreatment';
import usePrescriptionState from '@/components/PrescriptionComponents/usePrescriptionState';
import DietModal from '@/components/PrescriptionModals/DietModal';
import ExerciseModal from '@/components/PrescriptionModals/ExerciseModal';
import { getCurrentDiagnosis, updateDiagnosis } from '@/services/diagnosis';
import { getMedicines } from '@/services/medicine';
import type {
  PrescriptionCognitiveItem,
  PrescriptionExerciseItem,
  PrescriptionMedicationItem,
} from '@/services/patient-user/typings.d';
import { getRehabLevels } from '@/services/rehab-level';
import {
  mapCognitiveFromIds,
  mapExercisesFromPlan,
  mapMedicationsFromIds,
} from '@/utils/prescriptionMapping';

const CANDIDATE_FETCH_LIMIT = 100;

interface HealthRecoveryPlanProps {
  patientId: string;
}

const HealthRecoveryPlan: FC<HealthRecoveryPlanProps> = ({ patientId }) => {
  const { message } = App.useApp();

  const [resolved, setResolved] = useState(false);
  const [initMeds, setInitMeds] = useState<PrescriptionMedicationItem[]>([]);
  const [initCog, setInitCog] = useState<PrescriptionCognitiveItem[]>([]);
  const [initDiet, setInitDiet] = useState('');
  const [initEx, setInitEx] = useState<PrescriptionExerciseItem[]>([]);
  const [version, setVersion] = useState(0);

  const {
    data: diagnosisData,
    loading,
    error,
  } = useRequest(() => getCurrentDiagnosis(patientId), {
    refreshDeps: [patientId],
  });

  useEffect(() => {
    if (!diagnosisData) return;
    let mounted = true;

    (async () => {
      try {
        const hasMeds = diagnosisData.medicine_ids?.length > 0;
        const hasRehab = diagnosisData.rehab_level_ids?.length > 0;

        const [medRes, rehabRes] = await Promise.all([
          hasMeds ? getMedicines({ limit: CANDIDATE_FETCH_LIMIT }) : null,
          hasRehab ? getRehabLevels({ limit: CANDIDATE_FETCH_LIMIT }) : null,
        ]);

        if (!mounted) return;

        if (medRes) {
          const medMap = new Map(medRes.data.items.map((m) => [m.id, m]));
          setInitMeds(
            mapMedicationsFromIds(diagnosisData.medicine_ids, medMap),
          );
        }
        if (rehabRes) {
          const rehabMap = new Map(rehabRes.data.items.map((r) => [r.id, r]));
          setInitCog(
            mapCognitiveFromIds(diagnosisData.rehab_level_ids, rehabMap),
          );
        }
        if (diagnosisData.diet_plan) {
          setInitDiet(diagnosisData.diet_plan);
        }
        if (diagnosisData.exercise_plan?.length) {
          setInitEx(mapExercisesFromPlan(diagnosisData.exercise_plan));
        }
      } catch (e) {
        console.error('Failed to resolve prescription data:', e);
      } finally {
        if (mounted) {
          setResolved(true);
          setVersion((v) => v + 1);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [diagnosisData]);

  if (loading || (!resolved && !error)) {
    return (
      <Spin style={{ display: 'block', padding: 80, textAlign: 'center' }} />
    );
  }

  if (error || !diagnosisData?.diagnosis_id) {
    return <Empty description="暂无诊疗记录" style={{ padding: 60 }} />;
  }

  return (
    <HealthRecoveryPlanInner
      key={version}
      patientId={patientId}
      diagnosisId={diagnosisData.diagnosis_id}
      initialMedications={initMeds}
      initialCognitiveCards={initCog}
      initialDietContent={initDiet}
      initialExercises={initEx}
    />
  );
};

interface InnerProps {
  patientId: string;
  diagnosisId: string;
  initialMedications: PrescriptionMedicationItem[];
  initialCognitiveCards: PrescriptionCognitiveItem[];
  initialDietContent: string;
  initialExercises: PrescriptionExerciseItem[];
}

const HealthRecoveryPlanInner: FC<InnerProps> = ({
  patientId,
  diagnosisId,
  initialMedications,
  initialCognitiveCards,
  initialDietContent,
  initialExercises,
}) => {
  const { message } = App.useApp();

  const { data, actions, modalState } = usePrescriptionState({
    medications: initialMedications,
    cognitiveCards: initialCognitiveCards,
    dietContent: initialDietContent,
    exercises: initialExercises,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await updateDiagnosis(patientId, diagnosisId, {
        medicine_ids: data.medications.map((m) => m.id),
        rehab_level_ids: data.cognitiveCards.map((c) => c.id),
        exercise_plan: data.exercises.map((e) => ({
          name: e.name,
          quantity: e.quantity,
          unit: e.unit,
        })),
        diet_plan: data.dietContent,
      });
      message.success('处方已更新');
    } catch {
      message.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  }, [patientId, diagnosisId, data, message]);

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Alert
          type="info"
          message="当前康复处方"
          description="可直接编辑并保存处方内容"
          showIcon
          style={{ flex: 1, marginRight: 12 }}
        />
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={saving}
          onClick={handleSave}
        >
          保存处方
        </Button>
      </Flex>

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
};

export default HealthRecoveryPlan;
