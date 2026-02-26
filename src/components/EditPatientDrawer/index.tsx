import {
  DrawerForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { App, Col, Divider, Row } from 'antd';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { updatePatient } from '@/services/patient-user';
import type { PatientDetail } from '@/services/patient-user/typings.d';

interface EditPatientDrawerProps {
  patientId: string;
  patientDetail: PatientDetail;
  onSaved?: () => void;
  trigger: React.ReactElement;
}

const EditPatientDrawer: FC<EditPatientDrawerProps> = ({
  patientId,
  patientDetail,
  onSaved,
  trigger,
}) => {
  const { message } = App.useApp();

  const { run: runUpdate, loading: saving } = useRequest(
    (data: Record<string, any>) => updatePatient(patientId, data),
    {
      manual: true,
      onSuccess: () => {
        message.success('保存成功');
        onSaved?.();
      },
    },
  );

  return (
    <DrawerForm
      title="编辑个人信息"
      trigger={trigger}
      width={560}
      initialValues={{
        ...patientDetail,
        diet_habits: patientDetail.diet_habits ?? '',
        lifestyle_habits: patientDetail.lifestyle_habits ?? '',
        family_history: patientDetail.family_history ?? '',
        education_level: patientDetail.education_level ?? '',
        medical_history: patientDetail.medical_history ?? '',
        medication_history: patientDetail.medication_history ?? '',
        occupation: patientDetail.occupation ?? '',
        native_place: patientDetail.native_place ?? '',
        address: patientDetail.address ?? '',
        bad_habits: patientDetail.bad_habits ?? '',
        followup_willing:
          patientDetail.followup_willing != null
            ? String(patientDetail.followup_willing)
            : undefined,
      }}
      drawerProps={{ destroyOnHidden: true }}
      loading={saving}
      onFinish={async (values) => {
        await runUpdate(values);
        return true;
      }}
    >
      <Divider titlePlacement="start" style={{ marginTop: 0 }}>
        基本信息
      </Divider>
      <Row gutter={16}>
        <Col span={12}>
          <ProFormText name="name" label="姓名" rules={[{ required: true }]} />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="gender"
            label="性别"
            options={[
              { label: '男', value: '男' },
              { label: '女', value: '女' },
            ]}
            rules={[{ required: true }]}
          />
        </Col>
        <Col span={12}>
          <ProFormDatePicker
            name="birth_date"
            label="出生日期"
            rules={[{ required: true }]}
            transform={(value: string) => ({
              birth_date: value ? dayjs(value).format('YYYY-MM-DD') : '',
            })}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            name="phone"
            label="联系方式"
            rules={[{ required: true }]}
          />
        </Col>
      </Row>

      <Divider titlePlacement="start">健康与习惯</Divider>
      <Row gutter={16}>
        <Col span={12}>
          <ProFormText name="diet_habits" label="饮食习惯" />
        </Col>
        <Col span={12}>
          <ProFormText name="lifestyle_habits" label="生活习惯" />
        </Col>
      </Row>
      <ProFormTextArea name="bad_habits" label="不良嗜好" />

      <Divider titlePlacement="start">病史与用药</Divider>
      <ProFormText name="family_history" label="家族史" />
      <ProFormTextArea name="medical_history" label="既往病史" />
      <ProFormTextArea name="medication_history" label="既往用药" />

      <Divider titlePlacement="start">社会信息</Divider>
      <Row gutter={16}>
        <Col span={12}>
          <ProFormText name="education_level" label="受教育程度" />
        </Col>
        <Col span={12}>
          <ProFormText name="occupation" label="职业" />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="followup_willing"
            label="随访意愿"
            options={[
              { label: '愿意', value: 'true' },
              { label: '不愿意', value: 'false' },
            ]}
            allowClear
            transform={(value) => ({
              followup_willing:
                value === 'true' ? true : value === 'false' ? false : undefined,
            })}
          />
        </Col>
      </Row>

      <Divider titlePlacement="start">地址信息</Divider>
      <Row gutter={16}>
        <Col span={12}>
          <ProFormText name="native_place" label="籍贯" />
        </Col>
        <Col span={12}>
          <ProFormText name="address" label="地址" />
        </Col>
      </Row>
    </DrawerForm>
  );
};

export default EditPatientDrawer;
