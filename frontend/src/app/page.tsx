import { redirect } from "next/navigation";
import { ROLE_HOME } from "@/utils/roles";
import { getSession } from "@/utils/session";

export default async function Home() {
  const session = await getSession();
  redirect(session ? ROLE_HOME[session.role] : "/login");
}
