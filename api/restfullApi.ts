import { APIRequestContext } from "@playwright/test";
import { config } from "../config/testConfig";

export default class RestfulApiService {
    readonly path = '/objects';
    readonly baseUrl = config.processEnv.baseUrl

    getGadgets = async (request: APIRequestContext) => {
        return await request.get(this.baseUrl + this.path)
    }

    createGadget = async (request: APIRequestContext, payload: Object) => {
        return await request.post(this.baseUrl + this.path, payload)
    }

    updateGadget = async (request: APIRequestContext, id: string, payload: Object) => {
        return await request.put(this.baseUrl + this.path + '/' + id, payload)
    }

    patchGadget = async (request: APIRequestContext, id: string, payload: Object) => {
        return await request.patch(this.baseUrl + this.path + '/' + id, payload)
    }

    deleteGadget = async (request: APIRequestContext, id: string) => {
        return await request.delete(this.baseUrl + this.path + '/' + id)
    }
}