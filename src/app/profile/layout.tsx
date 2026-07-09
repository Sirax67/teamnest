import { Sidebar } from "./sidebar";

export default async function AdminLayout ({
    children,
}: {
    children:  React.ReactNode;
}) {
     
    return  <div className="">
        <Sidebar/>
        {children}
    </div>
}