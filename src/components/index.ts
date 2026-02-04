/**
 * 这个文件作为组件的目录
 * 目的是统一管理对外输出的组件，方便分类
 */
/**
 * 布局组件
 */

/**
 * 业务组件
 */
import PatientAvatarInfoContent from './PatientAvatarInfoContent';
import { Question } from './RightContent';
import { AvatarDropdown, AvatarName } from './RightContent/AvatarDropdown';

/**
 * 处方组件
 */
export {
  CognitiveTraining,
  DietPrescription,
  ExercisePrescription,
  MedicationTreatment,
} from './PrescriptionComponents';

/**
 * 处方弹窗组件
 */
export {
  PrescriptionDetailModal,
  PrescriptionEditModal,
} from './PrescriptionModals';

export { AvatarDropdown, AvatarName, Question, PatientAvatarInfoContent };
