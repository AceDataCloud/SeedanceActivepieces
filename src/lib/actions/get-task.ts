import { createAction, Property } from '@activepieces/pieces-framework';

import { seedanceAuth } from '../auth';
import { seedanceClient } from '../common/client';

export const getTask = createAction({
  name: 'get_task',
  displayName: 'Get Seedance task',
  description: 'Retrieve one existing task ID. Pending previews are not final video.',
  auth: seedanceAuth,
  props: {
    taskId: Property.ShortText({
      displayName: 'Task ID',
      description: 'Map the task_id output from Create Seedance video task. Query this same ID until it succeeds or fails.',
      required: true,
    }),
  },
  async run(context) {
    const taskId = context.propsValue.taskId.trim();
    if (!taskId) {
      throw new Error('A task ID is required.');
    }
    const response = await seedanceClient.post({
      token: context.auth.secret_text,
      path: '/seedance/tasks',
      body: { id: taskId },
    });
    return seedanceClient.normalizeTask({ body: response, taskId });
  },
});
