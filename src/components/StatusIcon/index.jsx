import React from "react";
import "./index.less";

const Index = props => {
    return (
        <div className="status_icon">
            <div className="dot" style={{ backgroundColor: props.color }}></div>
            <div className="status_text" style={{ color: props.textColor }}>
                {props.text}
            </div>
        </div>
    );
};

export default Index;
