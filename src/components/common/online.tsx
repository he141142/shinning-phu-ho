import './index.scss'

export default function OnlineStatus(props?: any) {
    return (
        <>
            {/* <div className={`"bubble${props ? props.class ? props.class : "" : ""}"`}> */}
            <div className="bubble" style={props.style}>
                <span className="bubble-outer-dot">
                    <span className="bubble-inner-dot"></span>
                </span>
            </div></>
    )
}