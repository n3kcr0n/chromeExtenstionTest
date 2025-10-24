
interface testConfig {
    username: string;
    password: string;
    extension: string;
    baseUrl: string;
}

export const config: { processEnv: testConfig } = {
    processEnv: {
        username: process.env.TEST_USERNAME || "defaultUsername",
        password: process.env.TEST_PASSWORD || "defaultPassword",
        extension: process.env.TEST_EXTENSION || 'defaultExtPath',
        baseUrl: process.env.RESTFUL_API || 'defaultAPIUrl'
    }
}