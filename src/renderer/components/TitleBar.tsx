import Box from '@mui/material/Box'
import { useAtomValue, useSetAtom } from 'jotai'
import * as atoms from '../stores/atoms'
import { useTranslation } from 'react-i18next'
import icon from '@/static/icon.png'

export default function TitleBar() {
    const { t } = useTranslation()
    const currentSession = useAtomValue(atoms.currentSessionAtom)

    return (
        <div className="h-[30.5px] shrink-0 w-full bg-[#f2f2f2]" style={{ '-webkit-app-region': 'drag' }}>
            <img src={icon} className="w-6 h-6 ml-[13px] mt-[7px]" />
        </div>
    )
}
