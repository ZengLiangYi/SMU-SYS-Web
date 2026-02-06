import { Alert, Spin } from 'antd';
import React from 'react';
import {
  CognitiveTraining,
  DietPrescription,
  ExercisePrescription,
  MedicationTreatment,
} from '@/components/PrescriptionComponents';

interface MedicationItem {
  id: string;
  medicineName: string;
  usage: string;
  dosage: string;
}

interface CognitiveItem {
  id: string;
  cardName: string;
  difficulty: string;
}

interface ExerciseItem {
  id: string;
  exerciseName: string;
  duration: string;
}

interface PrescriptionContentProps {
  loading?: boolean;
  aiSummary: string | null;
  medications: MedicationItem[];
  cognitiveCards: CognitiveItem[];
  dietContent: string;
  exercises: ExerciseItem[];
  onMedicationsChange: (items: MedicationItem[]) => void;
  onCognitiveCardsChange: (items: CognitiveItem[]) => void;
  onDietContentChange: (content: string) => void;
  onExercisesChange: (items: ExerciseItem[]) => void;
  // CRUD callbacks
  onAddMedication: () => void;
  onEditMedication: (item: MedicationItem) => void;
  onDeleteMedication: (id: string) => void;
  onAddCognitive: () => void;
  onEditCognitive: (item: CognitiveItem) => void;
  onDeleteCognitive: (id: string) => void;
  onEditDiet: () => void;
  onAddExercise: () => void;
  onEditExercise: (item: ExerciseItem) => void;
  onDeleteExercise: (id: string) => void;
}

const PrescriptionContent: React.FC<PrescriptionContentProps> = ({
  loading,
  aiSummary,
  medications,
  cognitiveCards,
  dietContent,
  exercises,
  onAddMedication,
  onEditMedication,
  onDeleteMedication,
  onAddCognitive,
  onEditCognitive,
  onDeleteCognitive,
  onEditDiet,
  onAddExercise,
  onEditExercise,
  onDeleteExercise,
}) => {
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
      {aiSummary && (
        <Alert
          type="info"
          showIcon
          message="AI 处方建议"
          description={aiSummary}
          style={{ marginBottom: 20 }}
        />
      )}

      {/* 药物治疗 */}
      <MedicationTreatment
        medications={medications}
        onAdd={onAddMedication}
        onEdit={onEditMedication}
        onDelete={onDeleteMedication}
      />

      {/* 认知训练 */}
      <div style={{ marginTop: 20 }}>
        <CognitiveTraining
          cards={cognitiveCards}
          onAdd={onAddCognitive}
          onEdit={onEditCognitive}
          onDelete={onDeleteCognitive}
        />
      </div>

      {/* 饮食处方 */}
      <div style={{ marginTop: 20 }}>
        <DietPrescription content={dietContent} onEdit={onEditDiet} />
      </div>

      {/* 运动处方 */}
      <div style={{ marginTop: 20 }}>
        <ExercisePrescription
          exercises={exercises}
          onAdd={onAddExercise}
          onEdit={onEditExercise}
          onDelete={onDeleteExercise}
        />
      </div>
    </div>
  );
};

export default PrescriptionContent;
