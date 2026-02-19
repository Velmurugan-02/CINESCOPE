import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Style/App.css'
import RoutesConfig from './RoutesConfig'

function App() {

  return (
    <>
      <Navbar />
        <RoutesConfig></RoutesConfig>
      <Footer />
    </>
  )
}

export default App
