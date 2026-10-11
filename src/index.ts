import { createPiece } from '@activepieces/pieces-framework';

import { generateVideo } from './lib/actions/generate-video';
import { getTask } from './lib/actions/get-task';
import { seedanceAuth } from './lib/auth';

export const seedance = createPiece({
  displayName: 'Seedance by Ace Data Cloud',
  description: 'Create Seedance videos and retrieve the same task through Ace Data Cloud.',
  logoUrl: 'https://cdn.acedata.cloud/assets/logo.png',
  authors: ['Ace Data Cloud'],
  minimumSupportedRelease: '0.92.2',
  auth: seedanceAuth,
  actions: [generateVideo, getTask],
  triggers: [],
});
