import { gql } from "@apollo/client";

export const LOGIN_PATIENT = gql`
  mutation LoginPatient($LoginInput: LoginInput!) {
    loginPatient(input: $LoginInput) {
      id
      first_name
      access_token
    }
  }
`;

export const LOGIN_PERSONNEL = gql`
  mutation LoginPersonnel($LoginInput: LoginInput!) {
    loginPersonnel(input: $LoginInput) {
      id
      first_name
      role
      speciality
      access_token
    }
  }
`;
