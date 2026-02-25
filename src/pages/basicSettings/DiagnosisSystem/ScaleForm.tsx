import type { ProFormInstance } from '@ant-design/pro-components';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { history, useRequest, useSearchParams } from '@umijs/max';
import type { UploadFile } from 'antd';
import { App, Button, Collapse, Form, Spin, Splitter, Upload } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createDiagnosticScale,
  getDiagnosticScaleDetail,
  updateDiagnosticScale,
} from '@/services/diagnostic-scale';
import type {
  DiagnosticScaleDetail,
  DiagnosticScaleQuestionPayload,
} from '@/services/diagnostic-scale/typings.d';
import { getDiseaseTypes } from '@/services/disease-type';
import type { DiseaseTypeListResult } from '@/services/disease-type/typings.d';
import {
  getFileUrl,
  getUploadProps,
  uploadCardButton,
  urlToUploadFile,
} from '@/utils/upload';
import type { QuestionEditorRef } from './components/QuestionEditor';
import QuestionEditor from './components/QuestionEditor';
import type { CopyPosition } from './components/QuestionNav';
import QuestionNav from './components/QuestionNav';

interface FetchDetailResult {
  detail: DiagnosticScaleDetail;
  diseases: DiseaseTypeListResult;
}

const BACK_URL = '/basic-settings/diagnosis-system?tab=scale';

let uidCounter = 0;
function uid(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  return `_uid_${Date.now()}_${++uidCounter}`;
}

function makeEmptyQuestion(): DiagnosticScaleQuestionPayload {
  return {
    _uid: uid(),
    question_stem: '',
    question_type: 'single_choice',
    scoring_rule: '',
    question_content: {
      options: [
        { key: 'A', label: '' },
        { key: 'B', label: '' },
      ],
      score_map: { A: 0, B: 0 },
      allow_multiple: false,
      default_score: 0,
    },
  };
}

const ScaleForm: React.FC = () => {
  const { message, modal } = App.useApp();
  const [searchParams] = useSearchParams();
  const scaleId = searchParams.get('id') ?? '';
  const isEditMode = !!scaleId;

  // ---------- State ----------
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [questions, setQuestions] = useState<DiagnosticScaleQuestionPayload[]>([
    makeEmptyQuestion(),
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [collapsed, setCollapsed] = useState(isEditMode);
  const [dataVersion, setDataVersion] = useState(0);

  // ---------- Refs ----------
  const metaFormRef = useRef<ProFormInstance>(undefined);
  const editorRef = useRef<QuestionEditorRef>(null);
  const diseaseOptionsRef = useRef<{ label: string; value: string }[]>([]);
  const dirtyRef = useRef(false);

  const setDirtyState = useCallback((value: boolean) => {
    dirtyRef.current = value;
    setDirty(value);
  }, []);

  // ---------- Unsaved changes guard ----------
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    const unblock = history.block((tx) => {
      if (!dirtyRef.current) {
        unblock();
        tx.retry();
        return;
      }
      modal.confirm({
        title: '有未保存的修改',
        content: '确定要离开吗？未保存的修改将丢失。',
        okText: '离开',
        cancelText: '留下',
        onOk: () => {
          unblock();
          tx.retry();
        },
      });
    });
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      unblock();
    };
  }, [dirty, modal]);

  const handleLeave = useCallback(() => {
    if (dirty) {
      modal.confirm({
        title: '有未保存的修改',
        content: '确定要离开吗？未保存的修改将丢失。',
        okText: '离开',
        cancelText: '留下',
        onOk: () => {
          setDirtyState(false);
          history.push(BACK_URL);
        },
      });
    } else {
      history.push(BACK_URL);
    }
  }, [dirty, modal, setDirtyState]);

  // ---------- Sync editor -> questions before switching ----------
  const syncCurrentEditor = useCallback(() => {
    const payload = editorRef.current?.getValues();
    if (payload) {
      setQuestions((prev) => {
        const next = [...prev];
        if (activeIndex < next.length) {
          next[activeIndex] = payload;
        }
        return next;
      });
    }
  }, [activeIndex]);

  // ---------- Select question ----------
  const handleSelect = useCallback(
    (index: number) => {
      syncCurrentEditor();
      setActiveIndex(index);
    },
    [syncCurrentEditor],
  );

  // ---------- Add question ----------
  const handleAdd = useCallback(() => {
    syncCurrentEditor();
    let newIndex = 0;
    setQuestions((prev) => {
      const next = [...prev, makeEmptyQuestion()];
      newIndex = next.length - 1;
      return next;
    });
    setActiveIndex(newIndex);
    setDirtyState(true);
  }, [syncCurrentEditor, setDirtyState]);

  // ---------- Copy question ----------
  const handleCopy = useCallback(
    (index: number, position: CopyPosition) => {
      syncCurrentEditor();
      let newIndex = 0;
      setQuestions((prev) => {
        const copied = { ...structuredClone(prev[index]), _uid: uid() };
        const next = [...prev];
        if (position === 'after') {
          next.splice(index + 1, 0, copied);
          newIndex = index + 1;
        } else {
          next.push(copied);
          newIndex = next.length - 1;
        }
        return next;
      });
      setActiveIndex(newIndex);
      setDirtyState(true);
    },
    [syncCurrentEditor, setDirtyState],
  );

  // ---------- Delete question ----------
  const handleDelete = useCallback(
    (index: number) => {
      let newActive = index;
      setQuestions((prev) => {
        if (prev.length <= 1) return prev;
        const next = prev.filter((_, i) => i !== index);
        newActive = index >= next.length ? next.length - 1 : index;
        return next;
      });
      setActiveIndex(newActive);
      setDirtyState(true);
    },
    [setDirtyState],
  );

  // ---------- Editor onChange ----------
  const handleEditorChange = useCallback(
    (payload: DiagnosticScaleQuestionPayload) => {
      setQuestions((prev) => {
        const next = [...prev];
        if (activeIndex < next.length) {
          next[activeIndex] = payload;
        }
        return next;
      });
      setDirtyState(true);
    },
    [activeIndex, setDirtyState],
  );

  // ---------- Edit mode: fetch detail ----------
  const applyDetail = useCallback((result: FetchDetailResult) => {
    const { detail, diseases } = result;
    if (detail.image_url) {
      setFileList([urlToUploadFile(detail.image_url)]);
    }
    metaFormRef.current?.setFieldsValue({
      name: detail.name,
      primary_diseases: detail.primary_diseases,
      introduction: detail.introduction,
      estimated_duration: detail.estimated_duration,
    });
    const qs: DiagnosticScaleQuestionPayload[] = detail.questions.map(
      ({ id: _id, sort_order: _sort, ...rest }) => ({
        ...rest,
        _uid: uid(),
      }),
    );
    setQuestions(qs.length > 0 ? qs : [makeEmptyQuestion()]);
    setActiveIndex(0);
    setDataVersion((v) => v + 1);

    diseaseOptionsRef.current = diseases.items.map((item) => ({
      label: item.disease_name,
      value: item.disease_name,
    }));
  }, []);

  const { loading: detailLoading, run: fetchDetail } = useRequest(
    async () => {
      const [detailRes, diseaseRes] = await Promise.all([
        getDiagnosticScaleDetail(scaleId),
        getDiseaseTypes({ limit: 100 }),
      ]);
      const result: FetchDetailResult = {
        detail: detailRes.data,
        diseases: diseaseRes.data,
      };
      applyDetail(result);
    },
    { manual: true },
  );

  useEffect(() => {
    if (isEditMode) {
      fetchDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  // ---------- Create ----------
  const { run: runCreate, loading: creating } = useRequest(
    createDiagnosticScale,
    {
      manual: true,
      onSuccess: () => {
        setDirtyState(false);
        message.success('创建成功');
        history.push(BACK_URL);
      },
      onError: () => {
        message.error('创建失败，请重试');
      },
    },
  );

  // ---------- Update ----------
  const { run: runUpdate, loading: updating } = useRequest(
    (data: Parameters<typeof updateDiagnosticScale>[1]) =>
      updateDiagnosticScale(scaleId, data),
    {
      manual: true,
      onSuccess: () => {
        setDirtyState(false);
        message.success('更新成功');
        history.push(BACK_URL);
      },
      onError: () => {
        message.error('更新失败，请重试');
      },
    },
  );

  const saving = creating || updating;

  // ---------- Submit ----------
  const handleSubmit = useCallback(async () => {
    syncCurrentEditor();

    try {
      await metaFormRef.current?.validateFields();
    } catch {
      setCollapsed(false);
      message.error('请完善基本信息');
      return;
    }

    const imageUrl =
      fileList[0]?.status === 'done' ? getFileUrl(fileList[0]) : '';
    if (!imageUrl) {
      setCollapsed(false);
      message.error('请上传量表图片');
      return;
    }

    const latestPayload = editorRef.current?.getValues();
    const finalQuestions = [...questions];
    if (latestPayload && activeIndex < finalQuestions.length) {
      finalQuestions[activeIndex] = latestPayload;
    }

    if (finalQuestions.length === 0) {
      message.error('请至少添加一道题目');
      return;
    }

    const editorValid = await editorRef.current?.validate();
    if (!editorValid) {
      message.error(`第 ${activeIndex + 1} 题信息不完整`);
      return;
    }

    for (let i = 0; i < finalQuestions.length; i++) {
      const q = finalQuestions[i];
      if (!q.question_stem || !q.question_type || !q.scoring_rule) {
        setActiveIndex(i);
        message.error(`第 ${i + 1} 题信息不完整，请补充`);
        return;
      }
    }

    const metaValues = metaFormRef.current?.getFieldsValue();
    if (!metaValues) {
      message.error('表单数据获取失败，请重试');
      return;
    }
    const payload = {
      name: metaValues.name,
      image_url: imageUrl,
      primary_diseases: metaValues.primary_diseases,
      introduction: metaValues.introduction,
      estimated_duration: metaValues.estimated_duration,
      questions: finalQuestions.map(({ _uid: _, ...rest }) => rest),
    };

    if (isEditMode) {
      await runUpdate(payload);
    } else {
      await runCreate(payload);
    }
  }, [
    syncCurrentEditor,
    fileList,
    questions,
    activeIndex,
    isEditMode,
    message,
    runCreate,
    runUpdate,
  ]);

  // ---------- Render ----------
  return (
    <PageContainer
      title={isEditMode ? '编辑量表' : '添加量表'}
      onBack={handleLeave}
      footer={[
        <Button key="cancel" onClick={handleLeave}>
          取消
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={saving}
          onClick={handleSubmit}
        >
          {saving ? '保存中…' : '保存'}
        </Button>,
      ]}
    >
      <Spin spinning={isEditMode && detailLoading}>
        {/* ======== Basic info (collapsible) ======== */}
        <Collapse
          activeKey={collapsed ? [] : ['meta']}
          onChange={(keys) => setCollapsed(keys.length === 0)}
          style={{ marginBlockEnd: 16 }}
          items={[
            {
              key: 'meta',
              label: '基本信息',
              forceRender: true,
              children: (
                <ProForm
                  formRef={metaFormRef}
                  submitter={false}
                  layout="vertical"
                  onValuesChange={() => setDirtyState(true)}
                >
                  <ProFormText
                    name="name"
                    label="量表名称"
                    placeholder="请输入量表名称…"
                    rules={[{ required: true, message: '请输入量表名称' }]}
                  />
                  <Form.Item label="量表图片" required>
                    <Upload
                      {...getUploadProps({ dir: 'scales', accept: 'image/*' })}
                      listType="picture-card"
                      fileList={fileList}
                      onChange={({ fileList: newFileList }) => {
                        setFileList(newFileList);
                        setDirtyState(true);
                      }}
                      maxCount={1}
                    >
                      {fileList.length >= 1 ? null : uploadCardButton}
                    </Upload>
                  </Form.Item>
                  <ProFormSelect
                    name="primary_diseases"
                    label="适用疾病"
                    placeholder="请选择或输入适用疾病…"
                    fieldProps={{ mode: 'tags' }}
                    request={async () => {
                      if (diseaseOptionsRef.current.length > 0) {
                        return diseaseOptionsRef.current;
                      }
                      const { data } = await getDiseaseTypes({ limit: 100 });
                      const opts = data.items.map((item) => ({
                        label: item.disease_name,
                        value: item.disease_name,
                      }));
                      diseaseOptionsRef.current = opts;
                      return opts;
                    }}
                    rules={[
                      { required: true, message: '请至少选择一个适用疾病' },
                    ]}
                  />
                  <ProFormTextArea
                    name="introduction"
                    label="量表介绍"
                    placeholder="请输入量表介绍…"
                    fieldProps={{ rows: 3 }}
                    rules={[{ required: true, message: '请输入量表介绍' }]}
                  />
                  <ProFormText
                    name="estimated_duration"
                    label="预估时长"
                    placeholder="例如：10分钟"
                    rules={[{ required: true, message: '请输入预估时长' }]}
                  />
                </ProForm>
              ),
            },
          ]}
        />

        {/* ======== Question editor split view ======== */}
        <ProCard style={{ minHeight: 480 }} styles={{ body: { padding: 0 } }}>
          <Splitter>
            <Splitter.Panel
              defaultSize={240}
              min={200}
              max={320}
              style={{ overflow: 'hidden' }}
            >
              <QuestionNav
                questions={questions}
                activeIndex={activeIndex}
                onSelect={handleSelect}
                onCopy={handleCopy}
                onDelete={handleDelete}
                onAdd={handleAdd}
              />
            </Splitter.Panel>
            <Splitter.Panel>
              <QuestionEditor
                ref={editorRef}
                key={`${dataVersion}-${activeIndex}`}
                question={questions[activeIndex] ?? null}
                questionIndex={activeIndex}
                onChange={handleEditorChange}
              />
            </Splitter.Panel>
          </Splitter>
        </ProCard>
      </Spin>
    </PageContainer>
  );
};

export default ScaleForm;
