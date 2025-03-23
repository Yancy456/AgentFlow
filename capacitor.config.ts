import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.chatflow.com',
    appName: 'ChatFlow',
    webDir: 'release/app/dist/renderer',
    plugins: {
        CapacitorHttp: {
            enabled: true,
        },
    }
};

export default config;
