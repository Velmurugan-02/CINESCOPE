import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Style/App.css'
import RoutesConfig from './RoutesConfig'

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
