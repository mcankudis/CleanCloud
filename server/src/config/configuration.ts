export const configuration = () => ({
    environment: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3545', 10),
    electricityMaps: {
        url: process.env.ELECTRICITY_MAPS_URL,
        apiKey: process.env.ELECTRICITY_MAPS_APIKEY,
        shouldBeMocked: process.env.SHOULD_MOCK_ELECTRICITY_MAPS,
    },
    db: {
        connectionString: process.env.DB_CONNECTION_STRING,
    },
    datadog: {
        apiKey: process.env.DATADOG_APIKEY,
    },
});
