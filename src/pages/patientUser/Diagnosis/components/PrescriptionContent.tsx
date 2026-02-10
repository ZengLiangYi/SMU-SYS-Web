import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Alert, App, Spin } from 'antd';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import CognitiveTraining from '@/components/PrescriptionComponents/CognitiveTraining';
import DietPrescription from '@/components/PrescriptionComponents/DietPrescription';
import ExercisePrescription from '@/components/PrescriptionComponents/ExercisePrescription';
import MedicationTreatment from '@/components/PrescriptionComponents/MedicationTreatment';

// -------- 数据类型 --------
export interface MedicationItem {
  id: string;
  medicineName: string;
  usage: string;
  dosage: string;
}

export interface CognitiveItem {
  id: string;
  cardName: string;
  difficulty: string;
}

export interface ExerciseItem {
  id: string;
  exerciseName: string;
  duration: string;
}

// -------- forwardRef 暴露接口 --------
export interface PrescriptionDataRef {
  getData: () => {
    medications: MedicationItem[];
    cognitiveCards: CognitiveItem[];
    dietContent: string;
    exercises: ExerciseItem[];
  };
}

interface PrescriptionContentProps {
  loading?: boolean;
  aiSummary: string | null;
  initialMedications?: MedicationItem[];
  initialCognitiveCards?: CognitiveItem[];
  initialDietContent?: string;
  initialExercises?: ExerciseItem[];
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
    const { modal } = App.useApp();

    // -------- 内部状态 --------
    const [medications, setMedications] =
      useState<MedicationItem[]>(initialMedications);
    const [cognitiveCards, setCognitiveCards] = useState<CognitiveItem[]>(
      initialCognitiveCards,
    );
    const [dietContent, setDietContent] = useState(initialDietContent);
    const [exercises, setExercises] =
      useState<ExerciseItem[]>(initialExercises);

    // 当 initialData 从 hook 加载完成后同步
    useEffect(() => {
      setMedications(initialMedications);
    }, [initialMedications]);
    useEffect(() => {
      setCognitiveCards(initialCognitiveCards);
    }, [initialCognitiveCards]);
    useEffect(() => {
      setDietContent(initialDietContent);
    }, [initialDietContent]);
    useEffect(() => {
      setExercises(initialExercises);
    }, [initialExercises]);

    // -------- 编辑中的项目（用于 ModalForm） --------
    const [editingMedication, setEditingMedication] =
      useState<MedicationItem | null>(null);
    const [editingCognitive, setEditingCognitive] =
      useState<CognitiveItem | null>(null);
    const [editingExercise, setEditingExercise] = useState<ExerciseItem | null>(
      null,
    );

    // Modal 可见性
    const [medModalOpen, setMedModalOpen] = useState(false);
    const [cogModalOpen, setCogModalOpen] = useState(false);
    const [dietModalOpen, setDietModalOpen] = useState(false);
    const [exModalOpen, setExModalOpen] = useState(false);

    // -------- 暴露 getData --------
    useImperativeHandle(ref, () => ({
      getData: () => ({ medications, cognitiveCards, dietContent, exercises }),
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
            message="AI 处方建议"
            description={aiSummary}
            style={{ marginBottom: 20 }}
          />
        ) : null}

        {/* 药物治疗 */}
        <MedicationTreatment
          medications={medications}
          onAdd={() => {
            setEditingMedication(null);
            setMedModalOpen(true);
          }}
          onEdit={(item) => {
            setEditingMedication(item);
            setMedModalOpen(true);
          }}
          onDelete={(id) => {
            modal.confirm({
              title: '确认删除',
              content: '确定要删除该药物？',
              onOk: () =>
                setMedications((prev) => prev.filter((m) => m.id !== id)),
            });
          }}
        />

        {/* 认知训练 */}
        <div style={{ marginTop: 20 }}>
          <CognitiveTraining
            cards={cognitiveCards}
            onAdd={() => {
              setEditingCognitive(null);
              setCogModalOpen(true);
            }}
            onEdit={(item) => {
              setEditingCognitive(item);
              setCogModalOpen(true);
            }}
            onDelete={(id) => {
              modal.confirm({
                title: '确认删除',
                content: '确定要删除该训练项？',
                onOk: () =>
                  setCognitiveCards((prev) => prev.filter((c) => c.id !== id)),
              });
            }}
          />
        </div>

        {/* 饮食处方 */}
        <div style={{ marginTop: 20 }}>
          <DietPrescription
            content={dietContent}
            onEdit={() => setDietModalOpen(true)}
          />
        </div>

        {/* 运动处方 */}
        <div style={{ marginTop: 20 }}>
          <ExercisePrescription
            exercises={exercises}
            onAdd={() => {
              setEditingExercise(null);
              setExModalOpen(true);
            }}
            onEdit={(item) => {
              setEditingExercise(item);
              setExModalOpen(true);
            }}
            onDelete={(id) => {
              modal.confirm({
                title: '确认删除',
                content: '确定要删除该运动项？',
                onOk: () =>
                  setExercises((prev) => prev.filter((e) => e.id !== id)),
              });
            }}
          />
        </div>

        {/* -------- ModalForm: 药物 -------- */}
        <ModalForm
          title={editingMedication ? '编辑药物' : '添加药物'}
          open={medModalOpen}
          onOpenChange={setMedModalOpen}
          initialValues={editingMedication ?? undefined}
          modalProps={{ destroyOnClose: true }}
          onFinish={async (values: MedicationItem) => {
            if (editingMedication) {
              setMedications((prev) =>
                prev.map((item) =>
                  item.id === editingMedication.id
                    ? { ...item, ...values }
                    : item,
                ),
              );
            } else {
              setMedications((prev) => [
                ...prev,
                { ...values, id: Date.now().toString() },
              ]);
            }
            return true;
          }}
        >
          <ProFormText
            name="medicineName"
            label="药品名称"
            rules={[{ required: true }]}
            placeholder="请输入药品名称…"
          />
          <ProFormText
            name="usage"
            label="用法"
            rules={[{ required: true }]}
            placeholder="请输入用法…"
          />
          <ProFormText
            name="dosage"
            label="剂量"
            rules={[{ required: true }]}
            placeholder="请输入剂量…"
          />
        </ModalForm>

        {/* -------- ModalForm: 认知训练 -------- */}
        <ModalForm
          title={editingCognitive ? '编辑训练项' : '添加训练项'}
          open={cogModalOpen}
          onOpenChange={setCogModalOpen}
          initialValues={editingCognitive ?? undefined}
          modalProps={{ destroyOnClose: true }}
          onFinish={async (values: CognitiveItem) => {
            if (editingCognitive) {
              setCognitiveCards((prev) =>
                prev.map((item) =>
                  item.id === editingCognitive.id
                    ? { ...item, ...values }
                    : item,
                ),
              );
            } else {
              setCognitiveCards((prev) => [
                ...prev,
                { ...values, id: Date.now().toString() },
              ]);
            }
            return true;
          }}
        >
          <ProFormText
            name="cardName"
            label="训练名称"
            rules={[{ required: true }]}
            placeholder="请输入训练名称…"
          />
          <ProFormSelect
            name="difficulty"
            label="难度"
            rules={[{ required: true }]}
            placeholder="请选择难度…"
            options={[
              { label: '初级', value: '难度：初级' },
              { label: '中等', value: '难度：中等' },
              { label: '高', value: '难度：高' },
            ]}
          />
        </ModalForm>

        {/* -------- ModalForm: 饮食 -------- */}
        <ModalForm
          title="编辑饮食处方"
          open={dietModalOpen}
          onOpenChange={setDietModalOpen}
          initialValues={{ dietContent }}
          modalProps={{ destroyOnClose: true }}
          onFinish={async (values) => {
            setDietContent(values.dietContent);
            return true;
          }}
        >
          <ProFormTextArea
            name="dietContent"
            label="饮食建议"
            rules={[{ required: true }]}
            placeholder="请输入饮食建议…"
            fieldProps={{ rows: 4 }}
          />
        </ModalForm>

        {/* -------- ModalForm: 运动 -------- */}
        <ModalForm
          title={editingExercise ? '编辑运动项' : '添加运动项'}
          open={exModalOpen}
          onOpenChange={setExModalOpen}
          initialValues={editingExercise ?? undefined}
          modalProps={{ destroyOnClose: true }}
          onFinish={async (values: ExerciseItem) => {
            if (editingExercise) {
              setExercises((prev) =>
                prev.map((item) =>
                  item.id === editingExercise.id
                    ? { ...item, ...values }
                    : item,
                ),
              );
            } else {
              setExercises((prev) => [
                ...prev,
                { ...values, id: Date.now().toString() },
              ]);
            }
            return true;
          }}
        >
          <ProFormText
            name="exerciseName"
            label="运动名称"
            rules={[{ required: true }]}
            placeholder="请输入运动名称…"
          />
          <ProFormText
            name="duration"
            label="时长"
            rules={[{ required: true }]}
            placeholder="请输入时长…"
          />
        </ModalForm>
      </div>
    );
  },
);

PrescriptionContent.displayName = 'PrescriptionContent';

export default PrescriptionContent;
