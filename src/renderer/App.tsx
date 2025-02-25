import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import useAppTheme from './hooks/useAppTheme'
import { useI18nEffect } from './hooks/useI18nEffect'
import { useSystemLanguageWhenInit } from './hooks/useDefaultSystemLanguage'
import * as premiumActions from './stores/premiumActions'
import { Suspense, lazy } from 'react'
import { isMobile } from './packages/checkOS'

const MobilePage = lazy(() => import('./mobile/MainWindow'))
const DesktopPage = lazy(() => import('./desktop/MainWindow'))

function SelectPlatform() {
    return isMobile() ? <MobilePage /> : <DesktopPage />
}

export default function App() {
    useI18nEffect()
    premiumActions.useAutoValidate()
    useSystemLanguageWhenInit()
    const theme = useAppTheme()

    //if (document.addEventListener) {
    //    document.addEventListener('contextmenu', function (e) {
    //        //alert("You've tried to open context menu"); //here you draw your own menu
    //        e.preventDefault();
    //    }, false);
    //}
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Suspense fallback={<div>Loading...</div>}>
                <SelectPlatform />
            </Suspense>
        </ThemeProvider>
    )
}
