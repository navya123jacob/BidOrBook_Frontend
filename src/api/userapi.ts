import userEndpoints from "../services/endpoints/userEndpoints";
import Api from "../services/api";
import { toast } from "react-toastify";
import { AxiosError, AxiosResponse } from "axios";


export const signup = async (user: Object) => {
    try {
      const response = await Api.post(userEndpoints.signup, user);
      console.log('ethi')
      console.log(response);
      return response;
    } catch (error) {
        console.log('preshnan')
      if (error && (error as AxiosError).isAxiosError) {
        console.log(error);
      } else {
        toast.error("Something went wrong");
      }
    }
  };