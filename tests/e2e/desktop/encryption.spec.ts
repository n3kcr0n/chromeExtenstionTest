import { expect, test } from '@playwright/test';
import CredentialSecurity from '../../../config/utils/credSecurity';
import { config } from '../../../config/testConfig';

test('Encryption & Decryption', async ({ page }) => {
    const sec = new CredentialSecurity()
    console.log('Encrypted: ' + sec.encrypt('test'))
    console.log('Decrypted: ' + sec.decrypt(config.processEnv.password))
})