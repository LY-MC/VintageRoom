import React from "react";

const WebName = (props) => {
  document.title = "Vintage room - " + props.title;
  return <div className="w-100">{props.children}</div>;
};

export default WebName;
