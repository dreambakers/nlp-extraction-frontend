import { environment } from '../environments/environment';

export const constants = {
    version: '0.1',
    apiUrl: 'http://localhost:3000',
    jobStatus: {
        running: 'running',
        completed: 'completed',
        failed: 'failed',
    },
    jobFunctions: {
        stats: 'stats',
        guidance: 'guidance'
    },
    jobFunctionCodes: {
        stats: '1',
        guidance: '2',
        both: '3'
    },
    emitterKeys: {
        jobStarted: 'jobStarted'
    }
}