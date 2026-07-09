import { redirect } from "next/navigation";

export default function AdminPage() {
  redirect("/profile/main");

  return <div></div>;
}