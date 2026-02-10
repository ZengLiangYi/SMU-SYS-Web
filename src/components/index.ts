/**
 * 这个文件作为组件的目录
 * 目的是统一管理对外输出的组件，方便分类
 */

/**
 * 业务组件
 */
import PatientAvatarInfoContent from './PatientAvatarInfoContent';
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

export { AvatarDropdown, AvatarName, PatientAvatarInfoContent };
