import { App } from 'antd';
import { useCallback, useState } from 'react';
import type {
  PrescriptionCognitiveItem,
  PrescriptionData,
  PrescriptionExerciseItem,
  PrescriptionMedicationItem,
} from '@/services/patient-user/typings.d';

interface ModalState<T> {
  open: boolean;
  editing: T | null;
}

interface PrescriptionActions {
  addMedication: (item: PrescriptionMedicationItem) => void;
  deleteMedication: (id: string) => void;

  addCognitive: (item: PrescriptionCognitiveItem) => void;
  deleteCognitive: (id: string) => void;

  openDietModal: () => void;
  saveDiet: (content: string) => void;

  openExModal: (item?: PrescriptionExerciseItem) => void;
  saveExercise: (values: Omit<PrescriptionExerciseItem, 'id'>) => void;
  deleteExercise: (id: string) => void;
}

interface PrescriptionModalState {
  diet: { open: boolean };
  setDietOpen: (open: boolean) => void;
  ex: ModalState<PrescriptionExerciseItem>;
  setExOpen: (open: boolean) => void;
}

export interface UsePrescriptionStateReturn {
  data: PrescriptionData;
  actions: PrescriptionActions;
  modalState: PrescriptionModalState;
}

export default function usePrescriptionState(
  initial?: Partial<PrescriptionData>,
): UsePrescriptionStateReturn {
  const { modal } = App.useApp();

  const [medications, setMedications] = useState<PrescriptionMedicationItem[]>(
    initial?.medications ?? [],
  );
  const [cognitiveCards, setCognitiveCards] = useState<
    PrescriptionCognitiveItem[]
  >(initial?.cognitiveCards ?? []);
  const [dietContent, setDietContent] = useState(initial?.dietContent ?? '');
  const [exercises, setExercises] = useState<PrescriptionExerciseItem[]>(
    initial?.exercises ?? [],
  );

  const [dietModalOpen, setDietModalOpen] = useState(false);
  const [exModal, setExModal] = useState<ModalState<PrescriptionExerciseItem>>({
    open: false,
    editing: null,
  });

  const addMedication = useCallback((item: PrescriptionMedicationItem) => {
    setMedications((prev) => {
      if (prev.some((m) => m.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);
  const deleteMedication = useCallback(
    (id: string) => {
      modal.confirm({
        title: '确认删除',
        content: '确定要删除该药物？',
        onOk: () => setMedications((prev) => prev.filter((m) => m.id !== id)),
      });
    },
    [modal],
  );

  const addCognitive = useCallback((item: PrescriptionCognitiveItem) => {
    setCognitiveCards((prev) => {
      if (prev.some((c) => c.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);
  const deleteCognitive = useCallback(
    (id: string) => {
      modal.confirm({
        title: '确认删除',
        content: '确定要删除该训练项？',
        onOk: () =>
          setCognitiveCards((prev) => prev.filter((c) => c.id !== id)),
      });
    },
    [modal],
  );

  const openDietModal = useCallback(() => setDietModalOpen(true), []);
  const saveDiet = useCallback(
    (content: string) => setDietContent(content),
    [],
  );

  const openExModal = useCallback(
    (item?: PrescriptionExerciseItem) =>
      setExModal({ open: true, editing: item ?? null }),
    [],
  );
  const saveExercise = useCallback(
    (values: Omit<PrescriptionExerciseItem, 'id'>) => {
      setExercises((prev) => {
        if (exModal.editing) {
          return prev.map((e) =>
            e.id === exModal.editing!.id ? { ...e, ...values } : e,
          );
        }
        return [...prev, { ...values, id: Date.now().toString() }];
      });
    },
    [exModal.editing],
  );
  const deleteExercise = useCallback(
    (id: string) => {
      modal.confirm({
        title: '确认删除',
        content: '确定要删除该运动项？',
        onOk: () => setExercises((prev) => prev.filter((e) => e.id !== id)),
      });
    },
    [modal],
  );

  return {
    data: { medications, cognitiveCards, dietContent, exercises },
    actions: {
      addMedication,
      deleteMedication,
      addCognitive,
      deleteCognitive,
      openDietModal,
      saveDiet,
      openExModal,
      saveExercise,
      deleteExercise,
    },
    modalState: {
      diet: { open: dietModalOpen },
      setDietOpen: setDietModalOpen,
      ex: exModal,
      setExOpen: (open: boolean) => setExModal((prev) => ({ ...prev, open })),
    },
  };
}
