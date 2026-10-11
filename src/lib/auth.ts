import { PieceAuth } from '@activepieces/pieces-framework';

export const seedanceAuth = PieceAuth.SecretText({
  displayName: 'Ace Data Cloud API key',
  description:
    'Use an API key with Seedance access from https://platform.acedata.cloud/console/applications. Enter only the key, without Bearer.',
  required: true,
});
