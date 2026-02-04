export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/patient-user',
    name: '用户列表',
    icon: 'team',
    component: './patientUser/UserList',
  },
  {
    path: '/patient-user/detail',
    component: './patientUser/UserDetail',
    hideInMenu: true,
  },
  {
    path: '/patient-user/diagnosis',
    component: './patientUser/Diagnosis',
    hideInMenu: true,
  },
  {
    path: '/diagnosis-list',
    name: '诊疗列表',
    icon: 'PlayCircleOutlined',
    component: './patientUser/DiagnosisList',
  },
  {
    path: '/drug-treatment',
    name: '药物治疗管理',
    icon: 'ApiOutlined',
    routes: [
      {
        path: '/drug-treatment',
        redirect: '/drug-treatment/disease-type',
      },
      {
        path: '/drug-treatment/disease-type',
        name: '认知疾病类型管理',
        component: './drugTreatment/DiseaseTypeManagement',
      },
      {
        path: '/drug-treatment/drug-list',
        name: '药物列表',
        component: './drugTreatment/DrugList',
      },
    ],
  },
  {
    path: '/rehabilitation-training',
    name: '康复训练管理',
    icon: 'trophy',
    component: './rehabilitationTraining/TrainingList',
  },
  {
    path: '/basic-settings',
    name: '基础设置',
    icon: 'setting',
    routes: [
      {
        path: '/basic-settings',
        redirect: '/basic-settings/diagnosis-system',
      },
      {
        path: '/basic-settings/diagnosis-system',
        name: '诊疗体系',
        component: './basicSettings/DiagnosisSystem',
      },
      {
        path: '/basic-settings/referral-hospital',
        name: '转诊医院列表',
        component: './basicSettings/ReferralHospital',
      },
      {
        path: '/basic-settings/doctor-list',
        name: '医师列表',
        component: './basicSettings/DoctorList',
      },
    ],
  },

  {
    path: '/',
    redirect: '/patient-user/',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
