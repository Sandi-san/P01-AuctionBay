import { FC } from 'react'
import Routes from './routes/Routes'
import { usePageIdentification } from './hooks/usePageIdentification'
import { observer } from 'mobx-react'
import './styles.css'

//MAIN PAGE OD APLIKACIJE
const App: FC = () => {
  usePageIdentification()

  return (
    <div className="bg-gray-100 min-h-screen">
      <Routes />
    </div>
  )
}

export default observer(App)
