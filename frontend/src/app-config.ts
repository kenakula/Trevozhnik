class AppConfig {
  public projectEndpoint = import.meta.env.VITE_ENDPOINT ?? '';
  public projectID = import.meta.env.VITE_PROJECT_ID ?? '';
  public apiKey = import.meta.env.VITE_API_KEY ?? '';
}

export const appConfig = new AppConfig();
