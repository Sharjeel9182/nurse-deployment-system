/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createAssignment = /* GraphQL */ `
  mutation CreateAssignment(
    $input: CreateAssignmentInput!
    $condition: ModelAssignmentConditionInput
  ) {
    createAssignment(input: $input, condition: $condition) {
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
export const updateAssignment = /* GraphQL */ `
  mutation UpdateAssignment(
    $input: UpdateAssignmentInput!
    $condition: ModelAssignmentConditionInput
  ) {
    updateAssignment(input: $input, condition: $condition) {
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
export const deleteAssignment = /* GraphQL */ `
  mutation DeleteAssignment(
    $input: DeleteAssignmentInput!
    $condition: ModelAssignmentConditionInput
  ) {
    deleteAssignment(input: $input, condition: $condition) {
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
export const createVerification = /* GraphQL */ `
  mutation CreateVerification(
    $input: CreateVerificationInput!
    $condition: ModelVerificationConditionInput
  ) {
    createVerification(input: $input, condition: $condition) {
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
export const updateVerification = /* GraphQL */ `
  mutation UpdateVerification(
    $input: UpdateVerificationInput!
    $condition: ModelVerificationConditionInput
  ) {
    updateVerification(input: $input, condition: $condition) {
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
export const deleteVerification = /* GraphQL */ `
  mutation DeleteVerification(
    $input: DeleteVerificationInput!
    $condition: ModelVerificationConditionInput
  ) {
    deleteVerification(input: $input, condition: $condition) {
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
