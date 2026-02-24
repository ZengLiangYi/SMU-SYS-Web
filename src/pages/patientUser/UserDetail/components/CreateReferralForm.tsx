import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormDependency,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import { App } from 'antd';
import type { FC } from 'react';
import { useCallback, useMemo, useRef } from 'react';
import { getDoctorMetadata } from '@/services/doctor-metadata';
import { createReferral } from '@/services/patient-user';
import { getReferrals as getReferralHospitals } from '@/services/referral';
import type { Referral } from '@/services/referral/typings.d';

interface CreateReferralFormProps {
  patientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOk?: () => void;
}

const CreateReferralForm: FC<CreateReferralFormProps> = ({
  patientId,
  open,
  onOpenChange,
  onOk,
}) => {
  const { message } = App.useApp();
  const { initialState } = useModel('@@initialState');
  const currentDoctorId = initialState?.currentUser?.id;

  const formRef = useRef<ProFormInstance>(undefined);
  // 缓存转诊医院列表用于按医院名分组
  const hospitalsRef = useRef<Referral[]>([]);

  const { run, loading } = useRequest(
    (values: Parameters<typeof createReferral>[1]) =>
      createReferral(patientId, values),
    {
      manual: true,
      onSuccess: (_, [params]) => {
        if (params.referral_type === 'internal') {
          message.success('院内转诊成功，患者已转移至接诊医生名下');
        } else {
          message.success('院外转诊记录创建成功');
        }
        onOk?.();
      },
      onError: () => {
        message.error('转诊失败，请重试');
      },
    },
  );

  // -------- 院内转诊：获取可用医生列表 --------
  const fetchDoctors = useCallback(async () => {
    const res = await getDoctorMetadata();
    return (res.data ?? [])
      .filter((d) => d.id !== currentDoctorId)
      .map((d) => ({ label: d.name, value: d.id }));
  }, [currentDoctorId]);

  // -------- 院外转诊：获取转诊医院列表 --------
  const fetchHospitals = useCallback(async () => {
    const res = await getReferralHospitals({ limit: 100 });
    const items = res.data.items ?? [];
    hospitalsRef.current = items;
    // 按 hospital_name 去重，作为医院选项
    const uniqueNames = [...new Set(items.map((h) => h.hospital_name))];
    return uniqueNames.map((name) => ({ label: name, value: name }));
  }, []);

  /** 根据选中的医院名称，获取该医院下的医生选项 */
  const getDoctorOptionsByHospital = useMemo(
    () => (hospitalName: string) => {
      return hospitalsRef.current
        .filter((h) => h.hospital_name === hospitalName)
        .map((h) => ({
          label: `${h.doctor_name}（${h.title}）`,
          value: h.id,
        }));
    },
    [],
  );

  return (
    <ModalForm
      title="创建转诊"
      formRef={formRef}
      open={open}
      onOpenChange={onOpenChange}
      width={520}
      initialValues={{ referral_type: 'internal', is_accepted: true }}
      modalProps={{
        destroyOnHidden: true,
        okButtonProps: { loading },
      }}
      onFinish={async (values) => {
        try {
          const payload: Parameters<typeof createReferral>[1] = {
            referral_type: values.referral_type,
            referral_date: values.referral_date,
          };
          if (values.referral_type === 'internal') {
            payload.to_doctor_id = values.to_doctor_id;
            payload.note = values.note;
          } else {
            // hospital_referral_id 是 Referral 配置表的 id，即 hospital_id
            payload.hospital_id = values.hospital_referral_id;
            payload.to_doctor_name = values.to_doctor_name;
            payload.to_doctor_phone = values.to_doctor_phone;
            payload.is_accepted = values.is_accepted;
          }
          await run(payload);
          return true;
        } catch {
          return false;
        }
      }}
    >
      <ProFormRadio.Group
        name="referral_type"
        label="转诊类型"
        rules={[{ required: true }]}
        options={[
          { label: '院内转诊', value: 'internal' },
          { label: '院外转诊', value: 'external' },
        ]}
      />

      <ProFormDateTimePicker
        name="referral_date"
        label="转诊时间"
        placeholder="请选择转诊时间"
        rules={[{ required: true, message: '请选择转诊时间' }]}
        fieldProps={{
          style: { width: '100%' },
          format: 'YYYY-MM-DD HH:mm',
          showTime: { format: 'HH:mm' },
        }}
      />

      <ProFormDependency name={['referral_type']}>
        {({ referral_type }) => {
          if (referral_type === 'internal') {
            return (
              <>
                <ProFormSelect
                  name="to_doctor_id"
                  label="接诊医生"
                  placeholder="请选择接诊医生"
                  rules={[{ required: true, message: '请选择接诊医生' }]}
                  request={fetchDoctors}
                  showSearch
                  fieldProps={{
                    filterOption: (input, option) =>
                      (option?.label as string)
                        ?.toLowerCase()
                        .includes(input.toLowerCase()) ?? false,
                  }}
                />
                <ProFormTextArea
                  name="note"
                  label="备注"
                  placeholder="请输入备注…"
                />
              </>
            );
          }

          return (
            <>
              <ProFormSelect
                name="hospital_name_select"
                label="转诊医院"
                placeholder="请选择转诊医院"
                rules={[{ required: true, message: '请选择转诊医院' }]}
                request={fetchHospitals}
                showSearch
                fieldProps={{
                  filterOption: (input, option) =>
                    (option?.label as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase()) ?? false,
                  onChange: () => {
                    // 切换医院时清空已选医生和自动填充字段
                    formRef.current?.setFieldsValue({
                      hospital_referral_id: undefined,
                      to_doctor_name: undefined,
                      to_doctor_phone: undefined,
                    });
                  },
                }}
              />

              <ProFormDependency name={['hospital_name_select']}>
                {({ hospital_name_select }) => {
                  if (!hospital_name_select) return null;
                  const doctorOptions =
                    getDoctorOptionsByHospital(hospital_name_select);
                  // 如果该医院只有一个医生，自动选中并填充
                  if (doctorOptions.length === 1) {
                    const only = hospitalsRef.current.find(
                      (h) => h.id === doctorOptions[0].value,
                    );
                    // 延迟设置避免渲染中更新
                    setTimeout(() => {
                      formRef.current?.setFieldsValue({
                        hospital_referral_id: only?.id,
                        to_doctor_name: only?.doctor_name,
                        to_doctor_phone: only?.contact,
                      });
                    }, 0);
                  }
                  return (
                    <ProFormSelect
                      name="hospital_referral_id"
                      label="接诊医生"
                      placeholder="请选择接诊医生"
                      rules={[{ required: true, message: '请选择接诊医生' }]}
                      options={doctorOptions}
                      fieldProps={{
                        onChange: (value: string) => {
                          const hospital = hospitalsRef.current.find(
                            (h) => h.id === value,
                          );
                          if (hospital) {
                            formRef.current?.setFieldsValue({
                              to_doctor_name: hospital.doctor_name,
                              to_doctor_phone: hospital.contact,
                            });
                          }
                        },
                      }}
                    />
                  );
                }}
              </ProFormDependency>

              <ProFormText
                name="to_doctor_name"
                label="接诊医生姓名"
                placeholder="请输入接诊医生姓名…"
              />
              <ProFormText
                name="to_doctor_phone"
                label="接诊医生电话"
                placeholder="请输入接诊医生电话…"
              />
              <ProFormSwitch name="is_accepted" label="是否同意转诊" />
            </>
          );
        }}
      </ProFormDependency>
    </ModalForm>
  );
};

export default CreateReferralForm;
