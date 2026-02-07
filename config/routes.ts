/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
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
    access: 'canDoctor',
  },
  {
    path: '/patient-user/detail',
    component: './patientUser/UserDetail',
    hideInMenu: true,
    access: 'canDoctor',
  },
  {
    path: '/patient-user/diagnosis',
    component: './patientUser/Diagnosis',
    hideInMenu: true,
    access: 'canDoctor',
  },
  {
    path: '/diagnosis-list',
    name: '诊疗列表',
    icon: 'PlayCircleOutlined',
    component: './patientUser/DiagnosisList',
    access: 'canDoctor',
  },
  {
    path: '/drug-treatment',
    name: '药物治疗管理',
    icon: 'ApiOutlined',
    access: 'canDoctor',
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
    access: 'canDoctor',
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
        access: 'canDoctor',
      },
      {
        path: '/basic-settings/diagnosis-system/scale-form',
        component: './basicSettings/DiagnosisSystem/ScaleForm',
        hideInMenu: true,
        access: 'canDoctor',
      },
      {
        path: '/basic-settings/referral-hospital',
        name: '转诊医院列表',
        component: './basicSettings/ReferralHospital',
        access: 'canDoctor',
      },
      {
        path: '/basic-settings/doctor-list',
        name: '医师列表',
        component: './basicSettings/DoctorList',
        access: 'canAdmin',
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
