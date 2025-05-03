/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
      role
      verified
      license
      specialization
      experience
      facility_type
      address
      description
      availability
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        role
        verified
        license
        specialization
        experience
        facility_type
        address
        description
        availability
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getAssignment = /* GraphQL */ `
  query GetAssignment($id: ID!) {
    getAssignment(id: $id) {
      id
      clientId
      client {
        id
        name
        email
        role
        verified
        license
        specialization
        experience
        facility_type
        address
        description
        availability
        createdAt
        updatedAt
        owner
        __typename
      }
      nurseId
      nurse {
        id
        name
        email
        role
        verified
        license
        specialization
        experience
        facility_type
        address
        description
        availability
        createdAt
        updatedAt
        owner
        __typename
      }
      specialization
      date
      shift
      status
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listAssignments = /* GraphQL */ `
  query ListAssignments(
    $filter: ModelAssignmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAssignments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        clientId
        nurseId
        specialization
        date
        shift
        status
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getVerification = /* GraphQL */ `
  query GetVerification($id: ID!) {
    getVerification(id: $id) {
      id
      userId
      name
      role
      identifier
      submissionDate
      status
      reviewedBy
      reviewedAt
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listVerifications = /* GraphQL */ `
  query ListVerifications(
    $filter: ModelVerificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVerifications(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        name
        role
        identifier
        submissionDate
        status
        reviewedBy
        reviewedAt
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
