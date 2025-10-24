import { APIRequestContext } from "@playwright/test";
import { config } from "../config/testConfig";

export default class RestfulApiService {
    readonly path = '/objects';
    readonly baseUrl = config.processEnv.baseUrl
    //Offical Site: https://restful-api.dev/

    /**
     * GET Request that return array of existing records
     * @param request- APIRequestContext is a class designed for making HTTP(S) requests programmatically
     * @returns - Array of Devices Object
     */
    getGadget = async (request: APIRequestContext) => {
        return await request.get(this.baseUrl + this.path)
    }

    /**
     * POST Request create new record
     * @param request - APIRequestContext is a class designed for making HTTP(S) requests programmatically
     * @param payload - Payload of request
     * @returns - Device Object
     */
    createGadget = async (request: APIRequestContext, payload: Object) => {
        return await request.post(this.baseUrl + this.path, payload)
    }

    /**
     * PUT Request update a existing record
     * @param request - APIRequestContext is a class designed for making HTTP(S) requests programmatically
     * @param id - ID of the devices obj
     * @param payload - Payload of the request
     * @returns - Device Object
     */
    updateGadget = async (request: APIRequestContext, id: string, payload: Object) => {
        return await request.put(this.baseUrl + this.path + '/' + id, payload)
    }

    /**
     * PATCH Request - partially modify existing record
     * @param request - APIRequestContext is a class designed for making HTTP(S) requests programmatically
     * @param id - ID of the devices obj
     * @param payload  - Payload of the request
     * @returns - Device Object
     */
    partiallyModify = async (request: APIRequestContext, id: string, payload: Object) => {
        return await request.patch(this.baseUrl + this.path + '/' + id, payload)
    }

    /**
     * DELETE Request - delete existing record
     * @param request - APIRequestContext is a class designed for making HTTP(S) requests programmatically
     * @param id - ID of the devices obj
     * @returns - Device Object
     */
    deleteGadget = async (request: APIRequestContext, id: string) => {
        return await request.delete(this.baseUrl + this.path + '/' + id)
    }
}