import { Account, Client } from 'node-appwrite';

import { appConfig } from '@/app-config';

const { projectEndpoint, projectID } = appConfig;

const client = new Client()
  .setEndpoint(projectEndpoint)
  .setProject(projectID);

export const account = new Account(client);
