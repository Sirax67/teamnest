import { auth } from "@/src/server/auth/auth";
import {headers as nextHeaders} from "next/headers"
import { redirect } from "next/navigation";
import { Sidebar } from "./sidebar";

export default async function AdminLayout ({
    children,
}: {
    children:  React.ReactNode;
}) {
     const session = await auth.api.getSession({
        headers: await nextHeaders(),
      });

    if (session?.user.role !== "ADMIN") {
        redirect("/")
    }
    return  <div className="">
        <Sidebar/>
        {children}
    </div>
}