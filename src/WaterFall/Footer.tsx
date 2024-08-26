

export const WaterFooter = (props:any)=>{

    const {title,nickname,likeCount,avatar} = props
    return (
        <div className="footer">
            <div className="title">{title}</div>
            <div className="author">
                <div style={{display:'flex'}}>
                    {/* <div className="avatar"></div> */}
                    <img className="avatar" src={avatar}></img>
                     <span className="name">{nickname}</span>
                </div>
                
                <div className="likeCount">{likeCount}</div>
            </div>
                
        </div>
    )
}