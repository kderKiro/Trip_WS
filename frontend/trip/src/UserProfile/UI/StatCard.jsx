import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function StatsCard({ Title, Number, Icon, Change_rate = 0 }) {

    return (<>
        <div className='StatCard'>
            <div className='Info'>
                <h3>{Title}</h3>
                <p className={Title === "Revenu" ? "StatNum Money" : "StatNum"}>{Number} {Title === "Revenu" ? "$" : ""}</p>
                <p className={Change_rate >= 0 ? "PChange" : "NChange"}> <span>{Change_rate >= 0 ? "↑" : "↓"} {Change_rate}%</span> vs Last Month</p>
            </div>
            <div>
                <FontAwesomeIcon icon={Icon} className='Icon'></FontAwesomeIcon>
            </div>
        </div>

    </>)

}
export default StatsCard;