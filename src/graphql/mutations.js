/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createShift = /* GraphQL */ `
  mutation CreateShift(
    $input: CreateShiftInput!
    $condition: ModelShiftConditionInput
  ) {
    createShift(input: $input, condition: $condition) {
      id
      clientId
      clientName
      specialization
      date
      startTime
      endTime
      rate
      status
      nurseId
      notes
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateShift = /* GraphQL */ `
  mutation UpdateShift(
    $input: UpdateShiftInput!
    $condition: ModelShiftConditionInput
  ) {
    updateShift(input: $input, condition: $condition) {
      id
      clientId
      clientName
      specialization
      date
      startTime
      endTime
      rate
      status
      nurseId
      notes
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteShift = /* GraphQL */ `
  mutation DeleteShift(
    $input: DeleteShiftInput!
    $condition: ModelShiftConditionInput
  ) {
    deleteShift(input: $input, condition: $condition) {
      id
      clientId
      clientName
      specialization
      date
      startTime
      endTime
      rate
      status
      nurseId
      notes
      createdAt
      updatedAt
      __typename
    }
  }
`;
