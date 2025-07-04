/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable consistent-return */
import axios from "axios";

const api_form: any = axios.create({
  baseURL: "http://localhost:8000/api/produtos/",
});

api_form.getAllproducts = async () => {
  try {
    const response = await api_form.get("return_all/");
    return response;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      throw error;
    }
  }
};

api_form.allLocals = async () => {
  try {
    const response = await api_form.get('return_all_locals/');
    return response;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      throw error;
    }
  }
};

api_form.getFilteredProductsByLocal = async (id: number) => { 
  try {
    // Remover a barra extra ao final do id na URL
    const response = await api_form.get(`return_filter?local_id=${id}`);
    return response;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      throw error;
    }
  }
};


api_form.createUser = async (data: any) => {
  try {
    const response = await api_form.post("usuarios/", data);
    return response;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      throw error;
    }
  }
};

api_form.getDataSuap = async (token: string) => {
  try {
    const response = await api_form.get(
      "https://suap.ifrn.edu.br/api/v2/minhas-informacoes/meus-dados/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      throw error;
    }
  }
};

export { api_form };
