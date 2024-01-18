import Profile from "../Profile"
import Playgame from "../Playgame"
import Leadboard from "../Leadboard"
import "./index.css"

const Game=()=>{
  return(
    <div className="game-main-container">
      <Profile/>
      <Playgame/>
      <Leadboard/>
    </div>
  )
}
export default Game