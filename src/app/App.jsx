import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RoutesConfig from './RoutesConfig'
import './Style/App.css'

function App() {

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "72px" }}>
        <RoutesConfig></RoutesConfig>
      </main>
      <Footer />
    </>
  )
}

export default App
