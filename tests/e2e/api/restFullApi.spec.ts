import { expect, test } from "@playwright/test";
import pixelProData from '../../../api/apiTestData/pixelPro.json'
import macBookData from '../../../api/apiTestData/appleMacBookPro.json'
import appMacBookProMax from '../../../api/apiTestData/appMacBookProMax.json'
import imacData from '../../../api/apiTestData/imacPro.json'
import restfulApiService from "../../../api/restfullApi";

test.describe.serial('API CRUD: restful API: https://restful-api.dev/: ', { tag: ['@Regression', '@Api'] }, () => {
    const apiService = new restfulApiService();
    let id: string;

    test('GET: Google Pixel 6 Pro Objects', async ({ request }) => {
        const response = await apiService.getGadgets(request);
        const body = await response.json();
        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining(pixelProData)
            ])
        );
        expect(response.status()).toBe(200);
        expect(body.some((item: any) => item.name === 'Google Pixel 6 Pro')).toBeTruthy();
    });

    test('POST: Create Apple MacBook Pro 16', async ({ request }) => {
        const response = await apiService.createGadget(request, macBookData)
        const body = await response.json()
        id = body.id
        //console.log(id)
        expect(response.status()).toEqual(200);
        expect(body.name).toBe('Apple MacBook Pro 16');
    });

    test('PUT: Modify to Apple MacBook Pro 99', async ({ request }) => {
        const response = await apiService.updateGadget(request, id, appMacBookProMax)
        expect(response.status()).toEqual(200);
        expect(await response.text()).toContain('Apple MacBook Pro 99')
    })

    test('PATCH: Slight Modification to Apple MacBook Pro 100', async ({ request }) => {
        const response = await apiService.patchGadget(request, id, imacData)
        expect(response.status()).toEqual(200);
        expect(await response.text()).toContain('Apple MacBook Pro 100')
    })

    test('DELETE: Object the created object', async ({ request }) => {
        const response = await apiService.deleteGadget(request, id)
        expect(response.status()).toEqual(200);
        const responseText = await response.text();
        expect(responseText).toMatch(new RegExp(id));
    })
});

