import axios from 'axios';
import { defineEventHandler, createError } from 'h3';

const runtimeConfig = useRuntimeConfig()
const axiosInstance = axios.create({ baseURL: runtimeConfig['baseUrl'] })

export default defineEventHandler(async (event) => {

  try {
   console.log(runtimeConfig['baseUrl'] );
    // Assign headers to new request
    axiosInstance.defaults.headers.post = { ...getHeaders(event) }

    const reqBody = await readBody(event)
    // Send Data to external API
    const externalResponse = await axiosInstance.post(
      '/customers/request-otp', 
      reqBody,
    );
    // Return the response data from external API
    return externalResponse.data;

  } catch (error: any) {
    throw createError({
      statusCode: error.status ?? 523,
      statusMessage: error.message.includes('ENETUNREACH') ? 'Network Error' : error.message.includes('EHOSTUNREACH') ? 'An unexpected error occurred. Please contact support with Reference ID: B100' : error.message,
      data: error.response?.data.includes('DOCTYPE') ? error.response?.statusText : error.response?.data || null,
    });
  }
});
