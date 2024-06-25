import { gql } from "@apollo/client";

export const UNIQUE_RUT = gql`
  query UniqueRUT($rut: String!) {
    uniqueRUT(rut: $rut) {
      success
      message
    }
  }
`;

export const GET_PATIENT_APPOINTMENTS = gql`
  query GetPatientAppointments($id: Int!) {
    getPatient(id: $id) {
      appointments {
        id
        date
        time
        type
        status
        personnel {
          id
          first_name
          surname
          speciality
        }
      }
    }
  }
`;

export const GET_PATIENT_MEDICAL_RECORDS = gql`
  query GetPatientMedicalRecords($id: Int!) {
    getPatient(id: $id) {
      medical_records {
        id
        diagnosis
        prescription
        date_time
        personnel {
          id
          first_name
          surname
          speciality
        }
        appointment {
          date
          time
          box {
            branch {
              address
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_PATIENTS = gql`
  query GetAllPatients {
    getAllPatients {
      id
      rut
      birthdate
      first_name
      middle_name
      surname
      second_surname
      sex
      address
      region
      commune
      email
      phone
      medical_records {
        id
        diagnosis
        prescription
        date_time
        personnel {
          id
          first_name
          surname
          speciality
        }
        appointment {
          date
          time
          box {
            branch {
              address
            }
          }
        }
      }
    }
  }
`;

export const GET_PERSONNEL_APPOINTMENTS = gql`
  query GetPersonnelAppointments($id: Int!) {
    getPersonnel(id: $id) {
      appointments {
        id
        date
        time
        type
        status
        patient {
          id
          first_name
          surname
        }
      }
    }
  }
`;

export const GET_ALL_BRANCHES = gql`
  query GetAllBranches {
    getAllBranches {
      id
      address
      personnel {
        id
        first_name
        surname
        role
        speciality
        is_active
      }
    }
  }
`;

export const CHECK_SCHEDULE = gql`
  query CheckSchedule($input: CheckScheduleInput!) {
    checkSchedule(input: $input) {
      success
      message
    }
  }
`;
