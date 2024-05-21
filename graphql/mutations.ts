import { gql } from "@apollo/client";

export const LOGIN_PATIENT = gql`
  mutation LoginPatient($input: LoginInput!) {
    loginPatient(input: $input) {
      id
      first_name
      access_token
    }
  }
`;

export const LOGIN_PERSONNEL = gql`
  mutation LoginPersonnel($input: LoginInput!) {
    loginPersonnel(input: $input) {
      id
      first_name
      role
      speciality
      access_token
    }
  }
`;

export const CREATE_PATIENT = gql`
  mutation CreatePatient($input: CreatePatientInput!) {
    createPatient(input: $input) {
      success
      message
    }
  }
`;

export const RECOVERY_PATIENT = gql`
  mutation RecoveryPatient($input: RecoveryUserInput!) {
    recoveryPatient(input: $input) {
      success
      message
    }
  }
`;

export const RECOVERY_PERSONNEL = gql`
  mutation RecoveryPersonnel($input: RecoveryUserInput!) {
    recoveryPersonnel(input: $input) {
      success
      message
    }
  }
`;

export const VALIDATE_RECOVERY = gql`
  mutation ValidateRecovery($input: ValidateRecoveryUserInput!) {
    validateRecovery(input: $input) {
      success
      message
    }
  }
`;

export const CHANGE_PASS_PATIENT = gql`
  mutation ChangePasswordPatient($input: ChangePasswordInput!) {
    changePasswordPatient(input: $input) {
      success
      message
    }
  }
`;

export const CHANGE_PASS_PERSONNEL = gql`
  mutation ChangePasswordPersonnel($input: ChangePasswordInput!) {
    changePasswordPersonnel(input: $input) {
      success
      message
    }
  }
`;
