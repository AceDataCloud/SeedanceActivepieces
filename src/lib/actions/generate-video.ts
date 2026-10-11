import { createAction, Property } from '@activepieces/pieces-framework';

import { seedanceAuth } from '../auth';
import { seedanceClient } from '../common/client';

export const generateVideo = createAction({
  name: 'generate_video',
  displayName: 'Create Seedance video task',
  description: 'Submit one text-to-video generation and return its task ID. This action does not wait for final video.',
  auth: seedanceAuth,
  props: {
    prompt: Property.LongText({
      displayName: 'Video description',
      description: 'Describe the scene and motion. Use Get Seedance task with the returned task ID.',
      required: true,
    }),
    model: Property.StaticDropdown({
      displayName: 'Model',
      required: true,
      defaultValue: 'doubao-seedance-2-0-mini-260615',
      options: {
        options: [
          { label: 'Seedance 2.0 Mini', value: 'doubao-seedance-2-0-mini-260615' },
          { label: 'Seedance 2.0 Fast', value: 'doubao-seedance-2-0-fast-260128' },
          { label: 'Seedance 2.0', value: 'doubao-seedance-2-0-260128' },
        ],
      },
    }),
    resolution: Property.StaticDropdown({
      displayName: 'Resolution',
      description: '480p and 720p are supported by all models offered here.',
      required: true,
      defaultValue: '480p',
      options: { options: [
        { label: '480p', value: '480p' },
        { label: '720p', value: '720p' },
      ] },
    }),
    duration: Property.Number({
      displayName: 'Duration in seconds',
      description: 'A whole number from 4 to 15 for the Seedance 2.0 models offered here.',
      required: true,
      defaultValue: 4,
    }),
    ratio: Property.StaticDropdown({
      displayName: 'Aspect ratio',
      required: true,
      defaultValue: '16:9',
      options: { options: [
        { label: '16:9', value: '16:9' },
        { label: '9:16', value: '9:16' },
        { label: '1:1', value: '1:1' },
      ] },
    }),
    generateAudio: Property.Checkbox({
      displayName: 'Generate audio',
      description: 'Optional audio generation can change the current price.',
      required: false,
      defaultValue: false,
    }),
  },
  async run(context) {
    const { prompt, model, resolution, duration, ratio, generateAudio } = context.propsValue;
    if (!prompt.trim()) {
      throw new Error('A video description is required.');
    }
    if (!Number.isInteger(duration) || duration < 4 || duration > 15) {
      throw new Error('Duration must be a whole number from 4 to 15 seconds.');
    }
    const response = await seedanceClient.post({
      token: context.auth.secret_text,
      path: '/seedance/videos',
      body: {
        model,
        content: [{ type: 'text', text: prompt }],
        resolution,
        duration,
        ratio,
        generate_audio: generateAudio ?? false,
        callback_url: 'https://api.acedata.cloud/health',
      },
    });
    const taskId = seedanceClient.taskIdFromSubmission(response);
    if (!taskId) {
      throw new Error('No task ID was returned. Inspect request history before submitting again.');
    }
    return { task_id: taskId, status: 'pending', success: false };
  },
});
