import Box from '@mui/material/Box'
import { useAtomValue, useSetAtom } from 'jotai'
import * as atoms from '../stores/atoms'
import { useTranslation } from 'react-i18next'


export default function TitleBar() {
    const { t } = useTranslation()
    const currentSession = useAtomValue(atoms.currentSessionAtom)

    return (
        <div className='h-[30.5px] shrink-0 w-full bg-[#f2f2f2]'
            style={{ '-webkit-app-region': 'drag' }}>
        </div>
    )
}
