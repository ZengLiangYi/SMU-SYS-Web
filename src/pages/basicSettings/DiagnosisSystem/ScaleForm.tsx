import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDigit,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { history, useRequest, useSearchParams } from '@umijs/max';
import type { FormInstance, UploadFile } from 'antd';
import { App, Form, Spin, Upload } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createDiagnosticScale,
  getDiagnosticScaleDetail,
  updateDiagnosticScale,
} from '@/services/diagnostic-scale';
import { getDiseaseTypes } from '@/services/disease-type';
import {
  getFileUrl,
  getUploadProps,
  uploadCardButton,
  urlToUploadFile,
} from '@/utils/upload';

const BACK_URL = '/basic-settings/diagnosis-system?tab=scale';

const ScaleForm: React.FC = () => {
  const { message } = App.useApp();
  const [searchParams] = useSearchParams();
  const scaleId = searchParams.get('id') ?? '';
  const isEditMode = !!scaleId;

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const formMapRef = useRef<React.MutableRefObject<FormInstance | undefined>[]>(
    [],
  );

  // -------- 编辑模式：拉取详情 --------
  const { loading: detailLoading, run: fetchDetail } = useRequest(
    () => getDiagnosticScaleDetail(scaleId),
    {
      manual: true,
      onSuccess: (detail) => {
        // 回显图片
        if (detail.image_url) {
          setFileList([urlToUploadFile(detail.image_url)]);
        }
        // 剥离 id / sort_order
        const questions = detail.questions.map(
          ({ id: _id, sort_order: _sort, ...rest }) => rest,
        );
        // 填充 Step 1 表单（index 0 = basicInfo）
        const basicInfoForm = formMapRef.current?.[0]?.current;
        basicInfoForm?.setFieldsValue({
          name: detail.name,
          primary_diseases: detail.primary_diseases,
          introduction: detail.introduction,
          estimated_duration: detail.estimated_duration,
        });
        // 填充 Step 2 表单（index 1 = questions）
        const questionsForm = formMapRef.current?.[1]?.current;
        questionsForm?.setFieldsValue({ questions });
      },
    },
  );

  useEffect(() => {
    if (isEditMode) {
      fetchDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  // -------- 创建 --------
  const { run: runCreate } = useRequest(createDiagnosticScale, {
    manual: true,
    onSuccess: () => {
      message.success('创建成功');
      history.push(BACK_URL);
    },
    onError: () => {
      message.error('创建失败，请重试');
    },
  });

  // -------- 更新 --------
  const { run: runUpdate } = useRequest(
    (data: Parameters<typeof updateDiagnosticScale>[1]) =>
      updateDiagnosticScale(scaleId, data),
    {
      manual: true,
      onSuccess: () => {
        message.success('更新成功');
        history.push(BACK_URL);
      },
      onError: () => {
        message.error('更新失败，请重试');
      },
    },
  );

  // -------- 最终提交 --------
  const handleFinish = useCallback(
    async (values: Record<string, any>) => {
      const imageUrl =
        fileList[0]?.status === 'done' ? getFileUrl(fileList[0]) : '';
      if (!imageUrl) {
        message.error('请上传量表图片');
        return;
      }
      if (!values.questions?.length) {
        message.error('请至少添加一道题目');
        return;
      }

      const payload = {
        name: values.name,
        image_url: imageUrl,
        primary_diseases: values.primary_diseases,
        introduction: values.introduction,
        estimated_duration: values.estimated_duration,
        questions: values.questions,
      };

      if (isEditMode) {
        await runUpdate(payload);
      } else {
        await runCreate(payload);
      }
    },
    [fileList, isEditMode, message, runCreate, runUpdate],
  );

  return (
    <PageContainer
      title={isEditMode ? '编辑量表' : '添加量表'}
      onBack={() => history.push(BACK_URL)}
    >
      <ProCard>
        <Spin spinning={isEditMode && detailLoading}>
          <StepsForm
            formMapRef={formMapRef}
            stepsProps={{ size: 'small', style: { marginBottom: 24 } }}
            formProps={{
              validateMessages: { required: '${label}不能为空' },
            }}
            onFinish={handleFinish}
          >
            {/* ======== Step 1: 基本信息 ======== */}
            <StepsForm.StepForm
              name="basicInfo"
              title="基本信息"
              onFinish={async () => {
                // 校验图片
                const imageUrl =
                  fileList[0]?.status === 'done' ? getFileUrl(fileList[0]) : '';
                if (!imageUrl) {
                  message.error('请上传量表图片');
                  return false;
                }
                return true;
              }}
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
                  onChange={({ fileList: newFileList }) =>
                    setFileList(newFileList)
                  }
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
                  const { data } = await getDiseaseTypes({ limit: 100 });
                  return data.items.map((item) => ({
                    label: item.disease_name,
                    value: item.disease_name,
                  }));
                }}
                rules={[{ required: true, message: '请至少选择一个适用疾病' }]}
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
            </StepsForm.StepForm>

            {/* ======== Step 2: 题目编辑 ======== */}
            <StepsForm.StepForm
              name="questions"
              title="题目编辑"
              onFinish={async (values) => {
                if (!values.questions?.length) {
                  message.error('请至少添加一道题目');
                  return false;
                }
                return true;
              }}
            >
              <ProFormList
                name="questions"
                label="题目列表"
                min={1}
                copyIconProps={false}
                alwaysShowItemLabel
                creatorButtonProps={{ creatorButtonText: '添加题目' }}
                initialValue={isEditMode ? undefined : [{}]}
              >
                <ProFormText
                  name="question_stem"
                  label="题干"
                  placeholder="请输入题干…"
                  rules={[{ required: true, message: '请输入题干' }]}
                />
                <ProForm.Group>
                  <ProFormText
                    name="question_type"
                    label="题目类型"
                    placeholder="例如：单选题"
                    width="sm"
                    rules={[{ required: true, message: '请输入题目类型' }]}
                  />
                  <ProFormDigit
                    name="score"
                    label="分数"
                    placeholder="0"
                    width="xs"
                    fieldProps={{ precision: 1 }}
                    rules={[{ required: true, message: '请输入分数' }]}
                  />
                </ProForm.Group>
                <ProFormTextArea
                  name="question_content"
                  label="题目内容"
                  placeholder="请输入题目内容（选项文本）…"
                  fieldProps={{ rows: 2 }}
                  rules={[{ required: true, message: '请输入题目内容' }]}
                />
                <ProFormTextArea
                  name="scoring_rule"
                  label="记分规则"
                  placeholder="请输入记分规则及判定…"
                  fieldProps={{ rows: 2 }}
                  rules={[{ required: true, message: '请输入记分规则' }]}
                />
              </ProFormList>
            </StepsForm.StepForm>
          </StepsForm>
        </Spin>
      </ProCard>
    </PageContainer>
  );
};

export default ScaleForm;
