import { defineStorage } from '@aws-amplify/backend-storage';

export const storage = defineStorage({
  name: 'UserFiles',
  isDefault: true, // identify your default storage bucket (required)
  access: (allow) => ({
    'private/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ]
  })
})