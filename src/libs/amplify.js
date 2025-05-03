import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';

// Configure Amplify
Amplify.configure(awsExports);

// Export configured clients for use throughout the app
export { generateClient } from 'aws-amplify/api';