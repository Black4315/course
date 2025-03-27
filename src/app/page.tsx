import { ToastContainer } from "react-toastify";
import Header from "../components/Header";
import Hero from "../components/Hero";
import { getUserData } from "../lib/user";
import { headers } from "next/headers";


export default async function Home() {
  const userAgent = (await headers()).get("user-agent") || "";
  const mobileCheck = /Mobi|Android/i.test(userAgent);

  const user = await getUserData();
  return (

    <main className='relative'>
      <ToastContainer />
      <Header />
      <Hero {...{ user, mobileCheck }} />
    </main>

  );
}
