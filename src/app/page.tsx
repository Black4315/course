import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { getUserData } from "./lib/user";


export default async  function Home() {
  const user = await getUserData();
  return (
    
    <main className='relative'>
        <ToastContainer />
        <Header />
        <Hero user={user}/>
    </main>
    
  );
}
