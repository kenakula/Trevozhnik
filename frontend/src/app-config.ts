import { Account, Client } from 'appwrite';

class AppConfig {
  public projectEndpoint = import.meta.env.VITE_ENDPOINT ?? '';
  public projectID = import.meta.env.VITE_PROJECT_ID ?? '';
  private readonly _appWriteClient: Client;
  private readonly _appWriteAccount: Account;

  constructor() {
    this._appWriteClient = new Client()
      .setEndpoint(this.projectEndpoint)
      .setProject(this.projectID);

    this._appWriteAccount = new Account(this._appWriteClient);
  }

  public get appWriteClient(): Client {
    return this._appWriteClient;
  }

  public get appWriteAccount(): Account {
    return this._appWriteAccount;
  }
}

export const appConfig = new AppConfig();
