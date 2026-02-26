import type { Medicine } from '@/services/medicine/typings.d';
import type {
  PrescriptionCognitiveItem,
  PrescriptionExerciseItem,
  PrescriptionMedicationItem,
} from '@/services/patient-user/typings.d';
import type { RehabLevel } from '@/services/rehab-level/typings.d';

export const mapMedicationsFromIds = (
  ids: string[],
  medMap: Map<string, Medicine>,
): PrescriptionMedicationItem[] =>
  ids
    .map((id) => {
      const med = medMap.get(id);
      return med
        ? { id: med.id, name: med.name, usage: med.usage ?? '' }
        : null;
    })
    .filter((item): item is PrescriptionMedicationItem => item !== null);

export const mapCognitiveFromIds = (
  ids: string[],
  rehabMap: Map<string, RehabLevel>,
): PrescriptionCognitiveItem[] =>
  ids
    .map((id) => {
      const rehab = rehabMap.get(id);
      return rehab
        ? { id: rehab.id, name: rehab.name, levelType: rehab.level_type ?? '' }
        : null;
    })
    .filter((item): item is PrescriptionCognitiveItem => item !== null);

export const mapExercisesFromPlan = (
  exercises: Array<{
    item?: string;
    name?: string;
    quantity: number;
    unit: string;
  }>,
): PrescriptionExerciseItem[] =>
  exercises.map((e, i) => ({
    id: `ex-${i}`,
    name: e.item ?? e.name ?? '',
    quantity: e.quantity,
    unit: e.unit,
  }));
