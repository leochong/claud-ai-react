import { defineStorage } from '@aws-amplify/backend-storage';

export const storage = defineStorage({
  name: 'UserFiles',
  bucket: {
    name: 'user-files-storage-bucket',
  },
  permissions: {
    authenticated: {
      access: ['read', 'write'],
      folders: {
        private: {
          access: ['read', 'write'],
          keyPrefix: 'private/${cognito-identity.amazonaws.com:sub}/'
        }
      }
    }
  }
});