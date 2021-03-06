import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const humps = require('humps')

const instance = axios.create({
  baseURL: process.env['NX_AXIOS_BASE_URL'],
  timeout: 3000,
  withCredentials: true,
})

instance.interceptors.request.use((config: AxiosRequestConfig) => {
  const { data } = config

  if (data) {
    config.data = humps.decamelizeKeys(data)
  }

  return config
})

instance.interceptors.response.use(
  (response: AxiosResponse) => ({
    ...response,
    ok: true,
    data: humps.camelizeKeys(response.data),
  }),
  async (error: AxiosError) => {
    const {
      response = {
        ok: false,
        data: {
          message: '请求失败，请稍后再试',
        },
      },
    } = error

    return response
  }
)

export interface MyRequestConfig<D = any> extends AxiosRequestConfig<D> {
  showError?: boolean
}

export interface MyResponse<T = any, D = any> extends AxiosResponse<T, D> {
  ok: boolean
  message?: string
}

export const $axios = {
  get: <T = any, R = MyResponse<T>, D = any>(
    url: string,
    config?: MyRequestConfig<D>
  ): Promise<R> => {
    return instance.get(url, config)
  },

  post: <T = any, R = MyResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: MyRequestConfig<D>
  ): Promise<R> => {
    return instance.post(url, data, config)
  },

  put: <T = any, R = MyResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: MyRequestConfig<D>
  ): Promise<R> => {
    return instance.put(url, data, config)
  },

  delete: <T = any, R = MyResponse<T>, D = any>(
    url: string,
    config?: MyRequestConfig<D>
  ): Promise<R> => {
    return instance.delete(url, config)
  },
}
