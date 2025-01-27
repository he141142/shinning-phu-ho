"use client";
import React, { ReactNode } from "react";

const TabContainerContent = (props: {content:any}) => {
  return (
    <>
      <div className="container w-[100%] p-4 mt-[80px]">
        {props.content}
      </div>
    </>
  );
};

export default TabContainerContent;
