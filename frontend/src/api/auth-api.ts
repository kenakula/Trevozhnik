import { axiosInstance } from '@api/axios';
import { IUser } from '@shared/interfaces';
import { AxiosInstance } from 'axios';

class AuthApi {
  private readonly _axiosInstance: AxiosInstance;

  constructor() {
    this._axiosInstance = axiosInstance;
  }

  public async logout(): Promise<object> {
    return this._axiosInstance.get('/auth/logout')
      .then(res => res.data);
  }

  public async login(email: string, password: string): Promise<IUser> {
    return this._axiosInstance.post<IUser>('/auth/login', { email, password })
      .then(res => res.data);
  }

  public async signup(email: string, password: string): Promise<IUser> {
    return this._axiosInstance.post<IUser>('/auth/signup', { email, password })
      .then(res => res.data);
  }

  public async getUser(): Promise<IUser> {
    return this._axiosInstance.get<IUser>('/auth/user').then(res => res.data);
  }
}

export const authApi = new AuthApi();
