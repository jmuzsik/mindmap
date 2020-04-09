import passwordValidator from "password-validator";

export function newPasswordValidator() {
  return new passwordValidator()
    .is()
    .min(7)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits()
    .has()
    .not()
    .spaces();
}
