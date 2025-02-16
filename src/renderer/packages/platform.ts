import { ElectronIPC } from "src/shared/electron-types"
import { Config, Settings } from "src/shared/types"
import { getOS } from './navigator'
import { parseLocale } from '@/i18n/parser'
import Exporter from './exporter'

export class DesktopPlatform {
    //public ipc: ElectronIPC
    //constructor(ipc: ElectronIPC) {
    //    this.ipc = ipc
    //}

    public exporter = new Exporter()

    public async getVersion() {
        return '1.0.0'
    }
    public async getPlatform() {
        return 'windows'
    }
    public async shouldUseDarkColors(): Promise<boolean> {
        return false
    }
    public onSystemThemeChange(callback: () => void) {
        //return this.ipc.onSystemThemeChange(callback)
    }
    public onWindowShow(callback: () => void): () => void {
        const handler = () => {
            if (document.visibilityState === 'visible') callback();
        };
        document.addEventListener('visibilitychange', handler);
        return () => document.removeEventListener('visibilitychange', handler);
    }
    public async openLink(url: string): Promise<void> {
        window.open(url)
    }
    public async getInstanceName(): Promise<string> {
        //const hostname = await this.ipc.invoke('getHostname')
        //return `${hostname} / ${getOS()}`
        return '123'
    }
    public async getLocale() {
        //const locale = await this.ipc.invoke('getLocale')
        return parseLocale('zh')
    }
    public async ensureShortcutConfig(config: { disableQuickToggleShortcut: boolean }): Promise<void> {
        //return this.ipc.invoke('ensureShortcutConfig', JSON.stringify(config))
    }
    public async ensureProxyConfig(config: { proxy?: string }): Promise<void> {
        //return this.ipc.invoke('ensureProxy', JSON.stringify(config))
    }
    public async relaunch(): Promise<void> {
        //return this.ipc.invoke('relaunch')
    }

    public async getConfig(): Promise<void> {
        //return this.ipc.invoke('getConfig')
    }
    public async getSettings(): Promise<void> {
        //return this.ipc.invoke('getSettings')
    }

    public async setStoreValue(key: string, value: any) {
        const valueJson = JSON.stringify(value)
        localStorage.setItem(key, valueJson)
    }
    public async getStoreValue(key: string) {
        localStorage.getItem(key)
    }
    public delStoreValue(key: string) {
        localStorage.removeItem(key)
    }
    public async getAllStoreValues(): Promise<{ [key: string]: any }> {
        return Object.keys(localStorage).reduce((acc, key) => {
            acc[key] = localStorage.getItem(key);
            return acc;
        }, {} as { [key: string]: any });
    }
    public async setAllStoreValues(data: { [key: string]: any }) {
        Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value));
        });
    }

    public initTracking(): void {
        this.trackingEvent('user_engagement', {})
    }
    public trackingEvent(name: string, params: { [key: string]: string }) {
    }

    public async shouldShowAboutDialogWhenStartUp(): Promise<boolean> {
        return false
        //return this.ipc.invoke('shouldShowAboutDialogWhenStartUp')
    }

    public async appLog(level: string, message: string) {

        //return this.ipc.invoke('appLog', JSON.stringify({ level, message }))
    }
}

export default new DesktopPlatform()
//export default new DesktopPlatform(null)
