import { gql } from "@apollo/client";

export const UNIQUE_RUT = gql`
  query UniqueRUT($rut: String!) {
    uniqueRUT(rut: $rut) {
      success
      message
    }
  }
`;
