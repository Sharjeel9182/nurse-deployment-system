/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onCreateUser(filter: $filter, owner: $owner) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onUpdateUser(filter: $filter, owner: $owner) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onDeleteUser(filter: $filter, owner: $owner) {
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
export const onCreateAssignment = /* GraphQL */ `
  subscription OnCreateAssignment(
    $filter: ModelSubscriptionAssignmentFilterInput
    $clientId: String
    $nurseId: String
  ) {
    onCreateAssignment(
      filter: $filter
      clientId: $clientId
      nurseId: $nurseId
    ) {
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
export const onUpdateAssignment = /* GraphQL */ `
  subscription OnUpdateAssignment(
    $filter: ModelSubscriptionAssignmentFilterInput
    $clientId: String
    $nurseId: String
  ) {
    onUpdateAssignment(
      filter: $filter
      clientId: $clientId
      nurseId: $nurseId
    ) {
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
export const onDeleteAssignment = /* GraphQL */ `
  subscription OnDeleteAssignment(
    $filter: ModelSubscriptionAssignmentFilterInput
    $clientId: String
    $nurseId: String
  ) {
    onDeleteAssignment(
      filter: $filter
      clientId: $clientId
      nurseId: $nurseId
    ) {
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
export const onCreateVerification = /* GraphQL */ `
  subscription OnCreateVerification(
    $filter: ModelSubscriptionVerificationFilterInput
    $owner: String
  ) {
    onCreateVerification(filter: $filter, owner: $owner) {
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
export const onUpdateVerification = /* GraphQL */ `
  subscription OnUpdateVerification(
    $filter: ModelSubscriptionVerificationFilterInput
    $owner: String
  ) {
    onUpdateVerification(filter: $filter, owner: $owner) {
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
export const onDeleteVerification = /* GraphQL */ `
  subscription OnDeleteVerification(
    $filter: ModelSubscriptionVerificationFilterInput
    $owner: String
  ) {
    onDeleteVerification(filter: $filter, owner: $owner) {
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
