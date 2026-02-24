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
  openMedModal: (item?: PrescriptionMedicationItem) => void;
  saveMedication: (values: Omit<PrescriptionMedicationItem, 'id'>) => void;
  deleteMedication: (id: string) => void;

  openCogModal: (item?: PrescriptionCognitiveItem) => void;
  saveCognitive: (values: Omit<PrescriptionCognitiveItem, 'id'>) => void;
  deleteCognitive: (id: string) => void;

  openDietModal: () => void;
  saveDiet: (content: string) => void;

  openExModal: (item?: PrescriptionExerciseItem) => void;
  saveExercise: (values: Omit<PrescriptionExerciseItem, 'id'>) => void;
  deleteExercise: (id: string) => void;
}

interface PrescriptionModalState {
  med: ModalState<PrescriptionMedicationItem>;
  setMedOpen: (open: boolean) => void;
  cog: ModalState<PrescriptionCognitiveItem>;
  setCogOpen: (open: boolean) => void;
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

  const [medModal, setMedModal] = useState<
    ModalState<PrescriptionMedicationItem>
  >({ open: false, editing: null });
  const [cogModal, setCogModal] = useState<
    ModalState<PrescriptionCognitiveItem>
  >({ open: false, editing: null });
  const [dietModalOpen, setDietModalOpen] = useState(false);
  const [exModal, setExModal] = useState<ModalState<PrescriptionExerciseItem>>({
    open: false,
    editing: null,
  });

  const openMedModal = useCallback(
    (item?: PrescriptionMedicationItem) =>
      setMedModal({ open: true, editing: item ?? null }),
    [],
  );
  const saveMedication = useCallback(
    (values: Omit<PrescriptionMedicationItem, 'id'>) => {
      setMedications((prev) => {
        if (medModal.editing) {
          return prev.map((m) =>
            m.id === medModal.editing!.id ? { ...m, ...values } : m,
          );
        }
        return [...prev, { ...values, id: Date.now().toString() }];
      });
    },
    [medModal.editing],
  );
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

  const openCogModal = useCallback(
    (item?: PrescriptionCognitiveItem) =>
      setCogModal({ open: true, editing: item ?? null }),
    [],
  );
  const saveCognitive = useCallback(
    (values: Omit<PrescriptionCognitiveItem, 'id'>) => {
      setCognitiveCards((prev) => {
        if (cogModal.editing) {
          return prev.map((c) =>
            c.id === cogModal.editing!.id ? { ...c, ...values } : c,
          );
        }
        return [...prev, { ...values, id: Date.now().toString() }];
      });
    },
    [cogModal.editing],
  );
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
      openMedModal,
      saveMedication,
      deleteMedication,
      openCogModal,
      saveCognitive,
      deleteCognitive,
      openDietModal,
      saveDiet,
      openExModal,
      saveExercise,
      deleteExercise,
    },
    modalState: {
      med: medModal,
      setMedOpen: (open: boolean) => setMedModal((prev) => ({ ...prev, open })),
      cog: cogModal,
      setCogOpen: (open: boolean) => setCogModal((prev) => ({ ...prev, open })),
      diet: { open: dietModalOpen },
      setDietOpen: setDietModalOpen,
      ex: exModal,
      setExOpen: (open: boolean) => setExModal((prev) => ({ ...prev, open })),
    },
  };
}
