/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getShift = /* GraphQL */ `
  query GetShift($id: ID!) {
    getShift(id: $id) {
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
export const listShifts = /* GraphQL */ `
  query ListShifts(
    $filter: ModelShiftFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listShifts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const shiftsByClientIdAndDate = /* GraphQL */ `
  query ShiftsByClientIdAndDate(
    $clientId: ID!
    $date: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelShiftFilterInput
    $limit: Int
    $nextToken: String
  ) {
    shiftsByClientIdAndDate(
      clientId: $clientId
      date: $date
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const shiftsByNurseIdAndDate = /* GraphQL */ `
  query ShiftsByNurseIdAndDate(
    $nurseId: ID!
    $date: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelShiftFilterInput
    $limit: Int
    $nextToken: String
  ) {
    shiftsByNurseIdAndDate(
      nurseId: $nurseId
      date: $date
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
