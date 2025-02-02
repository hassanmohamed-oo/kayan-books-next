"use client"
import { Footer,  Landing , Techoffers} from "@/components";
import { ToastContainer } from "react-toastify";
import Bookspage from "@/app/Books/page";


export default function Home() {
  return (
    <>
      <ToastContainer />
      <Landing />
      <Bookspage />
      <Techoffers />
      <Footer />
    </>
  );
}
