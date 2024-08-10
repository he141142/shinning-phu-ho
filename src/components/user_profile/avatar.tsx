import { UserDisplay, UserInfo } from "@/models/user-info";

export function Avatar(props: UserDisplay) {
  return (
    <div className="flex flex-row gap-3 justify-center">
      <div className="flex flex-col text-white justify-center">
        <h1>Hello, </h1>
        <h1>{props.username}</h1>
      </div>
      <div className="h-[80px]">
        <img src={props.avatar} className="w-full h-full rounded-full"></img>
      </div>
    </div>
  );
}
