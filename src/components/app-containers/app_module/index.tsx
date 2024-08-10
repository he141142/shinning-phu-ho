
import { AppModule as AppModuleType } from "@/models/app-module";
import { MouseEventHandler, useState } from "react";

export default function AppContainer(prop: AppModuleType) {
  const [title,SetTitle ] = useState<string>("");


  
    return (
        <>
          <div className="flex flex-col gap-6">
            <div className="w-[200px] h-[200px] border-black">
                <img src={prop.Icon} alt="" className="rounded-3xl"/>
            </div>
            <a className="self-center font-bold text-white text-lg" href="/student" >{prop.FunctionName}</a>
          </div>
        </>
    )
}